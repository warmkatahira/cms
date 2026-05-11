<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
// モデル
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'user_id'                       => 'katahira',
            'user_name'                     => '片平 貴順',
            'email'                         => 't.katahira@warm.co.jp',
            'password'                      => bcrypt('katahira134'),
            'is_active'                     => true,
            'role_id'                       => 'system_admin',
            'base_id'                       => 'honsha',
            'is_password_change_required'   => false,
        ]);
    }
}