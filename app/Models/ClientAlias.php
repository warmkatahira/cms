<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientAlias extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'client_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'base_id',
        'client_id',
        'client_alias_name',
    ];
}
