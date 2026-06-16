<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Whiteboard\Whiteboard\WhiteboardController;
use App\Http\Controllers\Whiteboard\Board\BoardController;
use App\Http\Controllers\Whiteboard\Board\ItemController;
use App\Http\Controllers\Whiteboard\Board\StaffController;
use App\Http\Controllers\Whiteboard\Board\ZoneController;
use App\Http\Controllers\Whiteboard\Board\TextController;
use App\Http\Controllers\Whiteboard\Board\ShapeController;

Route::middleware('common')->group(function () {
    // ホワイトボード一覧
    Route::controller(WhiteboardController::class)->prefix('whiteboard')->name('whiteboard.')->group(function () {
        Route::get('', 'index')->name('index');
        Route::post('', 'store')->name('store');
        Route::patch('{whiteboard}', 'update')->name('update');
        Route::patch('{whiteboard}/users','updateUsers')->name('update_users');
        Route::delete('{whiteboard}', 'destroy')->name('destroy');
    });
    // ホワイトボード編集
    Route::controller(BoardController::class)->prefix('board')->name('board.')->group(function () {
        Route::get('', 'index')->name('index');
        Route::post('clear', 'clear')->name('clear');
    });
    // アイテム座標保存
    Route::controller(ItemController::class)->prefix('board')->name('board.')->group(function () {
        Route::post('item', 'updateItem')->name('update_item');
    });
    // スタッフ
    Route::controller(StaffController::class)->prefix('board')->name('board.')->group(function () {
        Route::post('staff', 'store')->name('store_staff');
        Route::patch('staff/{staff}', 'update')->name('update_staff');
        Route::delete('staff/{staff}', 'destroy')->name('delete_staff');
    });
    // グループ
    Route::controller(ZoneController::class)->prefix('board')->name('board.')->group(function () {
        Route::post('zone', 'store')->name('store_zone');
        Route::delete('zone/{item}', 'destroy')->name('delete_zone');
    });
    // テキスト
    Route::controller(TextController::class)->prefix('board')->name('board.')->group(function () {
        Route::post('text', 'store')->name('store_text');
        Route::delete('text/{item}', 'destroy')->name('delete_text');
    });
    // 図形
    Route::controller(ShapeController::class)->prefix('board')->name('board.')->group(function () {
        Route::post('shape', 'store')->name('store_shape');
        Route::delete('shape/{item}', 'destroy')->name('delete_shape');
    });
});