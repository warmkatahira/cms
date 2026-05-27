<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
// その他
use Illuminate\Support\Facades\DB;

class ClientAliasUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('client_alias_user')->insert([
            ['client_alias_id' => 1, 'user_no' => 1],
            ['client_alias_id' => 1, 'user_no' => 2],
            ['client_alias_id' => 2, 'user_no' => 1],
        ]);
    }
}