<?php

namespace App\Services\Common;

// その他
use Illuminate\Support\Collection;

class CsvConvertService
{
    // 全行をSJIS-winからUTF-8に変換
    public static function convertToUtf8(Collection $rows): Collection
    {
        return $rows->map(function ($row) {
            $result = [];
            // 1行分のキーと値をそれぞれUTF-8に変換
            foreach ($row as $key => $value) {
                // ヘッダー（キー）をSJIS-win → UTF-8に変換
                $new_key = mb_convert_encoding($key, 'UTF-8', 'SJIS-win');
                // セルの値をSJIS-win → UTF-8に変換
                $new_value = mb_convert_encoding($value, 'UTF-8', 'SJIS-win');
                $result[$new_key] = $new_value;
            }
            return $result;
        });
    }
}