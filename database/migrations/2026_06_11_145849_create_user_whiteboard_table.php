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
        Schema::create('user_whiteboard', function (Blueprint $table) {
            $table->unsignedInteger('user_no');
            $table->unsignedInteger('whiteboard_id');
            $table->timestamps();
            // 外部キー
            $table->foreign('user_no')->references('user_no')->on('users')->onDelete('cascade');
            $table->foreign('whiteboard_id')->references('whiteboard_id')->on('whiteboards')->onDelete('cascade');
            // 複合主キー
            $table->primary(['user_no', 'whiteboard_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_whiteboard');
    }
};
