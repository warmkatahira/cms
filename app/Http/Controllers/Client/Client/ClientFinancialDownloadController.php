<?php

namespace App\Http\Controllers\Client\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\FiscalYear;
// サービス
use App\Services\Client\Client\ClientSearchService;
use App\Services\Client\Client\ClientFinancialDownloadService;
// その他
use Carbon\CarbonImmutable;
// 列挙
use App\Enums\SystemEnum;

class ClientFinancialDownloadController extends Controller
{
    public function downloadByClient(Request $request)
    {
        // インスタンス化
        $ClientSearchService = new ClientSearchService;
        $ClientFinancialDownloadService = new ClientFinancialDownloadService;
        // 検索結果を取得
        $result = $ClientSearchService->getSearchResult();
        // 期を取得
        $startFiscalYear = FiscalYear::find($request->start_fiscal_year_id);
        $endFiscalYear   = FiscalYear::find($request->end_fiscal_year_id);
        // 顧客単位でダウンロードするデータを取得
        $response = $ClientFinancialDownloadService->getDownloadDataByClient($result, $startFiscalYear, $endFiscalYear);
        // ダウンロード処理
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename=【'.SystemEnum::getSystemTitle().'】収支データ（顧客単位）_' . CarbonImmutable::now()->isoFormat('Y年MM月DD日HH時mm分ss秒') . '.csv');
        return $response;
    }

    public function downloadByAlias(Request $request)
    {
        // インスタンス化
        $ClientSearchService = new ClientSearchService;
        $ClientFinancialDownloadService = new ClientFinancialDownloadService;
        // 検索結果を取得
        $result = $ClientSearchService->getSearchResult();
        // 期を取得
        $startFiscalYear = FiscalYear::find($request->start_fiscal_year_id);
        $endFiscalYear   = FiscalYear::find($request->end_fiscal_year_id);
        // エイリアス単位でダウンロードするデータを取得
        $response = $ClientFinancialDownloadService->getDownloadDataByAlias($result, $startFiscalYear, $endFiscalYear);
        // ダウンロード処理
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename=【'.SystemEnum::getSystemTitle().'】顧客収支データ（エイリアス単位）_' . CarbonImmutable::now()->isoFormat('Y年MM月DD日HH時mm分ss秒') . '.csv');
        return $response;
    }
}
