<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'staff_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'base_id',
        'staff_name',
        'role_name',
        'color',
        'size',
        'shape',
        'is_active',
    ];
}
