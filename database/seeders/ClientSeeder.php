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
            'client_name'               => 'PIA株式会社',
            'client_postal_code'        => '141-0032',
            'client_address'            => '東京都品川区大崎1-2-2',
            'client_tel'                => '03-6417-0220',
            'updated_by'                => 1,
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
            'client_name'               => '株式会社拓洋',
            'client_postal_code'        => '340-0831',
            'client_address'            => '埼玉県八潮市南後谷652-1',
            'client_tel'                => '048-995-4141',
            'updated_by'                => 1,
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
            'client_name'               => '株式会社オスト',
            'client_postal_code'        => '103-0016',
            'client_address'            => '東京都中央区日本橋小網町9-6　NST小網町ビル4F',
            'client_tel'                => '03-3662-5552',
            'updated_by'                => 1,
            'client_image_file_name'    => 'ost.png',
        ]);
        ClientAlias::create([
            'base_id'           => 'LP',
            'client_id'         => 3,
            'client_alias_name' => 'オスト',
        ]);
        Client::create([
            'client_name'               => '株式会社フクヤ',
            'client_postal_code'        => '103-0023',
            'client_address'            => '東京都中央区日本橋本町1-5-4',
            'client_tel'                => null,
            'updated_by'                => 1,
            'client_image_file_name'    => 'fukuya.png',
        ]);
        ClientAlias::create([
            'base_id'           => 'LP',
            'client_id'         => 4,
            'client_alias_name' => 'フクヤ',
        ]);
        ClientAlias::create([
            'base_id'           => '3rd',
            'client_id'         => 4,
            'client_alias_name' => 'フクヤ',
        ]);
        Client::create([
            'client_name'               => 'サクセスアジア株式会社',
            'client_postal_code'        => '111-0051',
            'client_address'            => '東京都台東区蔵前4-6-7 MBCビル6F',
            'client_tel'                => null,
            'updated_by'                => 1,
            'client_image_file_name'    => 'sca.png',
        ]);
        ClientAlias::create([
            'base_id'           => 'LP',
            'client_id'         => 5,
            'client_alias_name' => 'サクセスアジア',
        ]);
    }
}