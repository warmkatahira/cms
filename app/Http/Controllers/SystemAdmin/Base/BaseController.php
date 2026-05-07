<?php

namespace App\Http\Controllers\SystemAdmin\Base;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Base;

class BaseController extends Controller
{
    public function index()
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => '営業所']);
        // 営業所を取得(ユーザーの有効/無効がtrueのレコード数も取得)
        $bases = Base::getAll()
                    ->withCount([
                        'users as active_users_count' => function ($query) {
                            $query->where('is_active', true);
                        }
                    ])
                    ->get();
        return view('system_admin.base.index')->with([
            'bases' => $bases,
        ]);
    }
}