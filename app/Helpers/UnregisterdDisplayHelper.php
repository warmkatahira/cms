<?php

if (! function_exists('displayCheckIfUnregisterd')) {
    function displayCheckIfUnregisterd($value, int $digit = null, string $format)
    {
        if(is_null($value)){
            return [
                'value' => '未登録',
                'class' => 'text-center',
            ];
        }
        if($format === 'number' || $format === 'day' || $format === 'hour'){
            return [
                'value' => number_format($value, $digit),
                'class' => 'text-right',
            ];
        }elseif($format === 'date'){
            return [
                'value' => CarbonImmutable::parse($value)->isoFormat('YYYY年MM月DD日(ddd)'),
                'class' => 'text-left',
            ];
        }
    }
}