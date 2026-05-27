<?php

namespace App\Http\Controllers\Client\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Base;
use App\Models\FiscalYear;
// サービス
use App\Services\Client\Client\ClientSearchService;
// トレイト
use App\Traits\PaginatesResultsTrait;

class ClientController extends Controller
{
    use PaginatesResultsTrait;

    public function index(Request $request)
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => '顧客一覧']);
        // インスタンス化
        $ClientSearchService = new ClientSearchService;
        // セッションを削除
        $ClientSearchService->deleteSession();
        // セッションに検索条件を格納
        $ClientSearchService->setSearchCondition($request);
        // 検索結果を取得
        $result = $ClientSearchService->getSearchResult();
        // ページネーションを実施
        $clients = $this->setPagination($result);
        // 営業所を取得
        $bases = Base::ordered()->get();
        // 期を取得
        $fiscalYears = FiscalYear::ordered('desc')->get();
        return view('client.client.index')->with([
            'clients' => $clients,
            'bases' => $bases,
            'fiscalYears' => $fiscalYears,
        ]);
    }
}