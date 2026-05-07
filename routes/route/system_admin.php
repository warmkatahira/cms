<?php

use Illuminate\Support\Facades\Route;

// +-+-+-+-+-+-+-+- 権限 +-+-+-+-+-+-+-+-
use App\Http\Controllers\SystemAdmin\Role\RoleController;
// +-+-+-+-+-+-+-+- 営業所 +-+-+-+-+-+-+-+-
use App\Http\Controllers\SystemAdmin\Base\BaseController;
use App\Http\Controllers\SystemAdmin\Base\BaseCreateController;
use App\Http\Controllers\SystemAdmin\Base\BaseUpdateController;
// +-+-+-+-+-+-+-+- ユーザー +-+-+-+-+-+-+-+-
use App\Http\Controllers\SystemAdmin\User\UserController;
use App\Http\Controllers\SystemAdmin\User\UserCreateController;
use App\Http\Controllers\SystemAdmin\User\UserUpdateController;
use App\Http\Controllers\SystemAdmin\User\PasswordResetController;
// +-+-+-+-+-+-+-+- 操作ログ +-+-+-+-+-+-+-+-
use App\Http\Controllers\SystemAdmin\OperationLog\OperationLogController;
use App\Http\Controllers\SystemAdmin\OperationLog\OperationLogDownloadController;

Route::middleware('common')->group(function (){
    Route::middleware(['system_admin_check'])->group(function () {
        // +-+-+-+-+-+-+-+- 権限 +-+-+-+-+-+-+-+-
        Route::controller(RoleController::class)->prefix('role')->name('role.')->group(function(){
            Route::get('', 'index')->name('index');
        });
        // +-+-+-+-+-+-+-+- ユーザー +-+-+-+-+-+-+-+-
        Route::controller(UserController::class)->prefix('user')->name('user.')->group(function(){
            Route::get('', 'index')->name('index');
        });
        Route::controller(UserCreateController::class)->prefix('user_create')->name('user_create.')->group(function(){
            Route::get('', 'index')->name('index');
            Route::post('create', 'create')->name('create');
        });
        Route::controller(UserUpdateController::class)->prefix('user_update')->name('user_update.')->group(function(){
            Route::get('', 'index')->name('index');
            Route::post('update', 'update')->name('update');
        });
        Route::controller(PasswordResetController::class)->prefix('password_reset')->name('password_reset.')->group(function(){
            Route::post('reset', 'reset')->name('reset');
        });
        // +-+-+-+-+-+-+-+- 操作ログ +-+-+-+-+-+-+-+-
        Route::controller(OperationLogController::class)->prefix('operation_log')->name('operation_log.')->group(function(){
            Route::get('', 'index')->name('index');
        });
        Route::controller(OperationLogDownloadController::class)->prefix('operation_log_download')->name('operation_log_download.')->group(function(){
            Route::get('download', 'download')->name('download');
        });
    });
    Route::middleware(['admin_check'])->group(function () {
        // +-+-+-+-+-+-+-+- 営業所 +-+-+-+-+-+-+-+-
        Route::controller(BaseController::class)->prefix('base')->name('base.')->group(function(){
            Route::get('', 'index')->name('index');
        });
        Route::controller(BaseCreateController::class)->prefix('base_create')->name('base_create.')->group(function(){
            Route::get('', 'index')->name('index');
            Route::post('create', 'create')->name('create');
        });
        Route::controller(BaseUpdateController::class)->prefix('base_update')->name('base_update.')->group(function(){
            Route::get('', 'index')->name('index');
            Route::post('update', 'update')->name('update');
        });
    });
});