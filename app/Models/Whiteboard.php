<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// その他
use Carbon\CarbonImmutable;

class Whiteboard extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'whiteboard_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'title',
        'canvas_w',
        'canvas_h',
        'created_by',
    ];
    public function items()
    {
        return $this->hasMany(WhiteboardItem::class, 'whiteboard_id', 'whiteboard_id');
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'whiteboard_users', 'whiteboard_id', 'user_no', 'whiteboard_id', 'user_no')
                    ->withTimestamps();
    }
    // リレーション追加
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_no');
    }
    // 最終アクティビティ日時（items・users・whiteboard自身の最新）
    public function getLastActivityAtAttribute(): string
    {
        $dates = collect([
            $this->updated_at,
            $this->items()->max('updated_at'),
            \DB::table('whiteboard_users')->where('whiteboard_id', $this->whiteboard_id)->max('updated_at'),
        ])->filter()->map(fn($d) => CarbonImmutable::parse($d));

        $latest = $dates->max();

        $weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        $weekday  = $weekdays[$latest->dayOfWeek];

        return $latest->format('Y/m/d') . '(' . $weekday . ') ' . $latest->format('H:i:s') . ' (' . $latest->diffForHumans() . ')';
    }
}
