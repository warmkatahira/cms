<?php

namespace App\Services\Client\Client;

// モデル
use App\Models\Client;
// サービス
use App\Services\Common\BaseFilterService;
// その他
use Illuminate\Support\Facades\DB;

class ClientSearchService extends BaseFilterService
{
    // ベースクエリ
    protected function baseQuery()
    {
        // クエリをセット
        return Client::with(['user', 'clientAliases.base']);
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
            'filter_client_name',
        ];
    }

    // 特殊キー
    protected function specialKeys(): array
    {
        return [
            // 最終更新者
            'filter_user_name' => function ($query, $value) {
                $query->whereHas('user', function ($q) use ($value) {
                    $q->where('user_name', 'LIKE', '%' . $value . '%');
                });
            },
            // 営業所
            'filter_base_id' => function ($query, $value) {
                $query->whereHas('clientAliases', function ($q) use ($value) {
                    $q->where('base_id', '=', $value);
                });
            },
            // 最終更新日時
            'filter_updated_at' => function ($query, $value) {
                $query->where('updated_at', 'LIKE', '%' . $value . '%');
            },
        ];
    }

    // 無視するキー
    protected function ignoreKeys(): array
    {
        return [];
    }

    // 並び替え
    protected function applySort($query)
    {
        return $query->orderBy('created_at', 'asc');
    }
}