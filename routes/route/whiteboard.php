<?php

use Illuminate\Support\Facades\Route;

// +-+-+-+-+-+-+-+- ホワイトボード +-+-+-+-+-+-+-+-
// +-+-+-+-+-+-+-+- ホワイトボード一覧 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Whiteboard\Whiteboard\WhiteboardController;
// +-+-+-+-+-+-+-+- 組織図 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Whiteboard\OrgChart\OrgChartController;

Route::middleware('common')->group(function (){
    // +-+-+-+-+-+-+-+- ホワイトボード +-+-+-+-+-+-+-+-
    // +-+-+-+-+-+-+-+- ホワイトボード一覧 +-+-+-+-+-+-+-+-
    Route::controller(WhiteboardController::class)->prefix('whiteboard')->name('whiteboard.')->group(function () {
        Route::get('', 'index')->name('index');
        Route::post('', 'store')->name('store');
        Route::delete('{whiteboard}', 'destroy')->name('destroy');
    });
    // +-+-+-+-+-+-+-+- 組織図 +-+-+-+-+-+-+-+-
    Route::controller(OrgChartController::class)->prefix('org_chart')->name('org_chart.')->group(function(){
        Route::get('', 'index')->name('index');
        Route::post('item', 'updateItem')->name('update_item');
        Route::post('staff', 'storeStaff')->name('store_staff');
        Route::delete('staff/{staff}', 'deleteStaff')->name('delete_staff');
        Route::patch('staff/{staff}',  'updateStaff')->name('update_staff');
        Route::post('zone',              'storeZone')->name('store_zone');
        Route::delete('zone/{item}',     'deleteZone')->name('delete_zone');
    });
});