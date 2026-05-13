<?php

namespace App\Services\Financial\FinancialImportHistory;

// モデル
use App\Models\FinancialImportHistory;
// その他
use Illuminate\Support\Facades\Auth;

class FinancialImportHistoryCreateService
{
    // financial_import_historiesテーブルへ追加
    public function createFinancialImportHistory($import_original_file_name, $error_file_name, $message)
    {
        FinancialImportHistory::create([
            'import_original_file_name' => $import_original_file_name,
            'error_file_name'           => $error_file_name,
            'message'                   => $message,
            'imported_by'               => Auth::user()->user_no,
        ]);
    }
}