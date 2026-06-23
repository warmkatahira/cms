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
        Schema::create('client_alias_product_type', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('client_alias_id');
            $table->unsignedInteger('product_type_id');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
            // 外部キー
            $table->foreign('client_alias_id')->references('client_alias_id')->on('client_aliases')->cascadeOnDelete();
            $table->foreign('product_type_id')->references('product_type_id')->on('product_types')->cascadeOnDelete();
            // ユニーク
            $table->unique(['client_alias_id', 'product_type_id'], 'capt_alias_type_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_alias_product_type');
    }
};
