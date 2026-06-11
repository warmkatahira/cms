<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Whiteboard extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'whiteboard_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'base_id',
        'board_type',
        'title',
        'canvas_w',
        'canvas_h',
    ];
    public function items()
    {
        return $this->hasMany(WhiteboardItem::class, 'whiteboard_id', 'whiteboard_id');
    }
}
