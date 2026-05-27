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
        Schema::create('client_alias_user', function (Blueprint $table) {
            $table->unsignedInteger('client_alias_id');
            $table->unsignedInteger('user_no');
            // 外部キー
            $table->foreign('client_alias_id')->references('client_alias_id')->on('client_aliases')->onDelete('cascade');
            $table->foreign('user_no')->references('user_no')->on('users')->onDelete('cascade');
            // 複合主キー
            $table->primary(['client_alias_id', 'user_no']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_alias_user');
    }
};
