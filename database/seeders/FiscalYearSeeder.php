<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
// モデル
use App\Models\FiscalYear;

class FiscalYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [];
        for ($period = 1; $period <= 22; $period++) {
            $startYear = 2004 + ($period - 1);
            $endYear   = $startYear + 1;
            $data[] = [
                'period'     => $period,
                'start_date' => "{$startYear}-10-01",
                'end_date'   => "{$endYear}-09-30",
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        FiscalYear::insert($data);
    }
}