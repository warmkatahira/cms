<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
// モデル
use App\Models\ProductType;

class ProductTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productTypes = [
            ['product_name' => '雑貨',     'product_code' => 'ZAKKA',   'sort_order' => 1],
            ['product_name' => '食品',     'product_code' => 'FOOD',    'sort_order' => 2],
            ['product_name' => '医療機器', 'product_code' => 'MEDICAL', 'sort_order' => 3],
        ];
        foreach ($productTypes as $data) {
            ProductType::firstOrCreate(['product_code' => $data['product_code']], $data);
        }
    }
}