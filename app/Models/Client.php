<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'client_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'client_code',
        'client_name',
        'client_postal_code',
        'client_address',
        'client_tel',
        'client_image_file_name',
        'sort_order',
        'is_active',
        'updated_by',
    ];
}
