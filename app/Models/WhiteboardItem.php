<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhiteboardItem extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'whiteboard_item_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'whiteboard_id',
        'item_type',
        'item_id',
        'pos_x',
        'pos_y',
        'on_board',
        'meta',
    ];
    // キャスト
    protected $casts = [
        'on_board' => 'boolean',
        'meta'     => 'array',
        'pos_x'    => 'float',
        'pos_y'    => 'float',
    ];
}
