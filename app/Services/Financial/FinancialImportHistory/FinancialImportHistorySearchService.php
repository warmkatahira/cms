<?php

namespace App\Services\Financial\FinancialImportHistory;

// モデル
use App\Models\FinancialImportHistory;
// サービス
use App\Services\Common\BaseFilterService;
// その他
use Illuminate\Support\Facades\DB;

class FinancialImportHistorySearchService extends BaseFilterService
{
    // ベースクエリ
    protected function baseQuery()
    {
        // クエリをセット
        return FinancialImportHistory::with(['user']);
    }

    public function setSearchCondition($request)
    {
        // 親クラスの処理を呼ぶ
        parent::setSearchCondition($request);
    }

    // LIKEキー
    protected function likeKeys(): array
    {
        return [
            'filter_import_original_file_name',
            'filter_error_file_name',
            'filter_message',
        ];
    }

    // 特殊キー
    protected function specialKeys(): array
    {
        return [
            // 取込日
            'filter_import_date_from' => function ($query, $value) {
                $query->whereDate('created_at', '>=', session('filter_import_date_from'))
                    ->whereDate('created_at', '<=', session('filter_import_date_to'));
            },
            // 取込時間
            'filter_import_time' => function ($query, $value) {
                $query->whereRaw('DATE_FORMAT(created_at, "%H:%i:%s") = ?', [
                    date('H:i:s', strtotime($value))
                ]);
            },
            // ユーザー
            'filter_user_name' => function ($query, $value) {
                $query->whereHas('user', function ($q) use ($value) {
                    $q->where('user_name', 'LIKE', '%'. $value .'%');
                });
            },
        ];
    }

    // 無視するキー
    protected function ignoreKeys(): array
    {
        return [
            'filter_import_date_to',
        ];
    }

    // 並び替え
    protected function applySort($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}