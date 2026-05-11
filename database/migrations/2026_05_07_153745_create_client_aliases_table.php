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
        Schema::create('client_aliases', function (Blueprint $table) {
            $table->increments('client_alias_id');
            $table->string('base_id', 10);
            $table->unsignedInteger('client_id');
            $table->string('client_alias_name', 100);
            $table->timestamps();
            // 外部キー
            $table->foreign('base_id')->references('base_id')->on('bases')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreign('client_id')->references('client_id')->on('clients')->cascadeOnUpdate()->cascadeOnDelete();
            // ユニーク制約
            $table->unique(['base_id', 'client_alias_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_aliases');
    }
};
