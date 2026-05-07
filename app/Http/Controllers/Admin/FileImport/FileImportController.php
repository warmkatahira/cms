<?php

namespace App\Http\Controllers\Admin\FileImport;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// リクエスト
use App\Http\Requests\Admin\FileImport\FileImportRequest;
// サービス
use App\Services\Admin\FileImport\FileImportService;
use App\Services\Admin\FileImport\UserCreateService;
use App\Services\Admin\FileImport\UserUpdateService;
use App\Services\Admin\FileImport\PaidLeaveUpdateService;
use App\Services\Admin\FileImport\ImportHistoryCreateService;
// 列挙
use App\Enums\FileImportEnum;
// 例外
use App\Exceptions\FileImportException;
// その他
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

class FileImportController extends Controller
{
    public function index()
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => 'ファイル取込']);
        return view('admin.file_import.index');
    }

    public function import(FileImportRequest $request)
    {
        // インスタンス化
        $ImportHistoryCreateService = new ImportHistoryCreateService;
        try {
            DB::transaction(function () use ($request, $ImportHistoryCreateService) {
                // インスタンス化
                $FileImportService = new FileImportService;
                $UserCreateService = new UserCreateService;
                $UserUpdateService = new UserUpdateService;
                $PaidLeaveUpdateService = new PaidLeaveUpdateService;
                // 現在の日時を取得
                $nowDate = CarbonImmutable::now();
                // 選択したファイルをストレージにインポート
                $employee_file_info = $FileImportService->importFile($request->file('employee_file'), FileImportEnum::FILE_IMPORT_TYPE_EMPLOYEE);
                $paid_leave_file_info = $FileImportService->importFile($request->file('paid_leave_file'), FileImportEnum::FILE_IMPORT_TYPE_PAID_LEAVE);
                // インポートしたデータのヘッダーを確認
                $FileImportService->checkHeader($employee_file_info, FileImportEnum::FILE_IMPORT_TYPE_EMPLOYEE, $nowDate);
                $FileImportService->checkHeader($paid_leave_file_info, FileImportEnum::FILE_IMPORT_TYPE_PAID_LEAVE, $nowDate);
                // 追加する受注データを配列に格納（同時にバリデーションも実施）
                $employee_create_data = $FileImportService->setArrayImport($employee_file_info, FileImportEnum::FILE_IMPORT_TYPE_EMPLOYEE, $nowDate);
                $paid_leave_create_data = $FileImportService->setArrayImport($paid_leave_file_info, FileImportEnum::FILE_IMPORT_TYPE_PAID_LEAVE, $nowDate);
                // 2ファイル間の従業員番号の差分チェック
                $FileImportService->checkEmployeeNoDiff($employee_create_data, $paid_leave_create_data, $nowDate);
                // file_importsへデータを追加
                $FileImportService->createArrayImportData($employee_create_data, $paid_leave_create_data);
                // usersテーブルに存在しない従業員番号が取り込まれていれば、追加する
                $UserCreateService->createUser();
                // usersテーブルに存在していて今回の取り込みに存在していない従業員のis_activeを無効に更新
                $missing_message = $UserUpdateService->deactivateMissingEmployees();
                // 付与月ではない従業員の使用日数をカウントアップ
                $PaidLeaveUpdateService->incrementUsedDays();
                // 付与月の従業員の処理
                $PaidLeaveUpdateService->processGrantMonth();
                // import_historiesテーブルへ追加
                $ImportHistoryCreateService->createImportHistory($employee_file_info['original_file_name'], $paid_leave_file_info['original_file_name'], null, $missing_message ? "以下の従業員を無効にしました。\n" . $missing_message : null);
            });
        } catch (FileImportException $e) {
            // 渡された内容を取得
            $message                                = $e->getMessage();
            $import_employee_original_file_name     = $e->getImportEmployeeOriginalFileName();
            $import_paid_leave_original_file_name   = $e->getImportPaidLeaveOriginalFileName();
            $error_file_name                        = $e->getErrorFileName();
            // import_historiesテーブルへ追加
            $ImportHistoryCreateService->createImportHistory($import_employee_original_file_name, $import_paid_leave_original_file_name, $error_file_name, $message);
            return redirect()->route('import_history.index')->with([
                'alert_type'    => 'error',
                'alert_message' => $e->getMessage(),
            ]);
        }
        return redirect()->route('import_history.index')->with([
            'alert_type'    => 'success',
            'alert_message' => 'ファイル取込が完了しました。',
        ]);
    }
}