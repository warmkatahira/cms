<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// その他
use Carbon\CarbonImmutable;

class FiscalYear extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'fiscal_year_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'period',
        'start_date',
        'end_date',
    ];
    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
    ];
    // 「period」で並び替え
    public function scopeOrdered($query, string $direction = 'asc')
    {
        return $query->orderBy('period', $direction);
    }
    // 当期を取得
    public static function current(): ?self
    {
        $today = CarbonImmutable::now()->toDateString();
        return self::where('start_date', '<=', $today)
                   ->where('end_date',   '>=', $today)
                   ->first();
    }
    // 月リストを期首月順で返す（例：[10,11,12,1,2,...,9]）
    public function monthSequence(): array
    {
        $months = [];
        $cursor = CarbonImmutable::parse($this->start_date);
        $end    = CarbonImmutable::parse($this->end_date);
        while ($cursor->lte($end)) {
            $months[] = (int) $cursor->month;
            $cursor   = $cursor->addMonth();
        }
        return $months;
    }
}
