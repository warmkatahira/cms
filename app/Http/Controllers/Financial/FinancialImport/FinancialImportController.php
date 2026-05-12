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
                $financial_file_info = $FinancialImportService->importFile($request->file('financial_file'), FinancialImportEnum::SAVE_FILE_NAME_PREFIX);
                // インポートしたデータのヘッダーを確認
                $FinancialImportService->checkHeader($financial_file_info, $nowDate);
                // 追加する受注データを配列に格納（同時にバリデーションも実施）
                $financial_create_data = $FinancialImportService->setArrayImport($financial_file_info, $nowDate);
                // financial_importsへデータを追加
                $FinancialImportService->createArrayImportData($financial_create_data);
                // base_idをbase_nameから更新
                $FinancialImportService->updateBaseId($financial_file_info['original_file_name']);
                // financial_import_historiesテーブルへ追加
                $FinancialImportHistoryCreateService->createFinancialImportHistory($financial_file_info['original_file_name'], null, null);
            });
        } catch (FinancialImportException $e) {
            // 渡された内容を取得
            $message                    = $e->getMessage();
            $import_original_file_name  = $e->getImportOriginalFileName();
            $error_file_name            = $e->getErrorFileName();
            // import_historiesテーブルへ追加
            $FinancialImportHistoryCreateService->createFinancialImportHistory($import_original_file_name, $error_file_name, $message);
            return redirect()->route('financial_import_history.index')->with([
                'alert_type'    => 'error',
                'alert_message' => $e->getMessage(),
            ]);
        }
        return redirect()->route('financial_import_history.index')->with([
            'alert_type'    => 'success',
            'alert_message' => '収支データ取込が完了しました。',
        ]);
    }
}