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
        Schema::create('clients', function (Blueprint $table) {
            $table->increments('client_id');
            $table->string('client_name', 100)->unique();
            $table->string('client_postal_code', 8)->nullable();
            $table->string('client_address', 255)->nullable();
            $table->string('client_tel', 13)->nullable();
            $table->string('client_image_file_name', 50)->default('no_image.png');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('updated_by');
            $table->timestamps();
            // 外部キー
            $table->foreign('updated_by')->references('user_no')->on('users')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
