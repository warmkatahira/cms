<?php

namespace App\Services\SystemAdmin\Base;

// モデル
use App\Models\Base;

class BaseCreateService
{
    // 営業所を追加
    public function createBase($request)
    {
        // 営業所を追加
        Base::create([
            'base_id'               => $request->base_id,
            'base_name'             => $request->base_name,
            'sort_order'            => $request->sort_order,
        ]);
    }
}