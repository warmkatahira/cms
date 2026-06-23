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
        Schema::create('whiteboards', function (Blueprint $table) {
            $table->increments('whiteboard_id');
            $table->string('title', 50);
            $table->unsignedInteger('canvas_w')->default(1200);
            $table->unsignedInteger('canvas_h')->default(800);
            $table->unsignedInteger('created_by');
            $table->timestamps();
            // 外部キー
            $table->foreign('created_by')->references('user_no')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whiteboards');
    }
};
