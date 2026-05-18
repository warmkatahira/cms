<?php

namespace App\Services\SystemAdmin\User;

// モデル
use App\Models\User;
// サービス
use App\Services\Common\BaseFilterService;
// 列挙
use App\Enums\RoleEnum;
// その他
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class UserSearchService extends BaseFilterService
{
    // ベースクエリ
    protected function baseQuery()
    {
        // クエリをセット
        return User::with(['role', 'base']);
    }

    public function setSearchCondition($request)
    {
        // フィルター送信時かつfilter_is_activeが明示的に送られてきた場合はそのまま使う
        if($request->process_type !== 'filter'){
            // 初回アクセス時のみis_activeの初期値をtrueにセット
            if (!session()->has('filter_is_active')) {
                session(['filter_is_active' => '1']);
            }
        }
        // base_adminの場合、フィルターに値をセット
        $auth_user = Auth::user();
        if($auth_user->role_id === RoleEnum::BASE_ADMIN){
            session([
                'filter_is_active' => '1',
                'filter_base_id'   => $auth_user->base_id,
            ]);
        }
        // 親クラスの処理を呼ぶ
        parent::setSearchCondition($request);
    }

    // LIKEキー
    protected function likeKeys(): array
    {
        return [
            'filter_user_id',
            'filter_user_name',
        ];
    }

    // 特殊キー
    protected function specialKeys(): array
    {
        return [
            // 権限
            'filter_role_id' => function ($query, $value) {
                $query->whereHas('role', function ($q) use ($value) {
                    $q->where('role_id', $value);
                });
            },
            // 営業所
            'filter_base_id' => function ($query, $value) {
                $query->whereHas('base', function ($q) use ($value) {
                    $q->where('base_id', $value);
                });
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
        return $query->orderBy('users.user_no', 'asc');
    }
}