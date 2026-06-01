<?php

namespace App\Http\Controllers\Base\BaseDetail;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Base;
use App\Models\FiscalYear;
// サービス
use App\Services\Base\BaseDetail\BaseDetailService;

class BaseDetailController extends Controller
{
    public function index(Request $request)
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => '営業所詳細']);
        // インスタンス化
        $BaseDetailService = new BaseDetailService;
        // 営業所を取得
        $base = Base::findOrFail($request->base_id);
        // 当期を取得
        $currentFiscalYear = FiscalYear::current();
        // 期セレクタ用に全期を取得
        $fiscalYears = FiscalYear::orderByDesc('period')->get();
        // 前期（前年比較用）
        $lastFiscalYear = FiscalYear::where('period', $currentFiscalYear->period - 1)->first();
        // 集計
        $summary             = $BaseDetailService->getSummary($base, $currentFiscalYear);
        $monthlyData         = $BaseDetailService->getMonthly($base, $currentFiscalYear);
        $lastYearMonthlyData = $lastFiscalYear ? $BaseDetailService->getMonthly($base, $lastFiscalYear) : [];
        return view('base.base_detail.index')->with([
            'base'                => $base,
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
        $BaseDetailService = new BaseDetailService;
        // 営業所を取得
        $base = Base::findOrFail($request->base_id);
        // 指定期を取得
        $fiscalYear = FiscalYear::where('period', $period)->firstOrFail();
        // 前期を取得
        $prevFiscalYear = FiscalYear::where('period', $period - 1)->first();
        return response()->json([
            'fiscal_year'       => $fiscalYear,
            'summary'           => $BaseDetailService->getSummary($base, $fiscalYear),
            'monthly'           => $BaseDetailService->getMonthly($base, $fiscalYear),
            'last_year_monthly' => $prevFiscalYear ? $BaseDetailService->getMonthly($base, $prevFiscalYear) : [],
        ]);
    }
}