<?php

namespace App\Services\Base\BaseDetail;

// モデル
use App\Models\MonthlyFinancial;
use App\Models\FiscalYear;
use App\Models\Base;
use App\Models\Client;
use App\Models\ClientAlias;

class BaseDetailService
{
    // ─── 共通 ───────────────────────────────────────────────
    // 営業所配下の全顧客 → その全エイリアスID
    private function aliasIds(Base $base)
    {
        return ClientAlias::where('base_id', $base->base_id)->pluck('client_alias_id');
    }

    private function buildSelectSql(): string
    {
        return 'MONTH(`year_month`) as month,'
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
    }

    // ─── 収支サマリーを取得 ──────────────────────────────────
    public function getSummary(Base $base, FiscalYear $fiscalYear): array
    {
        $summary = MonthlyFinancial::whereIn('client_alias_id', $this->aliasIds($base))
            ->whereBetween('year_month', [
                $fiscalYear->start_date->format('Y-m-d'),
                $fiscalYear->end_date->format('Y-m-d'),
            ])
            ->selectRaw('
                SUM(sales_storage + sales_handling + sales_freight + sales_other) as total_sales,
                SUM(cost_storage + cost_employee + cost_part + cost_temp + cost_freight + cost_other + cost_hq) as total_cost,
                SUM(cost_storage + cost_employee + cost_part + cost_temp + cost_freight + cost_other) as total_cost_ex_hq,
                SUM(cost_hq) as total_cost_hq
            ')
            ->first();

        $sales    = (float) ($summary->total_sales ?? 0);
        $cost     = (float) ($summary->total_cost ?? 0);
        $costExHq = (float) ($summary->total_cost_ex_hq ?? 0);

        return [
            'total_sales'        => $sales,
            'total_cost'         => $cost,
            'total_cost_ex_hq'   => $costExHq,
            'total_cost_hq'      => (float) ($summary->total_cost_hq ?? 0),
            'gross_profit'       => $sales - $cost,
            'gross_profit_ex_hq' => $sales - $costExHq,
        ];
    }

    // ─── 月次データを取得 ────────────────────────────────────
    public function getMonthly(Base $base, FiscalYear $fiscalYear): array
    {
        $rows = MonthlyFinancial::whereIn('client_alias_id', $this->aliasIds($base))
            ->whereBetween('year_month', [
                $fiscalYear->start_date->format('Y-m-d'),
                $fiscalYear->end_date->format('Y-m-d'),
            ])
            ->selectRaw($this->buildSelectSql())
            ->groupByRaw('MONTH(`year_month`)')
            ->get()
            ->keyBy('month');

        $monthly = [];
        foreach ($fiscalYear->monthSequence() as $m) {
            $row           = $rows->get($m);
            $totalSales    = (float) ($row->total_sales ?? 0);
            $totalCost     = (float) ($row->total_cost ?? 0);
            $totalCostExHq = (float) ($row->total_cost_ex_hq ?? 0);

            $monthly[] = [
                'month'              => $m . '月',
                'sales_storage'      => (float) ($row->sales_storage  ?? 0),
                'sales_handling'     => (float) ($row->sales_handling ?? 0),
                'sales_freight'      => (float) ($row->sales_freight  ?? 0),
                'sales_other'        => (float) ($row->sales_other    ?? 0),
                'total_sales'        => $totalSales,
                'cost_storage'       => (float) ($row->cost_storage   ?? 0),
                'cost_employee'      => (float) ($row->cost_employee  ?? 0),
                'cost_part'          => (float) ($row->cost_part      ?? 0),
                'cost_temp'          => (float) ($row->cost_temp      ?? 0),
                'cost_freight'       => (float) ($row->cost_freight   ?? 0),
                'cost_other'         => (float) ($row->cost_other     ?? 0),
                'cost_hq'            => (float) ($row->cost_hq        ?? 0),
                'total_cost'         => $totalCost,
                'total_cost_ex_hq'   => $totalCostExHq,
                'gross_profit'       => $totalSales - $totalCost,
                'gross_profit_ex_hq' => $totalSales - $totalCostExHq,
            ];
        }
        return $monthly;
    }
}