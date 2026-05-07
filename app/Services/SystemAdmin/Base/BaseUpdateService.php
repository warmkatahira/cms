<?php

namespace App\Services\SystemAdmin\Base;

// モデル
use App\Models\Base;

class BaseUpdateService
{
    // 営業所を更新
    public function updateBase($request)
    {
        // 営業所を取得
        $base = Base::where('base_id', $request->base_id)->lockForUpdate()->first();
        // 営業所を更新
        $base->update([
            'base_name'     => $request->base_name,
            'sort_order'    => $request->sort_order,
        ]);
    }
}