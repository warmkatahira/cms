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
        Schema::create('staff', function (Blueprint $table) {
            $table->increments('staff_id');
            $table->unsignedInteger('whiteboard_id');
            $table->string('staff_name', 50);
            $table->string('role_name', 50)->nullable();
            $table->unsignedtinyInteger('color')->default(0);
            $table->string('size', 3)->default('M');
            $table->string('shape', 15)->default('rect');
            $table->boolean('is_active')->default(true);
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
        Schema::dropIfExists('staff');
    }
};
