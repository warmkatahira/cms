<div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex-1 min-w-0">
    {{-- ヘッダー：拠点名 --}}
    <div class="flex items-center gap-4 mb-[18px]">
        <div class="flex items-center gap-2">
            <i class="las la-building text-2xl text-gray-400"></i>
            <p class="text-lg font-semibold text-gray-800">{{ $base->base_name }}</p>
        </div>
    </div>
    {{-- 区切り線＋項目グリッド --}}
    <div class="border-t border-gray-100 pt-[14px] grid grid-cols-2 gap-[14px] text-sm">
        {{-- 郵便番号 --}}
        <div class="flex gap-2.5">
            <i class="las la-mail-bulk text-lg text-gray-400 mt-0.5"></i>
            <div>
                <p class="text-xs text-gray-400">郵便番号</p>
                <p class="text-gray-700">{{ $base->base_postal_code ?? '―' }}</p>
            </div>
        </div>
        {{-- 電話番号 --}}
        <div class="flex gap-2.5">
            <i class="las la-phone text-lg text-gray-400 mt-0.5"></i>
            <div>
                <p class="text-xs text-gray-400">電話番号</p>
                <p class="text-gray-700">{{ $base->base_tel ?? '―' }}</p>
            </div>
        </div>
        {{-- 住所 --}}
        <div class="flex gap-2.5 col-span-2">
            <i class="las la-map-marker-alt text-lg text-gray-400 mt-0.5"></i>
            <div class="min-w-0">
                <p class="text-xs text-gray-400 mb-0.5">住所</p>
                @if($base->base_address)
                    <a href="https://www.google.com/maps/search/?api=1&query={{ urlencode($base->base_address) }}"
                       target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-1.5 text-blue-600 hover:underline"
                       data-tippy-content="Google Mapで表示">
                        <span>{{ $base->base_address }}</span>
                        <i class="las la-external-link-alt text-xs shrink-0"></i>
                    </a>
                @else
                    <p class="text-gray-700">―</p>
                @endif
            </div>
        </div>
    </div>
</div>