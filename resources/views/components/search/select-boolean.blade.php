@props([
    'label',
    'id',
    'name',
    'label0',
    'label1',
])

<div class="flex flex-col">
    <label for="{{ $id }}" class="mb-1">{{ $label }}</label>
    <select id="{{ $id }}" name="{{ $name }}" class="search_element rounded border-gray-400 text-xs">
        <option value="" @if(is_null(session($id))) selected @endif></option>
        <option value="1" @if(session($id) === '1') selected @endif>{{ $label1 }}</option>
        <option value="0" @if(session($id) === '0') selected @endif>{{ $label0 }}</option>
    </select>
</div>