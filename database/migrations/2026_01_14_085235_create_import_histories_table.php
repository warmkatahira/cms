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
        Schema::create('import_histories', function (Blueprint $table) {
            $table->increments('import_history_id');
            $table->string('import_employee_original_file_name', 255)->nullable();
            $table->string('import_paid_leave_original_file_name', 255)->nullable();
            $table->string('error_file_name', 255)->nullable();
            $table->string('message', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_histories');
    }
};
