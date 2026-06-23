<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ClientAliasProductType extends Pivot
{
    // テーブル名を定義
    protected $table = 'client_alias_product_type';
    // 主キーカラムを変更
    protected $primaryKey = 'id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'client_alias_id',
        'product_type_id',
        'is_primary',
    ];
    protected $casts = [
        'is_primary' => 'boolean',
    ];
}
