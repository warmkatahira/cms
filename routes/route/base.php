<?php

use Illuminate\Support\Facades\Route;

// +-+-+-+-+-+-+-+- 営業所 +-+-+-+-+-+-+-+-
// +-+-+-+-+-+-+-+- 営業所一覧 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Base\Base\BaseController;
// +-+-+-+-+-+-+-+- 営業所ダウンロード +-+-+-+-+-+-+-+-
use App\Http\Controllers\Base\Base\BaseDownloadController;
// +-+-+-+-+-+-+-+- 営業所詳細 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Base\BaseDetail\BaseDetailController;

Route::middleware('common')->group(function (){
    // +-+-+-+-+-+-+-+- 営業所 +-+-+-+-+-+-+-+-
    // +-+-+-+-+-+-+-+- 営業所一覧 +-+-+-+-+-+-+-+-
    Route::controller(BaseController::class)->prefix('base')->name('base.')->group(function(){
        Route::get('', 'index')->name('index');
    });
    // +-+-+-+-+-+-+-+- 営業所ダウンロード +-+-+-+-+-+-+-+-
    Route::controller(BaseDownloadController::class)->prefix('base_download')->name('base_download.')->group(function(){
        Route::get('download_by_base', 'downloadByBase')->name('download_by_base');
        Route::get('download_by_alias', 'downloadByAlias')->name('download_by_alias');
    });
    // +-+-+-+-+-+-+-+- 営業所詳細 +-+-+-+-+-+-+-+-
    Route::controller(BaseDetailController::class)->prefix('base_detail')->name('base_detail.')->group(function(){
        Route::get('', 'index')->name('index');
        Route::get('fiscal/{period}', 'fiscalData')->name('fiscal');
    });
});