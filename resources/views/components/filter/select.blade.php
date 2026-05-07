@props([
    'id',
    'name',
    'selectItems',
    'optionValue',
    'optionText',
    'disabled' => false,
])

<th class="px-3">
    <div class="flex flex-row items-center">
        <select id="{{ $id }}" name="{{ $name }}" class="search_element rounded border-gray-400 text-xs font-thin mx-2 py-1" @if($disabled) disabled class="opacity-50 cursor-not-allowed" @endif>
            <option value=""></option>
            @foreach($selectItems as $item)
                <option value="{{ $item->$optionValue }}" @if(session()->has($name) && (string)session($name) === (string)$item->$optionValue) selected @endif>{{ $item->$optionText }}</option>
            @endforeach
        </select>
        <button type="button" class="filter_clear btn hidden" data-target="{{ $name }}"><i class="las la-times la-lg text-red-500 pr-2"></i></button>
    </div>
</th>