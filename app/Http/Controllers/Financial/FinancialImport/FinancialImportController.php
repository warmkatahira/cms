<?php

namespace App\Http\Controllers\Financial\FinancialImport;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// リクエスト
use App\Http\Requests\Financial\FinancialImport\FinancialImportRequest;
// サービス
use App\Services\Financial\FinancialImport\FinancialImportService;
use App\Services\Financial\FinancialImportHistory\FinancialImportHistoryCreateService;
// 列挙
use App\Enums\FinancialImportEnum;
// 例外
use App\Exceptions\FinancialImportException;
// その他
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

class FinancialImportController extends Controller
{
    public function index()
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => 'データ取込']);
        return view('financial.financial_import.index');
    }

    public function import(FinancialImportRequest $request)
    {
        // インスタンス化
        $FinancialImportHistoryCreateService = new FinancialImportHistoryCreateService;
        try {
            DB::transaction(function () use ($request, $FinancialImportHistoryCreateService) {
                // インスタンス化
                $FinancialImportService = new FinancialImportService;
                // 現在の日時を取得
                $nowDate = CarbonImmutable::now();
                // 選択したファイルをストレージにインポート
                $financialFileInfo = $FinancialImportService->importFile($request->file('financial_file'), FinancialImportEnum::saveFileName_PREFIX);
                // インポートしたデータのヘッダーを確認
                $FinancialImportService->checkHeader($financialFileInfo, $nowDate);
                // 追加する受注データを配列に格納（同時にバリデーションも実施）
                $financialCreateData = $FinancialImportService->setArrayImport($financialFileInfo, $nowDate);
                // financialImportsへデータを追加
                $FinancialImportService->createFinancialImport($financialCreateData);
                // base_idをbase_nameから更新
                $FinancialImportService->updateBaseId($financialFileInfo['originalFileName']);
                // 既に取り込まれている営業所×年月でないか確認
                $FinancialImportService->checkDuplicateMonthlyFinancials($financialFileInfo['originalFileName']);
                // client_alias_nameが登録されているか確認
                $unregistered = $FinancialImportService->checkClientAliases($financialFileInfo['originalFileName']);
                // 未登録の顧客エイリアスがある場合
                if(!empty($unregistered)){
                    // セッションに格納して処理を抜ける
                    session(['unregisteredAliases' => $unregistered]);
                    return;
                }
                // monthly_financialsテーブルへ追加
                $FinancialImportService->createMonthlyFinancials();
                // financial_import_historiesテーブルへ追加
                $FinancialImportHistoryCreateService->createFinancialImportHistory($financialFileInfo['originalFileName'], null, null);
            });
        } catch (FinancialImportException $e) {
            // 渡された内容を取得
            $message                    = $e->getMessage();
            $importOriginalFileName     = $e->getImportOriginalFileName();
            $errorFileName              = $e->getErrorFileName();
            // import_historiesテーブルへ追加
            $FinancialImportHistoryCreateService->createFinancialImportHistory($importOriginalFileName, $errorFileName, $message);
            return redirect()->route('financial_import_history.index')->with([
                'alert_type'    => 'error',
                'alert_message' => $e->getMessage(),
            ]);
        }
        // 未登録の顧客エイリアスがある場合
        if(session('unregisteredAliases')){
            return redirect()->route('client_alias_create.index')->with([
                'alert_type'    => 'info',
                'alert_message' => "収支データ取込が完了しました。\n未登録の荷主名があるので、登録を行って下さい。",
            ]);
        }
        return redirect()->route('financial_import_history.index')->with([
            'alert_type'    => 'success',
            'alert_message' => '収支データ取込が完了しました。',
        ]);
    }
}