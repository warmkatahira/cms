<?php

namespace App\Http\Controllers\Client\ClientDetail;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Client;
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
        // 今年の収支サマリーを取得
        $summary = $ClientDetailService->getThisYearSummary($client);
        // 今年の月次データを取得
        $monthlyData = $ClientDetailService->getThisYearMonthly($client);
        // 前年の月次データを取得
        $lastYearMonthlyData = $ClientDetailService->getLastYearMonthly($client);
        return view('client.client_detail.index')->with([
            'client'  => $client,
            'summary' => $summary,
            'monthlyData' => $monthlyData,
            'lastYearMonthlyData' => $lastYearMonthlyData,
        ]);
    }
}