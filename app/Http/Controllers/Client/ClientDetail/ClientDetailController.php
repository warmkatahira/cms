<?php

namespace App\Http\Controllers\Client\ClientDetail;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Client;
use App\Models\FiscalYear;
// サービス
use App\Services\Client\ClientDetail\ClientDetailService;

class ClientDetailController extends Controller
{
    public function index(Request $request)
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => '顧客詳細']);
        // インスタンス化
        $ClientDetailService = new ClientDetailService;
        // 顧客を取得
        $client = Client::with(['clientAliases.base', 'user'])->findOrFail($request->client_id);
        // 当期を取得
        $currentFiscalYear = FiscalYear::current();
        // 前期を取得
        $prevFiscalYear = FiscalYear::where('period', $currentFiscalYear->period - 1)->first();
        // 当期の収支サマリーを取得
        $summary = $ClientDetailService->getSummary($client, $currentFiscalYear);
        // 当期の月次データを取得
        $monthlyData = $ClientDetailService->getMonthly($client, $currentFiscalYear);
        // 前期の月次データを取得
        $lastYearMonthlyData = $prevFiscalYear ? $ClientDetailService->getMonthly($client, $prevFiscalYear) : [];
        // 期セレクタ用に全期を取得
        $fiscalYears = FiscalYear::orderByDesc('period')->get();
        return view('client.client_detail.index')->with([
            'client'              => $client,
            'currentFiscalYear'   => $currentFiscalYear,
            'fiscalYears'         => $fiscalYears,
            'summary'             => $summary,
            'monthlyData'         => $monthlyData,
            'lastYearMonthlyData' => $lastYearMonthlyData,
        ]);
    }

    // 期切り替え時のAPI
    public function fiscalData(Request $request, int $period)
    {
        // インスタンス化
        $ClientDetailService = new ClientDetailService;
        // 顧客を取得
        $client = Client::with(['clientAliases'])->findOrFail($request->client_id);
        // 指定期を取得
        $fiscalYear = FiscalYear::where('period', $period)->firstOrFail();
        // 前期を取得
        $prevFiscalYear = FiscalYear::where('period', $period - 1)->first();
        return response()->json([
            'fiscal_year'       => $fiscalYear,
            'summary'           => $ClientDetailService->getSummary($client, $fiscalYear),
            'monthly'           => $ClientDetailService->getMonthly($client, $fiscalYear),
            'last_year_monthly' => $prevFiscalYear ? $ClientDetailService->getMonthly($client, $prevFiscalYear) : [],
        ]);
    }
}