<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('whiteboard_users', function (Blueprint $table) {
            $table->increments('whiteboard_user_id');
            $table->unsignedInteger('whiteboard_id');
            $table->unsignedInteger('user_no');
            $table->timestamps();
            // 外部キー
            $table->foreign('whiteboard_id')->references('whiteboard_id')->on('whiteboards')->onDelete('cascade');
            $table->foreign('user_no')->references('user_no')->on('users')->onDelete('cascade');
            // ユニーク
            $table->unique(['whiteboard_id', 'user_no']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whiteboard_users');
    }
};
