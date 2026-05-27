<?php

namespace App\Services\Client\Client;

// モデル
use App\Models\FiscalYear;
use App\Models\MonthlyFinancial;
// その他
use Symfony\Component\HttpFoundation\StreamedResponse;
use Carbon\CarbonImmutable;
// 列挙
use App\Enums\SystemEnum;

class ClientFinancialDownloadService
{
    // 対象期リストを取得
    private function getFiscalYears(FiscalYear $startFiscalYear, FiscalYear $endFiscalYear)
    {
        return FiscalYear::whereBetween('period', [$startFiscalYear->period, $endFiscalYear->period])
                    ->orderBy('period', 'asc')
                    ->get();
    }

    // 対象期間のyear_monthリストを生成
    private function getYearMonths($fiscalYears): array
    {
        $yearMonths = [];
        foreach ($fiscalYears as $fy) {
            foreach ($fy->monthSequence() as $month) {
                $yearMonths[] = CarbonImmutable::parse($fy->start_date)->month($month)->format('Y-m-d');
            }
        }
        return $yearMonths;
    }

    // ヘッダーを生成
    private function buildHeader(array $baseColumns): array
    {
        return array_merge($baseColumns, [
            '期',
            '年月',
            '売上：保管',
            '売上：荷役',
            '売上：運賃',
            '売上：その他',
            '売上：合計',
            '経費：保管',
            '経費：社員人件費',
            '経費：パート人件費',
            '経費：派遣人件費',
            '経費：運賃',
            '経費：その他',
            '本社管理費',
            '経費：合計（本管費含む）',
            '経費：合計（本管費除く）',
            '収支（本管費含む）',
            '収支（本管費除く）',
        ]);
    }

    // 月次データを1行に変換
    private function buildMonthlyRow($data, FiscalYear $fy, string $yearMonth): array
    {
        $salesStorage  = $data ? (float) $data->sales_storage  : 0;
        $salesHandling = $data ? (float) $data->sales_handling : 0;
        $salesFreight  = $data ? (float) $data->sales_freight  : 0;
        $salesOther    = $data ? (float) $data->sales_other    : 0;
        $salesTotal    = $salesStorage + $salesHandling + $salesFreight + $salesOther;

        $costStorage  = $data ? (float) $data->cost_storage  : 0;
        $costEmployee = $data ? (float) $data->cost_employee : 0;
        $costPart     = $data ? (float) $data->cost_part     : 0;
        $costTemp     = $data ? (float) $data->cost_temp     : 0;
        $costFreight  = $data ? (float) $data->cost_freight  : 0;
        $costOther    = $data ? (float) $data->cost_other    : 0;
        $costHq       = $data ? (float) $data->cost_hq       : 0;

        $costTotalIncHq = $costStorage + $costEmployee + $costPart + $costTemp + $costFreight + $costOther + $costHq;
        $costTotalExHq  = $costStorage + $costEmployee + $costPart + $costTemp + $costFreight + $costOther;

        return [
            "第{$fy->period}期",
            CarbonImmutable::parse($yearMonth)->format('Y/m'),
            $salesStorage,
            $salesHandling,
            $salesFreight,
            $salesOther,
            $salesTotal,
            $costStorage,
            $costEmployee,
            $costPart,
            $costTemp,
            $costFreight,
            $costOther,
            $costHq,
            $costTotalIncHq,
            $costTotalExHq,
            $salesTotal - $costTotalIncHq,
            $salesTotal - $costTotalExHq,
        ];
    }

    // 顧客単位でダウンロードするデータを取得
    public function getDownloadDataByClient($clients, FiscalYear $startFiscalYear, FiscalYear $endFiscalYear)
    {
        $fiscalYears = $this->getFiscalYears($startFiscalYear, $endFiscalYear);
        $chunk_size  = 1000;

        $response = new StreamedResponse(function () use ($clients, $fiscalYears, $chunk_size) {
            $handle = fopen('php://output', 'wb');
            fwrite($handle, "\xEF\xBB\xBF");

            $header = $this->buildHeader([
                'ステータス', '顧客名',
            ]);
            fputcsv($handle, $header);

            $yearMonths = $this->getYearMonths($fiscalYears);

            $clients->chunk($chunk_size, function ($clients) use ($handle, $fiscalYears, $yearMonths) {
                foreach ($clients as $client) {
                    $aliasIds   = $client->clientAliases->pluck('client_alias_id');
                    $financials = MonthlyFinancial::whereIn('client_alias_id', $aliasIds)
                                    ->whereIn('year_month', $yearMonths)
                                    ->get()
                                    ->groupBy('year_month');

                    $baseColumns = [
                        $client->is_active_text,
                        $client->client_name,
                    ];

                    foreach ($fiscalYears as $fy) {
                        foreach ($fy->monthSequence() as $month) {
                            $yearMonth = CarbonImmutable::parse($fy->start_date)->month($month)->format('Y-m-d');
                            $monthlyGroup  = $financials->get($yearMonth, collect());
                            // 顧客単位は複数エイリアスの合算
                            $merged = $this->mergeFinancials($monthlyGroup);
                            fputcsv($handle, array_merge($baseColumns, $this->buildMonthlyRow($merged, $fy, $yearMonth)));
                        }
                    }
                }
            });

            fclose($handle);
        });

        return $response;
    }

    // エイリアス単位でダウンロードするデータを取得
    public function getDownloadDataByAlias($clients, FiscalYear $startFiscalYear, FiscalYear $endFiscalYear)
    {
        $fiscalYears = $this->getFiscalYears($startFiscalYear, $endFiscalYear);
        $chunk_size  = 1000;

        $response = new StreamedResponse(function () use ($clients, $fiscalYears, $chunk_size) {
            $handle = fopen('php://output', 'wb');
            fwrite($handle, "\xEF\xBB\xBF");

            $header = $this->buildHeader([
                'ステータス', '顧客名', '担当営業所', 'エイリアス名', '担当従業員',
            ]);
            fputcsv($handle, $header);

            $yearMonths = $this->getYearMonths($fiscalYears);

            $clients->chunk($chunk_size, function ($clients) use ($handle, $fiscalYears, $yearMonths) {
                foreach ($clients as $client) {
                    foreach ($client->clientAliases as $alias) {
                        $financials = MonthlyFinancial::where('client_alias_id', $alias->client_alias_id)
                                        ->whereIn('year_month', $yearMonths)
                                        ->get()
                                        ->keyBy('year_month');

                        $baseColumns = [
                            $client->is_active_text,
                            $client->client_name,
                            $alias->base->base_name ?? '',
                            $alias->client_alias_name,
                            $alias->users->isNotEmpty() ? $alias->users->map(fn($u) => $u->user_name)->join('・') : '設定なし',
                        ];

                        foreach ($fiscalYears as $fy) {
                            foreach ($fy->monthSequence() as $month) {
                                $yearMonth = CarbonImmutable::parse($fy->start_date)->month($month)->format('Y-m-d');
                                $data      = $financials->get($yearMonth);
                                fputcsv($handle, array_merge($baseColumns, $this->buildMonthlyRow($data, $fy, $yearMonth)));
                            }
                        }
                    }
                }
            });

            fclose($handle);
        });

        return $response;
    }

    // 複数エイリアスの月次データを合算
    private function mergeFinancials($financials): ?object
    {
        if ($financials->isEmpty()) return null;

        $merged = [
            'sales_storage'  => 0, 'sales_handling' => 0, 'sales_freight' => 0, 'sales_other' => 0,
            'cost_storage'   => 0, 'cost_employee'  => 0, 'cost_part'     => 0, 'cost_temp'   => 0,
            'cost_freight'   => 0, 'cost_other'     => 0, 'cost_hq'       => 0,
        ];

        foreach ($financials as $f) {
            foreach ($merged as $key => $_) {
                $merged[$key] += (float) $f->$key;
            }
        }

        return (object) $merged;
    }
}