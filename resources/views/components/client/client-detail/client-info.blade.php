<div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm w-1/2 flex-1 min-w-0">
    {{-- ヘッダー：ロゴ＋会社名＋ステータス --}}
    <div class="flex items-center gap-4 mb-[18px]">
        <img class="image_fade_in_modal_open w-16 h-16 rounded-lg object-contain bg-gray-50 border border-gray-100"
             src="{{ asset('storage/client_images/'.$client->client_image_file_name) }}">
        <div>
            <div class="flex items-center gap-2">
                <p class="text-lg font-semibold text-gray-800">{{ $client->client_name }}</p>
                <x-list.status :value="$client->is_active" label1="有効" label0="無効" />
            </div>
            <p class="text-xs text-gray-400 mt-0.5">最終更新者：{{ $client->user->user_name }}</p>
        </div>
    </div>
    {{-- 区切り線＋項目グリッド --}}
    <div class="border-t border-gray-100 pt-[14px] grid grid-cols-2 gap-[14px] text-sm">
        {{-- 郵便番号 --}}
        <div class="flex gap-2.5">
            <i class="las la-mail-bulk text-lg text-gray-400 mt-0.5"></i>
            <div>
                <p class="text-xs text-gray-400">郵便番号</p>
                <p class="text-gray-700">{{ $client->client_postal_code ?? '―' }}</p>
            </div>
        </div>
        {{-- 電話番号 --}}
        <div class="flex gap-2.5">
            <i class="las la-phone text-lg text-gray-400 mt-0.5"></i>
            <div>
                <p class="text-xs text-gray-400">電話番号</p>
                <p class="text-gray-700">{{ $client->client_tel ?? '―' }}</p>
            </div>
        </div>
        {{-- 住所 --}}
        <div class="flex gap-2.5 col-span-2">
            <i class="las la-map-marker-alt text-lg text-gray-400 mt-0.5"></i>
            <div class="min-w-0">
                <p class="text-xs text-gray-400 mb-0.5">住所</p>
                @if($client->client_address)
                    <a href="https://www.google.com/maps/search/?api=1&query={{ urlencode($client->client_address) }}"
                       target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-1.5 text-blue-600 hover:underline"
                       data-tippy-content="Google Mapで表示">
                        <span>{{ $client->client_address }}</span>
                        <i class="las la-external-link-alt text-xs shrink-0"></i>
                    </a>
                @else
                    <p class="text-gray-700">―</p>
                @endif
            </div>
        </div>
    </div>
</div>