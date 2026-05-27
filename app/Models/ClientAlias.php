<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    // basesテーブルとのリレーション
    public function base()
    {
        return $this->belongsTo(Base::class, 'base_id', 'base_id');
    }
    // client_alias_userテーブル(中間テーブル)とのリレーション
    public function users()
    {
        return $this->belongsToMany(User::class, 'client_alias_user', 'client_alias_id', 'user_no', 'client_alias_id', 'user_no');
    }
}
