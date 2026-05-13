<?php

use Illuminate\Support\Facades\Route;

// +-+-+-+-+-+-+-+- 顧客 +-+-+-+-+-+-+-+-
// +-+-+-+-+-+-+-+- 顧客一覧 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Client\Client\ClientController;
// +-+-+-+-+-+-+-+- エイリアス登録 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Client\ClientAlias\ClientAliasCreateController;

Route::middleware('common')->group(function (){
    // +-+-+-+-+-+-+-+- 顧客 +-+-+-+-+-+-+-+-
    // +-+-+-+-+-+-+-+- 顧客一覧 +-+-+-+-+-+-+-+-
    Route::controller(ClientController::class)->prefix('client')->name('client.')->group(function(){
        Route::get('', 'index')->name('index');
    });
    // +-+-+-+-+-+-+-+- エイリアス登録 +-+-+-+-+-+-+-+-
    Route::controller(ClientAliasCreateController::class)->prefix('client_alias_create')->name('client_alias_create.')->group(function(){
        Route::get('', 'index')->name('index');
        Route::post('create', 'create')->name('create');
    });
});