<?php

use Illuminate\Support\Facades\Route;

// +-+-+-+-+-+-+-+- 分析 +-+-+-+-+-+-+-+-
use App\Http\Controllers\Dashboard\DashboardController;

Route::middleware('common')->group(function (){
    // -+-+-+-+-+-+-+-+-+-+-+-+ 分析 -+-+-+-+-+-+-+-+-+-+-+-+
    Route::controller(DashboardController::class)->prefix('dashboard')->name('dashboard.')->group(function(){
        Route::get('', 'index')->name('index');
        Route::get('ajax_get_chart_data', 'ajax_get_chart_data');
    });
});