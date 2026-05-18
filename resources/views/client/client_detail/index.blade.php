<x-app-layout>
    <div class="w-full max-w-4xl space-y-6">
        {{-- 顧客情報 --}}
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
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
                    <p class="text-gray-700">{{ $client->client_address ?? '―' }}</p>
                </div>
            </div>
        </div>
        {{-- 今年の売上・経費 --}}
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <p class="text-sm font-semibold text-gray-600">{{ now()->year }}年 収支サマリー</p>
                {{-- トグルボタン --}}
                <div class="flex text-xs rounded-lg border border-gray-200 overflow-hidden">
                    <button id="toggle_include_hq" class="px-3 py-1.5 bg-theme-main text-white transition-colors">本社管理費を含む</button>
                    <button id="toggle_exclude_hq" class="px-3 py-1.5 bg-white text-gray-500 transition-colors">本社管理費を除く</button>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                    <p class="text-xs text-gray-400 mb-0.5">売上合計</p>
                    <p class="text-gray-700 font-medium">¥{{ number_format($summary['total_sales']) }}</p>
                </div>
                <div>
                    <p class="text-xs text-gray-400 mb-0.5">経費合計</p>
                    <p id="total_cost" class="text-gray-700 font-medium">¥{{ number_format($summary['total_cost']) }}</p>
                </div>
                <div>
                    <p class="text-xs text-gray-400 mb-0.5">収支</p>
                    <p id="gross_profit" class="font-medium {{ $summary['gross_profit'] >= 0 ? 'text-green-600' : 'text-red-500' }}">
                        ¥{{ number_format($summary['gross_profit']) }}
                    </p>
                </div>
            </div>
        </div>
        <div id="summary_data"
            data-total-cost="{{ $summary['total_cost'] }}"
            data-total-cost-ex-hq="{{ $summary['total_cost_ex_hq'] }}"
            data-gross-profit="{{ $summary['gross_profit'] }}"
            data-gross-profit-ex-hq="{{ $summary['gross_profit_ex_hq'] }}"
        ></div>
        {{-- 月次グラフ --}}
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p class="text-sm font-semibold text-gray-600 mb-4">{{ now()->year }}年 月次推移</p>
            <canvas id="monthly_chart"></canvas>
        </div>
        {{-- 月次データをデータ属性で渡す --}}
        <div id="monthly_data"
            data-monthly='{{ json_encode($monthlyData) }}'
            data-last-year-monthly='{{ json_encode($lastYearMonthlyData) }}'
        ></div>
        {{-- エイリアス情報 --}}
        <div>
            <p class="text-sm font-semibold text-gray-600 mb-3">紐付け荷主名</p>
            @if($client->clientAliases->isEmpty())
                <p class="text-sm text-gray-400">紐付けされている荷主名はありません。</p>
            @else
                {{-- 営業所ごとにグループ化 --}}
                @foreach($client->clientAliases->groupBy('base_id') as $base_id => $aliases)
                    <div class="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-3">
                        <p class="text-xs font-semibold text-gray-500 mb-3">
                            <i class="las la-building mr-1"></i>
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
            @endif
        </div>
    </div>
</x-app-layout>
@vite([
    'resources/js/client/client_detail/client_detail.js',
    'resources/js/client/client_detail/chart.js',
])