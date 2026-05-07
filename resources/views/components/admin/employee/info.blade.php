@props([
    'value',
    'digit' => null,
    'format',
])

@php
    $result = displayCheckIfUnregisterd($value, $digit, $format);
@endphp

<td class="py-1 px-2 border {{ $result['class'] }}">
    {{ $result['value'] }}
</td>