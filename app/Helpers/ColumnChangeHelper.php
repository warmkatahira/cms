<?php

namespace App\Helpers;

class ColumnChangeHelper
{
    public static function column_en_change(string $column, array $en_change_list): string
    {
        return $en_change_list[$column] ?? '';
    }
}