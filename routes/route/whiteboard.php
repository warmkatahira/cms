<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Whiteboard\Whiteboard\WhiteboardController;
use App\Http\Controllers\Whiteboard\OrgChart\OrgChartController;
use App\Http\Controllers\Whiteboard\OrgChart\ItemController;
use App\Http\Controllers\Whiteboard\OrgChart\StaffController;
use App\Http\Controllers\Whiteboard\OrgChart\ZoneController;
use App\Http\Controllers\Whiteboard\OrgChart\TextController;

Route::middleware('common')->group(function () {
    // ホワイトボード一覧
    Route::controller(WhiteboardController::class)->prefix('whiteboard')->name('whiteboard.')->group(function () {
        Route::get('',                    'index')->name('index');
        Route::post('',                   'store')->name('store');
        Route::patch('{whiteboard}',      'update')->name('update');
        Route::patch('{whiteboard}/users','updateUsers')->name('update_users');
        Route::delete('{whiteboard}',     'destroy')->name('destroy');
    });
    // 組織図
    Route::controller(OrgChartController::class)->prefix('org_chart')->name('org_chart.')->group(function () {
        Route::get('', 'index')->name('index');
    });
    // アイテム座標保存
    Route::controller(ItemController::class)->prefix('org_chart')->name('org_chart.')->group(function () {
        Route::post('item', 'updateItem')->name('update_item');
    });
    // スタッフ
    Route::controller(StaffController::class)->prefix('org_chart')->name('org_chart.')->group(function () {
        Route::post('staff',           'store')->name('store_staff');
        Route::patch('staff/{staff}',  'update')->name('update_staff');
        Route::delete('staff/{staff}', 'destroy')->name('delete_staff');
    });
    // ゾーン
    Route::controller(ZoneController::class)->prefix('org_chart')->name('org_chart.')->group(function () {
        Route::post('zone',          'store')->name('store_zone');
        Route::delete('zone/{item}', 'destroy')->name('delete_zone');
    });
    // テキスト
    Route::controller(TextController::class)->prefix('org_chart')->name('org_chart.')->group(function () {
        Route::post('text',          'store')->name('store_text');
        Route::delete('text/{item}', 'destroy')->name('delete_text');
    });
});