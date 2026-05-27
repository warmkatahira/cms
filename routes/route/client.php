<?php

use Illuminate\Support\Facades\Route;

// +-+-+-+-+-+-+-+- 顧客 +-+-+-+-+-+-+-+-
// +-+-+-+-+-+-+-+- 顧客一覧 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Client\Client\ClientController;
// +-+-+-+-+-+-+-+- 顧客ダウンロード +-+-+-+-+-+-+-+-
use App\Http\Controllers\Client\Client\ClientDownloadController;
// +-+-+-+-+-+-+-+- 顧客収支ダウンロード +-+-+-+-+-+-+-+-
use App\Http\Controllers\Client\Client\ClientFinancialDownloadController;
// +-+-+-+-+-+-+-+- 顧客詳細 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Client\ClientDetail\ClientDetailController;
// +-+-+-+-+-+-+-+- エイリアス登録 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Client\ClientAlias\ClientAliasCreateController;

Route::middleware('common')->group(function (){
    // +-+-+-+-+-+-+-+- 顧客 +-+-+-+-+-+-+-+-
    // +-+-+-+-+-+-+-+- 顧客一覧 +-+-+-+-+-+-+-+-
    Route::controller(ClientController::class)->prefix('client')->name('client.')->group(function(){
        Route::get('', 'index')->name('index');
    });
    // +-+-+-+-+-+-+-+- 顧客ダウンロード +-+-+-+-+-+-+-+-
    Route::controller(ClientDownloadController::class)->prefix('client_download')->name('client_download.')->group(function(){
        Route::get('download_by_client', 'downloadByClient')->name('download_by_client');
        Route::get('download_by_alias', 'downloadByAlias')->name('download_by_alias');
    });
    // +-+-+-+-+-+-+-+- 顧客収支ダウンロード +-+-+-+-+-+-+-+-
    Route::controller(ClientFinancialDownloadController::class)->prefix('client_financial_download')->name('client_financial_download.')->group(function(){
        Route::get('download_by_client', 'downloadByClient')->name('download_by_client');
        Route::get('download_by_alias', 'downloadByAlias')->name('download_by_alias');
    });
    // +-+-+-+-+-+-+-+- 顧客詳細 +-+-+-+-+-+-+-+-
    Route::controller(ClientDetailController::class)->prefix('client_detail')->name('client_detail.')->group(function(){
        Route::get('', 'index')->name('index');
        Route::get('fiscal/{period}', 'fiscalData')->name('fiscal');
    });
    // +-+-+-+-+-+-+-+- エイリアス登録 +-+-+-+-+-+-+-+-
    Route::controller(ClientAliasCreateController::class)->prefix('client_alias_create')->name('client_alias_create.')->group(function(){
        Route::get('', 'index')->name('index');
        Route::post('create', 'create')->name('create');
    });
});