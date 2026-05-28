<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// +-+-+-+-+-+-+-+- Welcome +-+-+-+-+-+-+-+-
use App\Http\Controllers\Welcome\WelcomeController;

// ★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆ Welcome ★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆
    // -+-+-+-+-+-+-+-+-+-+-+-+ Welcome -+-+-+-+-+-+-+-+-+-+-+-+
    Route::controller(WelcomeController::class)->prefix('')->name('welcome.')->group(function(){
        Route::get('', 'index')->name('index');
    });

require __DIR__.'/auth.php';
// 作成したルートファイルをインクルード
require __DIR__.'/route/dashboard.php';
require __DIR__.'/route/admin.php';
require __DIR__.'/route/system_admin.php';
require __DIR__.'/route/profile.php';
require __DIR__.'/route/financial.php';
require __DIR__.'/route/common.php';
require __DIR__.'/route/client.php';
require __DIR__.'/route/base.php';