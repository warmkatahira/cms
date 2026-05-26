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
        Schema::create('fiscal_years', function (Blueprint $table) {
            $table->increments('fiscal_year_id');
            $table->unsignedTinyInteger('period')->unique()->comment('期番号');
            $table->date('start_date')->comment('期開始日');
            $table->date('end_date')->comment('期終了日');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fiscal_years');
    }
};
