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
        Schema::create('file_imports', function (Blueprint $table) {
            $table->increments('file_import_id');
            $table->string('employee_no', 4);
            $table->string('user_name', 30);
            $table->string('base_info', 20)->nullable();
            $table->string('work_days_per_week', 20)->nullable();
            $table->date('hire_date')->nullable();
            $table->string('next_grant_year_month', 6)->nullable();
            $table->decimal('carried_over_remaining_days', 3, 1)->nullable();
            $table->decimal('granted_remaining_days', 3, 1)->nullable();
            $table->string('target_year_month', 6)->nullable();
            $table->decimal('used_days', 3, 1)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_imports');
    }
};
