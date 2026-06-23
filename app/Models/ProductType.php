<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// モデル
use App\Models\ClientAliasProductType;
// その他
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductType extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'product_type_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'product_name',
        'product_code',
        'sort_order',
    ];
    // client_alias_product_typeテーブル(中間テーブル)とのリレーション
    public function clientAliases(): BelongsToMany
    {
        return $this->belongsToMany(ClientAlias::class, 'client_alias_product_type', 'product_type_id', 'client_alias_id')
                    ->using(ClientAliasProductType::class)
                    ->withPivot('is_primary')
                    ->withTimestamps();
    }
}
