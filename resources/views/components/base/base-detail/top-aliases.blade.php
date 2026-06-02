<div class="bg-white rounded-2xl border border-gray-200 w-6/12 shadow-sm">
    <button id="toggle_top_aliases" class="w-full flex items-center justify-between p-6 text-left">
        <p id="label_top_aliases_title" class="text-sm font-semibold text-gray-600">売上トップ10エイリアス</p>
        <i id="toggle_top_aliases_icon" class="las la-angle-down text-gray-400 transition-transform"></i>
    </button>
    <div id="top_aliases_body" class="px-6 pb-6">
        <div id="top_aliases_list" class="flex flex-col gap-1">
            @forelse($topAliases as $i => $row)
                <div class="flex items-center justify-between py-2 border-b border-gray-50">
                    <div class="flex items-center gap-3 min-w-0">
                        <span class="w-6 text-center text-xs font-semibold {{ $i < 3 ? 'text-theme-main' : 'text-gray-400' }}">{{ $i + 1 }}</span>
                        <div class="min-w-0">
                            <p class="text-sm text-gray-700 truncate">{{ $row['client_alias_name'] }}</p>
                            <p class="text-xs text-gray-400 truncate">{{ $row['client_name'] }}</p>
                        </div>
                    </div>
                    <p class="text-sm font-medium text-gray-700 whitespace-nowrap ml-2">¥{{ number_format($row['total_sales']) }}</p>
                </div>
            @empty
                <p class="text-sm text-gray-400">この期に売上のあるエイリアスはありません。</p>
            @endforelse
        </div>
    </div>
</div>