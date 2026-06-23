<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// モデル
use App\Models\ClientAliasProductType;
use App\Models\ProductType;
// その他
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ClientAlias extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'client_alias_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'base_id',
        'client_id',
        'client_alias_name',
    ];
    // clientsテーブルとのリレーション
    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'client_id');
    }
    // basesテーブルとのリレーション
    public function base()
    {
        return $this->belongsTo(Base::class, 'base_id', 'base_id');
    }
    // client_alias_userテーブル(中間テーブル)とのリレーション
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'client_alias_user', 'client_alias_id', 'user_no', 'client_alias_id', 'user_no');
    }
    // client_alias_product_typeテーブル(中間テーブル)とのリレーション
    public function productTypes(): BelongsToMany
    {
        return $this->belongsToMany(ProductType::class, 'client_alias_product_type', 'client_alias_id', 'product_type_id')
                        ->using(ClientAliasProductType::class)
                        ->withPivot('is_primary')
                        ->withTimestamps()
                        ->orderByPivot('is_primary', 'desc');
    }
}
