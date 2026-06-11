<?php

use Illuminate\Support\Facades\Route;

// +-+-+-+-+-+-+-+- ホワイトボード +-+-+-+-+-+-+-+-
// +-+-+-+-+-+-+-+- 組織図 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Whiteboard\OrgChart\OrgChartController;

Route::middleware('common')->group(function (){
    // +-+-+-+-+-+-+-+- ホワイトボード +-+-+-+-+-+-+-+-
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