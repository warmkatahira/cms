@props([
    'label',
    'value',
    'grayedOut' => false,
])

<div class="flex flex-col bg-white py-2 px-3 w-full md:w-form-div">
    <label class="text-gray-800 py-2.5 pl-3">
        {{ $label }}
    </label>
    <p class="pl-3 w-full border border-gray-400 text-sm py-2.5 @if($grayedOut) bg-gray-200 @endif">{{ $value }}</p>
</div>