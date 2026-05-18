<?php

namespace App\Services\Client\ClientDetail;

// モデル
use App\Models\Client;
use App\Models\MonthlyFinancial;
// その他
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

class ClientDetailService
{
    // 今年の収支サマリーを取得
    public function getThisYearSummary($client)
    {
        // 今年の年を取得
        $thisYear = CarbonImmutable::now()->year;
        // 顧客に紐付くエイリアスIDを取得
        $clientAliasIds = $client->clientAliases->pluck('client_alias_id');
        // 今年の売上合計・経費合計を集計
        $summary = MonthlyFinancial::whereIn('client_alias_id', $clientAliasIds)
                        ->whereYear('year_month', $thisYear)
                        ->selectRaw('
                            SUM(sales_storage + sales_handling + sales_freight + sales_other) as total_sales,
                            SUM(cost_storage + cost_employee + cost_part + cost_temp + cost_freight + cost_other + cost_hq) as total_cost,
                            SUM(cost_storage + cost_employee + cost_part + cost_temp + cost_freight + cost_other) as total_cost_ex_hq,
                            SUM(cost_hq) as total_cost_hq
                        ')
                        ->first();
        // 売上合計・経費合計・収支を返す（データがない場合は0）
        return [
            'total_sales'        => $summary->total_sales ?? 0,
            'total_cost'         => $summary->total_cost ?? 0,
            'total_cost_ex_hq'   => $summary->total_cost_ex_hq ?? 0,
            'total_cost_hq'      => $summary->total_cost_hq ?? 0,  // ← 追加
            'gross_profit'       => ($summary->total_sales ?? 0) - ($summary->total_cost ?? 0),
            'gross_profit_ex_hq' => ($summary->total_sales ?? 0) - ($summary->total_cost_ex_hq ?? 0),
        ];
    }

    // 今年の月次収支データを取得
    public function getThisYearMonthly($client)
    {
        // 今年の年を取得
        $thisYear = CarbonImmutable::now()->year;
        // 顧客に紐付くエイリアスIDを取得
        $clientAliasIds = $client->clientAliases->pluck('client_alias_id');
        // SQLを定義（year_monthは予約語と衝突するためバッククォートで囲む）
        $sql = 'MONTH(`year_month`) as month,'
                . ' SUM(sales_storage) as sales_storage,'
                . ' SUM(sales_handling) as sales_handling,'
                . ' SUM(sales_freight) as sales_freight,'
                . ' SUM(sales_other) as sales_other,'
                . ' SUM(sales_storage + sales_handling + sales_freight + sales_other) as total_sales,'
                . ' SUM(cost_storage) as cost_storage,'
                . ' SUM(cost_employee) as cost_employee,'
                . ' SUM(cost_part) as cost_part,'
                . ' SUM(cost_temp) as cost_temp,'
                . ' SUM(cost_freight) as cost_freight,'
                . ' SUM(cost_other) as cost_other,'
                . ' SUM(cost_hq) as cost_hq,'
                . ' SUM(cost_storage + cost_employee + cost_part + cost_temp + cost_freight + cost_other + cost_hq) as total_cost,'
                . ' SUM(cost_storage + cost_employee + cost_part + cost_temp + cost_freight + cost_other) as total_cost_ex_hq';
        // 月次データを取得
        $rows = MonthlyFinancial::whereIn('client_alias_id', $clientAliasIds)
                    ->whereYear('year_month', $thisYear)
                    ->selectRaw($sql)
                    ->groupByRaw('MONTH(`year_month`)')
                    ->orderByRaw('MONTH(`year_month`)')
                    ->get()
                    ->keyBy('month');
        // 1〜12月分のデータを整形（データがない月は0）
        $monthly = [];
        for ($m = 1; $m <= 12; $m++) {
            $row = $rows->get($m);
            $totalSales = ($row->total_sales ?? 0);
            $totalCost  = ($row->total_cost ?? 0);
            $totalCostExHq = ($row->total_cost_ex_hq ?? 0);
            $monthly[] = [
                'month'              => $m . '月',
                'sales_storage'      => $row->sales_storage  ?? 0,
                'sales_handling'     => $row->sales_handling ?? 0,
                'sales_freight'      => $row->sales_freight  ?? 0,
                'sales_other'        => $row->sales_other    ?? 0,
                'total_sales'        => $totalSales,
                'cost_storage'       => $row->cost_storage   ?? 0,  // 追加
                'cost_employee'      => $row->cost_employee  ?? 0,  // 追加
                'cost_part'          => $row->cost_part      ?? 0,  // 追加
                'cost_temp'          => $row->cost_temp      ?? 0,  // 追加
                'cost_freight'       => $row->cost_freight   ?? 0,  // 追加
                'cost_other'         => $row->cost_other     ?? 0,  // 追加
                'cost_hq'            => $row->cost_hq        ?? 0,  // 追加
                'total_cost'         => $totalCost,
                'total_cost_ex_hq'   => $totalCostExHq,
                'gross_profit'       => $totalSales - $totalCost,
                'gross_profit_ex_hq' => $totalSales - $totalCostExHq,
            ];
        }
        return $monthly;
    }

    // 前年の月次収支データを取得
    public function getLastYearMonthly($client)
    {
        // 前年の年を取得
        $lastYear = CarbonImmutable::now()->subYear()->year;
        // 顧客に紐付くエイリアスIDを取得
        $clientAliasIds = $client->clientAliases->pluck('client_alias_id');
        // SQLを定義
        $sql = 'MONTH(`year_month`) as month,'
                . ' SUM(sales_storage) as sales_storage,'
                . ' SUM(sales_handling) as sales_handling,'
                . ' SUM(sales_freight) as sales_freight,'
                . ' SUM(sales_other) as sales_other,'
                . ' SUM(sales_storage + sales_handling + sales_freight + sales_other) as total_sales,'
                . ' SUM(cost_storage) as cost_storage,'
                . ' SUM(cost_employee) as cost_employee,'
                . ' SUM(cost_part) as cost_part,'
                . ' SUM(cost_temp) as cost_temp,'
                . ' SUM(cost_freight) as cost_freight,'
                . ' SUM(cost_other) as cost_other,'
                . ' SUM(cost_hq) as cost_hq,'
                . ' SUM(cost_storage + cost_employee + cost_part + cost_temp + cost_freight + cost_other + cost_hq) as total_cost,'
                . ' SUM(cost_storage + cost_employee + cost_part + cost_temp + cost_freight + cost_other) as total_cost_ex_hq';
        // 月次データを取得
        $rows = MonthlyFinancial::whereIn('client_alias_id', $clientAliasIds)
                    ->whereYear('year_month', $lastYear)
                    ->selectRaw($sql)
                    ->groupByRaw('MONTH(`year_month`)')
                    ->orderByRaw('MONTH(`year_month`)')
                    ->get()
                    ->keyBy('month');
        // 1〜12月分のデータを整形（データがない月は0）
        $monthly = [];
        for ($m = 1; $m <= 12; $m++) {
            $row = $rows->get($m);
            $totalSales = ($row->total_sales ?? 0);
            $totalCost  = ($row->total_cost ?? 0);
            $totalCostExHq = ($row->total_cost_ex_hq ?? 0);
            $monthly[] = [
                'month'              => $m . '月',
                'sales_storage'      => $row->sales_storage  ?? 0,
                'sales_handling'     => $row->sales_handling ?? 0,
                'sales_freight'      => $row->sales_freight  ?? 0,
                'sales_other'        => $row->sales_other    ?? 0,
                'total_sales'        => $totalSales,
                'cost_storage'       => $row->cost_storage   ?? 0,  // 追加
                'cost_employee'      => $row->cost_employee  ?? 0,  // 追加
                'cost_part'          => $row->cost_part      ?? 0,  // 追加
                'cost_temp'          => $row->cost_temp      ?? 0,  // 追加
                'cost_freight'       => $row->cost_freight   ?? 0,  // 追加
                'cost_other'         => $row->cost_other     ?? 0,  // 追加
                'cost_hq'            => $row->cost_hq        ?? 0,  // 追加
                'total_cost'         => $totalCost,
                'total_cost_ex_hq'   => $totalCostExHq,
                'gross_profit'       => $totalSales - $totalCost,
                'gross_profit_ex_hq' => $totalSales - $totalCostExHq,
            ];
        }
        return $monthly;
    }
}