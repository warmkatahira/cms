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
        Schema::create('users', function (Blueprint $table){
            $table->increments('user_no');
            $table->string('user_id', 20)->unique();
            $table->string('employee_no', 4)->unique();
            $table->string('user_name', 30);
            $table->string('email', 255)->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password', 255);
            $table->boolean('is_active')->default(false);
            $table->string('role_id', 20)->default('user');
            $table->string('base_id', 10)->nullable();
            $table->string('profile_image_file_name', 50)->default('no_image.png');
            $table->boolean('is_password_change_required')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->date('hire_date');
            $table->string('next_grant_year_month', 6);
            $table->string('work_days_per_week', 20)->nullable();
            $table->decimal('carried_over_days', 3, 1)->nullable();
            $table->decimal('granted_days', 3, 1)->nullable();
            $table->decimal('used_days', 3, 1)->nullable()->default(0);
            $table->date('required_deadline')->nullable();
            $table->decimal('carried_over_required_days', 3, 1)->nullable();
            $table->decimal('granted_required_days', 3, 1)->nullable();
            $table->string('used_days_reset_year_month', 6)->nullable();
            $table->unsignedTinyInteger('grant_type')->default(0);
            $table->timestamp('paid_leave_updated_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            // 外部キー
            $table->foreign('role_id')->references('role_id')->on('roles')->cascadeOnUpdate();
            $table->foreign('base_id')->references('base_id')->on('bases')->cascadeOnUpdate();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table){
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table){
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};