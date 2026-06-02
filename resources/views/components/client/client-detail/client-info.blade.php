<div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex-1 min-w-0">
    <div class="flex items-center gap-4 mb-6">
        <img class="image_fade_in_modal_open w-20 h-20 rounded-lg object-contain" src="{{ asset('storage/client_images/'.$client->client_image_file_name) }}">
        <div>
            <div class="flex items-center gap-2">
                <p class="text-lg font-semibold text-gray-800">{{ $client->client_name }}</p>
                <x-list.status :value="$client->is_active" label1="有効" label0="無効" />
            </div>
            <p class="text-xs text-gray-400 mt-0.5">最終更新者：{{ $client->user->user_name }}</p>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
            <p class="text-xs text-gray-400 mb-0.5">郵便番号</p>
            <p class="text-gray-700">{{ $client->client_postal_code ?? '―' }}</p>
        </div>
        <div>
            <p class="text-xs text-gray-400 mb-0.5">電話番号</p>
            <p class="text-gray-700">{{ $client->client_tel ?? '―' }}</p>
        </div>
        <div class="col-span-2">
            <p class="text-xs text-gray-400 mb-0.5">住所</p>
            @if($client->client_address)
                <a href="https://www.google.com/maps/search/?api=1&query={{ urlencode($client->client_address) }}"
                target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-blue-600 hover:underline"
                data-tippy-content='<i class="las la-map-marked-alt la-lg"></i> Google Mapで表示'>
                    {{ $client->client_address }}
                </a>
            @else
                <p class="text-gray-700">―</p>
            @endif
        </div>
    </div>
</div>