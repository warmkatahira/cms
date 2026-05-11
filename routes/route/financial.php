<?php

use Illuminate\Support\Facades\Route;

// +-+-+-+-+-+-+-+- 収支データ +-+-+-+-+-+-+-+-
// +-+-+-+-+-+-+-+- ファイル取込 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Financial\FinancialImport\FinancialImportController;
// +-+-+-+-+-+-+-+- 取込履歴 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Financial\FinancialImportHistory\FinancialImportHistoryController;

Route::middleware('common')->group(function (){
    // +-+-+-+-+-+-+-+- 収支データ +-+-+-+-+-+-+-+-
    // +-+-+-+-+-+-+-+- データ取込 +-+-+-+-+-+-+-+-
    Route::controller(FinancialImportController::class)->prefix('financial_import')->name('financial_import.')->group(function(){
        Route::get('', 'index')->name('index');
        Route::post('import', 'import')->name('import');
    });
    // +-+-+-+-+-+-+-+- 取込履歴 +-+-+-+-+-+-+-+-
    Route::controller(FinancialImportHistoryController::class)->prefix('financial_import_history')->name('financial_import_history.')->group(function(){
        Route::get('', 'index')->name('index');
    });
});