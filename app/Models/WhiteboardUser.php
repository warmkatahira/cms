<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhiteboardUser extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'whiteboard_user_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'whiteboard_id',
        'user_no',
    ];
}
