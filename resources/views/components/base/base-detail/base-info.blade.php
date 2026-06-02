<div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex-1 min-w-0">
    <div class="flex items-center gap-4 mb-6">
        <div>
            <div class="flex items-center gap-2">
                <p class="text-lg font-semibold text-gray-800">{{ $base->base_name }}</p>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
            <p class="text-xs text-gray-400 mb-0.5">郵便番号</p>
            <p class="text-gray-700">{{ $base->base_postal_code ?? '―' }}</p>
        </div>
        <div>
            <p class="text-xs text-gray-400 mb-0.5">電話番号</p>
            <p class="text-gray-700">{{ $base->base_tel ?? '―' }}</p>
        </div>
        <div class="col-span-2">
            <p class="text-xs text-gray-400 mb-0.5">住所</p>
            @if($base->base_address)
                <a href="https://www.google.com/maps/search/?api=1&query={{ urlencode($base->base_address) }}"
                target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-blue-600 hover:underline"
                data-tippy-content='<i class="las la-map-marked-alt la-lg"></i> Google Mapで表示'>
                    {{ $base->base_address }}
                </a>
            @else
                <p class="text-gray-700">―</p>
            @endif
        </div>
    </div>
</div>