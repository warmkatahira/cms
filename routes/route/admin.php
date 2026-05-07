<?php

use Illuminate\Support\Facades\Route;

// +-+-+-+-+-+-+-+- 従業員一覧 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Admin\Employee\EmployeeController;
// +-+-+-+-+-+-+-+- 従業員ダウンロード +-+-+-+-+-+-+-+-
use App\Http\Controllers\Admin\Employee\EmployeeDownloadController;
// +-+-+-+-+-+-+-+- 従業員追加 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Admin\Employee\EmployeeCreateController;
// +-+-+-+-+-+-+-+- 従業員更新 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Admin\Employee\EmployeeUpdateController;
// +-+-+-+-+-+-+-+- 取込履歴 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Admin\ImportHistory\ImportHistoryController;
// +-+-+-+-+-+-+-+- ファイル取込 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Admin\FileImport\FileImportController;

Route::middleware('common')->group(function (){
    Route::middleware(['base_admin_check'])->group(function () {
        // +-+-+-+-+-+-+-+- 従業員一覧 +-+-+-+-+-+-+-+-
        Route::controller(EmployeeController::class)->prefix('employee')->name('employee.')->group(function(){
            Route::get('', 'index')->name('index');
        });
        // +-+-+-+-+-+-+-+- 従業員ダウンロード +-+-+-+-+-+-+-+-
        Route::controller(EmployeeDownloadController::class)->prefix('employee_download')->name('employee_download.')->group(function(){
            Route::get('download', 'download')->name('download');
        });
        Route::middleware(['admin_check'])->group(function () {
            // +-+-+-+-+-+-+-+- 従業員追加 +-+-+-+-+-+-+-+-
            Route::controller(EmployeeCreateController::class)->prefix('employee_create')->name('employee_create.')->group(function(){
                Route::get('', 'index')->name('index');
                Route::post('create', 'create')->name('create');
                Route::post('import', 'import')->name('import');
            });
            // +-+-+-+-+-+-+-+- 従業員更新 +-+-+-+-+-+-+-+-
            Route::controller(EmployeeUpdateController::class)->prefix('employee_update')->name('employee_update.')->group(function(){
                Route::get('', 'index')->name('index');
                Route::post('update', 'update')->name('update');
            });
        });
    });
    Route::middleware(['admin_check'])->group(function () {
        // +-+-+-+-+-+-+-+- ファイル取込 +-+-+-+-+-+-+-+-
        Route::controller(FileImportController::class)->prefix('file_import')->name('file_import.')->group(function(){
            Route::get('', 'index')->name('index');
            Route::post('import', 'import')->name('import');
        });
        // +-+-+-+-+-+-+-+- 取込履歴 +-+-+-+-+-+-+-+-
        Route::controller(ImportHistoryController::class)->prefix('import_history')->name('import_history.')->group(function(){
            Route::get('', 'index')->name('index');
        });
    });
});