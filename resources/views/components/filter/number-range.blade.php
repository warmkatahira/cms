@props([
    'id',
    'name',
])

<th class="px-3">
    <div class="flex flex-row items-center gap-1 min-w-0">
        <div class="flex flex-row items-center min-w-0">
            <input type="tel" id="{{ $id }}_min" name="{{ $name }}_min" class="search_element rounded border border-gray-400 text-xs text-center font-thin py-1 w-16" value="{{ session($name . '_min') }}" placeholder="以上" autocomplete="off">
            <button type="button" class="filter_clear btn hidden flex-shrink-0" data-target="{{ $id }}_min"><i class="las la-times la-lg text-red-500"></i></button>
        </div>
        <span class="text-xs flex-shrink-0">〜</span>
        <div class="flex flex-row items-center min-w-0">
            <input type="tel" id="{{ $id }}_max" name="{{ $name }}_max" class="search_element rounded border border-gray-400 text-xs text-center font-thin py-1 w-16" value="{{ session($name . '_max') }}" placeholder="以下" autocomplete="off">
            <button type="button" class="filter_clear btn hidden flex-shrink-0" data-target="{{ $id }}_max"><i class="las la-times la-lg text-red-500"></i></button>
        </div>
    </div>
</th>