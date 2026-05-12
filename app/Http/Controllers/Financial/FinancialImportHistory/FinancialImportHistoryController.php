<?php

namespace App\Http\Controllers\Financial\FinancialImportHistory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// サービス
use App\Services\Financial\FinancialImportHistory\FinancialImportHistorySearchService;
// トレイト
use App\Traits\PaginatesResultsTrait;

class FinancialImportHistoryController extends Controller
{
    use PaginatesResultsTrait;

    public function index(Request $request)
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => '取込履歴']);
        // インスタンス化
        $FinancialImportHistorySearchService = new FinancialImportHistorySearchService;
        // セッションを削除
        $FinancialImportHistorySearchService->deleteSession();
        // セッションに検索条件を格納
        $FinancialImportHistorySearchService->setSearchCondition($request);
        // 検索結果を取得
        $result = $FinancialImportHistorySearchService->getSearchResult();
        // ページネーションを実施
        $financial_import_histories = $this->setPagination($result);
        return view('financial.financial_import_history.index')->with([
            'financial_import_histories' => $financial_import_histories,
        ]);
    }
}