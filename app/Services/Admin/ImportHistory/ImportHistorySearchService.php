<?php

namespace App\Services\Admin\ImportHistory;

// モデル
use App\Models\ImportHistory;
// その他
use Illuminate\Support\Facades\DB;
use Carbon\CarbonImmutable;

class ImportHistorySearchService
{
    // セッションを削除
    public function deleteSession()
    {
        session()->forget([
            'search_import_date',
        ]);
    }

    // セッションに検索条件を格納
    public function setSearchCondition($request)
    {
        // 現在のURLを取得
        session(['back_url_1' => url()->full()]);
        // 変数が存在しない場合は検索が実行されていないので、初期条件をセット
        if(!isset($request->search_type)){
            session(['search_import_date' => CarbonImmutable::now()->toDateString()]);
        }
        // 「search」なら検索が実行されているので、検索条件をセット
        if($request->search_type === 'search'){
            session(['search_import_date' => $request->search_import_date]);
        }
    }

    // 検索結果を取得
    public function getSearchResult()
    {
        // クエリをセット
        $query = ImportHistory::query();
        // 取込日の条件がある場合
        if(session('search_import_date') != null){
            // 条件を指定して取得
            $query = $query->whereDate('created_at', '>=', session('search_import_date'))
                            ->whereDate('created_at', '<=', session('search_import_date'));
        }
        // 並び替えを実施
        return $query->orderBy('created_at', 'desc');
    }
}