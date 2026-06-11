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
        Schema::create('whiteboard_items', function (Blueprint $table) {
            $table->increments('whiteboard_item_id');
            $table->unsignedInteger('whiteboard_id');
            $table->string('item_type', 30)->default('staff');
            $table->unsignedBigInteger('item_id')->nullable();
            $table->decimal('pos_x', 8, 4)->default(0);
            $table->decimal('pos_y', 8, 4)->default(0);
            $table->boolean('on_board')->default(false);
            $table->json('meta')->nullable();
            $table->timestamps();
            // 外部キー
            $table->foreign('whiteboard_id')->references('whiteboard_id')->on('whiteboards')->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whiteboard_items');
    }
};
