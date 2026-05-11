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
        Schema::create('monthly_financials', function (Blueprint $table) {
            $table->increments('monthly_financial_id');
            $table->unsignedInteger('client_alias_id');
            $table->date('year_month');
            // 売上
            $table->integer('sales_storage')->default(0);   // 保管売上
            $table->integer('sales_handling')->default(0);  // 荷役売上
            $table->integer('sales_freight')->default(0);   // 運賃売上
            $table->integer('sales_other')->default(0);     // その他売上
            // 経費
            $table->integer('cost_storage')->default(0);    // 保管経費
            $table->integer('cost_employee')->default(0);   // 社員人件費
            $table->integer('cost_part')->default(0);       // パート人件費
            $table->integer('cost_temp')->default(0);       // 派遣人件費・内職
            $table->integer('cost_freight')->default(0);    // 運賃経費
            $table->integer('cost_other')->default(0);      // その他経費
            $table->integer('cost_hq')->default(0);         // 本社管理費
            $table->timestamps();
            // 外部キー
            $table->foreign('client_alias_id')->references('client_alias_id')->on('client_aliases')->cascadeOnUpdate()->cascadeOnDelete();
            // ユニーク制約
            $table->unique(['client_alias_id', 'year_month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monthly_financials');
    }
};
