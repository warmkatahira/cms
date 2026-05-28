<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
// モデル
use App\Models\Base;

class BaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Base::create([
            'base_id'               => 'honsha',
            'base_name'             => '本社',
            'short_base_name'       => '本社',
            'base_postal_code'      => '340-0822',
            'base_address'          => '埼玉県八潮市大瀬921-2',
            'base_tel'              => '048-995-0001',
            'base_fax'              => '048-995-0707',
            'sort_order'            => 1,
        ]);
        Base::create([
            'base_id'               => '1st',
            'base_name'             => '第1営業所',
            'short_base_name'       => '第1',
            'base_postal_code'      => '340-0815',
            'base_address'          => '埼玉県八潮市八潮5-5-2',
            'base_tel'              => '048-995-2000',
            'base_fax'              => '048-995-6500',
            'sort_order'            => 2,
        ]);
        Base::create([
            'base_id'               => '2nd',
            'base_name'             => '第2営業所',
            'short_base_name'       => '第2',
            'base_postal_code'      => '340-0831',
            'base_address'          => '埼玉県八潮市南後谷159-8福山通運内B1',
            'base_tel'              => '048-932-7200',
            'base_fax'              => '048-932-7211',
            'sort_order'            => 3,
        ]);
        Base::create([
            'base_id'               => '3rd',
            'base_name'             => '第3営業所',
            'short_base_name'       => '第3',
            'base_postal_code'      => '340-0807',
            'base_address'          => '埼玉県八潮市新町66',
            'base_tel'              => '048-930-0011',
            'base_fax'              => '048-930-0021',
            'sort_order'            => 4,
        ]);
        Base::create([
            'base_id'               => 'LS',
            'base_name'             => 'ロジステーション',
            'short_base_name'       => 'ロジS',
            'base_postal_code'      => '340-0811',
            'base_address'          => '埼玉県八潮市二丁目996',
            'base_tel'              => '048-998-2000',
            'base_fax'              => '048-998-1177',
            'sort_order'            => 5,
        ]);
        Base::create([
            'base_id'               => 'LP',
            'base_name'             => 'ロジポート',
            'short_base_name'       => 'ロジP',
            'base_postal_code'      => '340-0834',
            'base_address'          => '埼玉県八潮市大曽根946',
            'base_tel'              => '048-997-0100',
            'base_fax'              => '048-997-0500',
            'sort_order'            => 6,
        ]);
        Base::create([
            'base_id'               => 'HR',
            'base_name'             => '広島営業所',
            'short_base_name'       => '広島',
            'base_postal_code'      => '736-0003',
            'base_address'          => '広島県安芸郡海田町曽田2-55',
            'base_tel'              => '082-554-7620',
            'base_fax'              => '082-554-7621',
            'sort_order'            => 7,
        ]);
        Base::create([
            'base_id'               => 'LC',
            'base_name'             => 'ロジコンタクト',
            'short_base_name'       => 'ロジC',
            'base_postal_code'      => '340-0822',
            'base_address'          => '埼玉県八潮市大瀬921-2',
            'base_tel'              => '048-995-0003',
            'base_fax'              => '048-995-0005',
            'sort_order'            => 8,
        ]);
        Base::create([
            'base_id'               => 'IMP',
            'base_name'             => 'IMP三郷',
            'short_base_name'       => 'IMP',
            'base_postal_code'      => '341-0043',
            'base_address'          => '埼玉県三郷市栄4丁目72番1',
            'base_tel'              => '050-1732-8530',
            'sort_order'            => 9,
        ]);
    }
}