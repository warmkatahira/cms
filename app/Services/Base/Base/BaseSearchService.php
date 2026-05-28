<?php

namespace App\Services\Base\Base;

// モデル
use App\Models\Base;
use App\Models\ClientAlias;
// サービス
use App\Services\Common\BaseFilterService;
// その他
use Illuminate\Support\Facades\DB;

class BaseSearchService extends BaseFilterService
{
    // ベースクエリ
    protected function baseQuery()
    {
        // クエリをセット
        return Base::addSelect([
            'client_count' => ClientAlias::selectRaw('COUNT(DISTINCT client_id)')
                                    ->whereColumn('base_id', 'bases.base_id'),
            'alias_count' => ClientAlias::selectRaw('COUNT(*)')
                                    ->whereColumn('base_id', 'bases.base_id'),
        ]);
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
            'filter_short_base_name',
        ];
    }

    // 特殊キー
    protected function specialKeys(): array
    {
        return [];
    }

    // 無視するキー
    protected function ignoreKeys(): array
    {
        return [];
    }

    // 並び替え
    protected function applySort($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }
}