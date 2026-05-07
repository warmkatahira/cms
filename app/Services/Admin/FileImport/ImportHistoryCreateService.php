<?php

namespace App\Services\Admin\FileImport;

// モデル
use App\Models\ImportHistory;

class ImportHistoryCreateService
{
    // import_historiesテーブルへ追加
    public function createImportHistory($import_employee_original_file_name, $import_paid_leave_original_file_name, $error_file_name, $message)
    {
        ImportHistory::create([
            'import_employee_original_file_name'    => $import_employee_original_file_name,
            'import_paid_leave_original_file_name'  => $import_paid_leave_original_file_name,
            'error_file_name'                       => $error_file_name,
            'message'                               => $message,
        ]);
    }
}