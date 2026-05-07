<?php

use Illuminate\Support\Facades\Route;

// +-+-+-+-+-+-+-+- エラーダウンロード +-+-+-+-+-+-+-+-
use App\Http\Controllers\Common\ErrorFileDownloadController;

Route::middleware('common')->group(function (){
    // +-+-+-+-+-+-+-+- エラーダウンロード +-+-+-+-+-+-+-+-
    Route::controller(ErrorFileDownloadController::class)->prefix('error_file_download')->name('error_file_download.')->group(function(){
        Route::get('download', 'download')->name('download');
    });
});