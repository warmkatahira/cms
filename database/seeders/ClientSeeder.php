<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
// モデル
use App\Models\Client;
use App\Models\ClientAlias;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Client::create([
            'client_name'   => 'PIA',
            'updated_by'    => 1,
            'client_image_file_name'    => 'pia.png',
        ]);
        ClientAlias::create([
            'base_id'           => 'LP',
            'client_id'         => 1,
            'client_alias_name' => 'PIA(親在庫)',
        ]);
        ClientAlias::create([
            'base_id'           => 'LP',
            'client_id'         => 1,
            'client_alias_name' => 'PIA(化粧品)',
        ]);

        Client::create([
            'client_name'   => '拓洋',
            'updated_by'    => 1,
            'client_image_file_name'    => 'takuyou.png',
        ]);
        ClientAlias::create([
            'base_id'           => 'LP',
            'client_id'         => 2,
            'client_alias_name' => '拓洋（金封）',
        ]);
        ClientAlias::create([
            'base_id'           => 'LP',
            'client_id'         => 2,
            'client_alias_name' => '拓洋（豊商事）',
        ]);

        Client::create([
            'client_name'   => 'オスト',
            'updated_by'    => 1,
        ]);
        ClientAlias::create([
            'base_id'           => 'LP',
            'client_id'         => 3,
            'client_alias_name' => 'オスト',
        ]);
    }
}