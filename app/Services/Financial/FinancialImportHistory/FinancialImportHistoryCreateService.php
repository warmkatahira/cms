<?php

namespace App\Services\Financial\FinancialImportHistory;

// モデル
use App\Models\FinancialImportHistory;
// その他
use Illuminate\Support\Facades\Auth;

class FinancialImportHistoryCreateService
{
    // financial_import_historiesテーブルへ追加
    public function createFinancialImportHistory($importOriginalFileName, $errorFileName, $message)
    {
        FinancialImportHistory::create([
            'importOriginalFileName'    => $importOriginalFileName,
            'errorFileName'             => $errorFileName,
            'message'                   => $message,
            'imported_by'               => Auth::user()->user_no,
        ]);
    }
}