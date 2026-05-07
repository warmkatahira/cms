<?php

namespace App\Http\Controllers\SystemAdmin\Role;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => '権限']);
        // 権限を取得(ユーザーのステータスがtrueのレコード数も取得)
        $roles = Role::getAll()
                    ->withCount([
                        'users as active_users_count' => function ($query) {
                            $query->where('is_active', true);
                        }
                    ])
                    ->get();
        return view('system_admin.role.index')->with([
            'roles' => $roles,
        ]);
    }
}