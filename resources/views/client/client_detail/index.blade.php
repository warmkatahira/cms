<x-app-layout>
    <div class="w-full space-y-6">
        <div class="flex gap-6 items-stretch w-full">
            {{-- 顧客情報 --}}
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
                        <p class="text-gray-700">{{ $client->client_address ?? '―' }}</p>
                    </div>
                </div>
            </div>
            {{-- 今年の売上・経費 --}}
            <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex-1 min-w-0">
                <div class="flex items-center justify-between mb-6">
                    <p class="text-sm font-semibold text-gray-600">{{ now()->year }}年 収支サマリー</p>
                    <div class="flex text-xs rounded-lg border border-gray-200 overflow-hidden">
                        <button id="toggle_include_hq" class="px-3 py-1.5 bg-theme-main text-white transition-colors">本社管理費を含む</button>
                        <button id="toggle_exclude_hq" class="px-3 py-1.5 bg-white text-gray-500 transition-colors">本社管理費を除く</button>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-4">
                    <div class="bg-gray-200 rounded-xl p-4">
                        <p class="text-xs text-gray-500 mb-1">売上合計</p>
                        <p class="text-xl font-semibold text-gray-800">¥{{ number_format($summary['total_sales']) }}</p>
                    </div>
                    <div class="bg-gray-200 rounded-xl p-4">
                        <p class="text-xs text-gray-500 mb-1">経費合計</p>
                        <p id="total_cost" class="text-xl font-semibold text-gray-800">¥{{ number_format($summary['total_cost']) }}</p>
                        <p id="hq_cost_row" class="text-xs text-gray-500 mt-1">うち本社管理費 ¥{{ number_format($summary['total_cost_hq']) }}</p>
                    </div>
                    <div class="bg-gray-200 rounded-xl p-4">
                        <p class="text-xs text-gray-500 mb-1">収支</p>
                        <p id="gross_profit" class="text-xl font-semibold {{ $summary['gross_profit'] >= 0 ? 'text-green-600' : 'text-red-500' }}">
                            ¥{{ number_format($summary['gross_profit']) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div id="summary_data"
            data-total-cost="{{ $summary['total_cost'] }}"
            data-total-cost-ex-hq="{{ $summary['total_cost_ex_hq'] }}"
            data-gross-profit="{{ $summary['gross_profit'] }}"
            data-gross-profit-ex-hq="{{ $summary['gross_profit_ex_hq'] }}"
        ></div>
        <div class="flex gap-6 items-start w-full">
            {{-- 月別収支サマリー --}}
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm w-5/12 min-w-0">
                <button id="toggle_monthly_table" class="w-full flex items-center justify-between p-6 text-left">
                    <p class="text-sm font-semibold text-gray-600">{{ now()->year }}年 月別収支サマリー</p>
                    <i id="toggle_monthly_table_icon" class="las la-angle-down text-gray-400 transition-transform"></i>
                </button>
                <div id="monthly_table_body" class="hidden px-6 pb-6">
                    <div class="overflow-x-auto">
                        <table class="w-full text-xs text-right">
                            <thead>
                                <tr class="text-gray-400 border-b border-gray-100">
                                    <th class="text-left pb-2 font-normal">月</th>
                                    <th class="pb-2 font-normal">売上合計</th>
                                    <th class="pb-2 font-normal">経費合計</th>
                                    <th class="pb-2 font-normal" id="th_hq">うち本社管理費</th>
                                    <th class="pb-2 font-normal">収支</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($monthlyData as $i => $row)
                                    <tr class="border-b border-gray-50 hover:bg-gray-50">
                                        <td class="py-2 text-left text-gray-600">{{ $row['month'] }}</td>
                                        <td class="py-2 text-gray-700">¥{{ number_format($row['total_sales']) }}</td>
                                        <td class="py-2 text-gray-700" id="monthly_cost_{{ $i }}">¥{{ number_format($row['total_cost']) }}</td>
                                        <td class="py-2 text-gray-400" id="monthly_hq_{{ $i }}">¥{{ number_format($row['cost_hq']) }}</td>
                                        <td class="py-2 font-medium {{ $row['gross_profit'] >= 0 ? 'text-green-600' : 'text-red-500' }}" id="monthly_profit_{{ $i }}">
                                            ¥{{ number_format($row['gross_profit']) }}
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                            <tfoot>
                                <tr class="border-t border-gray-200 font-medium">
                                    <td class="pt-2 text-left text-gray-600">合計</td>
                                    <td class="pt-2 text-gray-700">¥{{ number_format($summary['total_sales']) }}</td>
                                    <td class="pt-2 text-gray-700" id="monthly_cost_total">¥{{ number_format($summary['total_cost']) }}</td>
                                    <td class="pt-2 text-gray-400" id="monthly_hq_total">¥{{ number_format($summary['total_cost_hq']) }}</td>
                                    <td class="pt-2" id="monthly_profit_total">¥{{ number_format($summary['gross_profit']) }}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            {{-- 月次グラフ --}}
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm w-7/12 min-w-0">
                <button id="toggle_monthly_chart" class="w-full flex items-center justify-between p-6 text-left">
                    <p class="text-sm font-semibold text-gray-600">{{ now()->year }}年 月次推移</p>
                    <i id="toggle_monthly_chart_icon" class="las la-angle-down text-gray-400 transition-transform"></i>
                </button>
                <div id="monthly_chart_body" class="hidden px-6 pb-6">
                    <canvas id="monthly_chart"></canvas>
                    <div id="chart_legend" class="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3"></div>
                </div>
            </div>
        </div>
        {{-- 月次データをデータ属性で渡す --}}
        <div id="monthly_data"
            data-monthly='{{ json_encode($monthlyData) }}'
            data-last-year-monthly='{{ json_encode($lastYearMonthlyData) }}'
        ></div>
        {{-- エイリアス情報 --}}
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
</x-app-layout>
@vite([
    'resources/js/client/client_detail/client_detail.js',
    'resources/js/client/client_detail/chart.js',
])