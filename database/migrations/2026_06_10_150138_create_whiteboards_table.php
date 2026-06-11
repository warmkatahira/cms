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
            $table->string('base_id', 10);
            $table->string('board_type', 30)->default('staff_map');
            $table->string('title', 100);
            $table->integer('canvas_w')->default(1200);
            $table->integer('canvas_h')->default(800);
            $table->timestamps();
            // 外部キー
            $table->foreign('base_id')->references('base_id')->on('bases')->cascadeOnUpdate();
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
