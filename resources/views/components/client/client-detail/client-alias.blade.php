<div class="bg-white rounded-2xl border border-gray-200 shadow-sm">
    <button id="toggle_aliases" class="w-full flex items-center justify-between p-6 text-left">
        <p class="text-sm font-semibold text-gray-600">紐付け荷主名</p>
        <i id="toggle_aliases_icon" class="las la-angle-down text-gray-400 transition-transform"></i>
    </button>
    <div id="aliases_body" class="hidden px-6 pb-6">
        @if($client->clientAliases->isEmpty())
            <p class="text-sm text-gray-400">紐付けされている荷主名はありません。</p>
        @else
            <div class="flex flex-col gap-3">
                @foreach($client->clientAliases->groupBy('base_id') as $base_id => $aliases)
                    <div class="bg-gray-100 rounded-2xl border border-gray-200 p-4 shadow-sm">
                        <p class="text-sm font-semibold text-gray-500 mb-3">
                            <i class="las la-warehouse mr-1 la-lg"></i>
                            {{ $aliases->first()->base->base_name ?? $base_id }}
                        </p>
                        <div class="flex flex-wrap gap-2">
                            @foreach($aliases as $alias)
                                <span class="inline-flex items-center px-3 py-1 rounded text-xs bg-badge-normal">
                                    {{ $alias->client_alias_name }}
                                </span>
                            @endforeach
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</div>