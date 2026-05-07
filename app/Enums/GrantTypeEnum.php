<?php

namespace App\Enums;

// その他
use Illuminate\Support\Collection;

enum GrantTypeEnum: int
{
    case NONE           = 0;    // 付与なし
    case FIRST          = 1;    // 1回
    case SECOND         = 2;    // 2回
    case THIRDORMORE    = 3;    // 3回以上

    public function label(): string
    {
        return match($this) {
            GrantTypeEnum::NONE        => '付与なし',
            GrantTypeEnum::FIRST       => '1回',
            GrantTypeEnum::SECOND      => '2回',
            GrantTypeEnum::THIRDORMORE => '3回以上',
        };
    }

    public static function selectOptions()
    {
        return collect(self::cases())->map(fn($e) => (object)[
            'value' => $e->value,
            'label' => $e->label(),
        ]);
    }
}