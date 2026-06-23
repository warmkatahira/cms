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
            $table->unsignedInteger('item_id')->nullable();
            $table->integer('pos_x')->default(0);
            $table->integer('pos_y')->default(0);
            $table->json('meta')->nullable();
            $table->timestamps();
            // 外部キー
            $table->foreign('whiteboard_id')->references('whiteboard_id')->on('whiteboards')->cascadeOnUpdate();
            // ユニーク
            $table->unique(['item_type', 'item_id'], 'whiteboard_items_type_id_unique');
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
