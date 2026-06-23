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
        Schema::create('financial_imports', function (Blueprint $table) {
            $table->increments('financial_import_id');
            $table->string('base_id', 10)->nullable();
            $table->string('base_name', 20);
            $table->string('client_alias_name', 100);
            $table->date('year_month');
            $table->integer('sales_storage')->default(0);
            $table->integer('sales_handling')->default(0);
            $table->integer('sales_freight')->default(0);
            $table->integer('sales_other')->default(0);
            $table->integer('cost_storage')->default(0);
            $table->integer('cost_employee')->default(0);
            $table->integer('cost_part')->default(0);
            $table->integer('cost_temp')->default(0);
            $table->integer('cost_freight')->default(0);
            $table->integer('cost_other')->default(0);
            $table->integer('cost_hq')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_imports');
    }
};
