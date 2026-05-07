<?php

namespace App\Http\Controllers\Admin\ImportHistory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// サービス
use App\Services\Admin\ImportHistory\ImportHistorySearchService;
// トレイト
use App\Traits\PaginatesResultsTrait;

class ImportHistoryController extends Controller
{
    use PaginatesResultsTrait;

    public function index(Request $request)
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => '取込履歴']);
        // インスタンス化
        $ImportHistorySearchService = new ImportHistorySearchService;
        // セッションを削除
        $ImportHistorySearchService->deleteSession();
        // セッションに検索条件を格納
        $ImportHistorySearchService->setSearchCondition($request);
        // 検索結果を取得
        $result = $ImportHistorySearchService->getSearchResult();
        // ページネーションを実施
        $import_histories = $this->setPagination($result);
        return view('admin.import_history.index')->with([
            'import_histories' => $import_histories,
        ]);
    }
}