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
            'sort_order'            => 1,
        ]);
        Base::create([
            'base_id'               => '1st',
            'base_name'             => '第1営業所',
            'short_base_name'       => '第1',
            'sort_order'            => 2,
        ]);
        Base::create([
            'base_id'               => '2nd',
            'base_name'             => '第2営業所',
            'short_base_name'       => '第2',
            'sort_order'            => 3,
        ]);
        Base::create([
            'base_id'               => '3rd',
            'base_name'             => '第3営業所',
            'short_base_name'       => '第3',
            'sort_order'            => 4,
        ]);
        Base::create([
            'base_id'               => 'LS',
            'base_name'             => 'ロジステーション',
            'short_base_name'       => 'ロジS',
            'sort_order'            => 5,
        ]);
        Base::create([
            'base_id'               => 'LP',
            'base_name'             => 'ロジポート',
            'short_base_name'       => 'ロジP',
            'sort_order'            => 6,
        ]);
        Base::create([
            'base_id'               => 'HR',
            'base_name'             => '広島営業所',
            'short_base_name'       => '広島',
            'sort_order'            => 7,
        ]);
        Base::create([
            'base_id'               => 'LC',
            'base_name'             => 'ロジコンタクト',
            'short_base_name'       => 'ロジC',
            'sort_order'            => 8,
        ]);
        Base::create([
            'base_id'               => 'IMP',
            'base_name'             => 'IMP三郷',
            'short_base_name'       => 'IMP',
            'sort_order'            => 9,
        ]);
    }
}