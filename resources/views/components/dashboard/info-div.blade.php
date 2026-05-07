@props([
    'label',
    'value',
    'format',
    'digit' => 1,
    'usedDays' => false,
])

@php
    $result = displayCheckIfUnregisterd($value, $digit, $format);
    $class = 'bg-white';
    if($usedDays){
        $class = 'border border-red-500 bg-red-100';
    }
@endphp

<div class="col-span-12 md:col-span-3 rounded-xl shadow-lg p-4 {{ $class }}">
    <p class="text-xl md:text-base text-gray-600 text-center tracking-wide">{{ $label }}</p>
    <p class="mt-2 text-3xl md:text-2xl font-bold text-gray-800 text-center">
        {{ $result['value'] }}
        @if($result['value'] !== '未登録')
            @if($format === 'day')
                <span class="text-base md:text-sm font-normal text-gray-400">日</span>
            @elseif($format === 'hour')
                <span class="text-base md:text-sm font-normal text-gray-400">時間</span>
            @endif
        @endif
    </p>
</div>