<?php

namespace App\Http\Controllers\Base\Base;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\FiscalYear;
// サービス
use App\Services\Base\Base\BaseSearchService;
// トレイト
use App\Traits\PaginatesResultsTrait;

class BaseController extends Controller
{
    use PaginatesResultsTrait;

    public function index(Request $request)
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => '営業所一覧']);
        // インスタンス化
        $BaseSearchService = new BaseSearchService;
        // セッションを削除
        $BaseSearchService->deleteSession();
        // セッションに検索条件を格納
        $BaseSearchService->setSearchCondition($request);
        // 検索結果を取得
        $result = $BaseSearchService->getSearchResult();
        // ページネーションを実施
        $bases = $this->setPagination($result);
        // 期を取得
        $fiscalYears = FiscalYear::ordered('desc')->get();
        return view('base.base.index')->with([
            'bases' => $bases,
            'bases' => $bases,
            'fiscalYears' => $fiscalYears,
        ]);
    }
}