<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Base extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'base_id';
    // オートインクリメント無効化
    public $incrementing = false;
    // 操作可能なカラムを定義
    protected $fillable = [
        'base_id',
        'base_name',
        'short_base_name',
        'base_postal_code',
        'base_address',
        'base_tel',
        'base_fax',
        'sort_order',
    ];
    // 「sort_order」で並び替え
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }
    // usersテーブルとのリレーション
    public function users()
    {
        return $this->hasMany(User::class, 'base_id', 'base_id');
    }
    // client_aliasesテーブルとのリレーション
    public function clientAliases()
    {
        return $this->hasMany(ClientAlias::class, 'base_id', 'base_id');
    }
}
