<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
// モデル
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create([
            'role_id'       => 'system_admin',
            'role_name'     => 'システム管理者',
            'sort_order'    => 1,
        ]);
        Role::create([
            'role_id'       => 'admin',
            'role_name'     => '管理者',
            'sort_order'    => 2,
        ]);
        Role::create([
            'role_id'       => 'base_admin',
            'role_name'     => '所長',
            'sort_order'    => 3,
        ]);
        Role::create([
            'role_id'       => 'user',
            'role_name'     => '一般',
            'sort_order'    => 4,
        ]);
    }
}
