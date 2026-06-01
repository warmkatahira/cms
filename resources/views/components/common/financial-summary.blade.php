<div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex-1 min-w-0">
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
            <p id="label_summary_title" class="text-sm font-semibold text-gray-600">収支サマリー</p>
        </div>
        <div class="flex text-xs rounded-lg border border-gray-200 overflow-hidden">
            <button id="toggle_include_hq" class="px-3 py-1.5 bg-theme-main text-white transition-colors">本社管理費を含む</button>
            <button id="toggle_exclude_hq" class="px-3 py-1.5 bg-white text-gray-500 transition-colors">本社管理費を除く</button>
        </div>
    </div>
    <div class="grid grid-cols-3 gap-4">
        <div class="bg-gray-200 rounded-xl p-4">
            <p class="text-xs text-gray-500 mb-1">売上合計</p>
            <p id="total_sales" class="text-xl font-semibold text-gray-800">¥{{ number_format($summary['total_sales']) }}</p>
            <p id="sales_avg" class="text-xs text-gray-400 mt-1"></p>
        </div>
        <div class="bg-gray-200 rounded-xl p-4">
            <p class="text-xs text-gray-500 mb-1">経費合計</p>
            <p id="total_cost" class="text-xl font-semibold text-gray-800">¥{{ number_format($summary['total_cost']) }}</p>
            <p id="hq_cost_row" class="text-xs text-gray-500 mt-1">うち本社管理費 ¥{{ number_format($summary['total_cost_hq']) }}</p>
            <p id="cost_avg" class="text-xs text-gray-400 mt-1"></p>
        </div>
        <div class="bg-gray-200 rounded-xl p-4">
            <p class="text-xs text-gray-500 mb-1">収支</p>
            <p id="gross_profit" class="text-xl font-semibold {{ $summary['gross_profit'] >= 0 ? 'text-green-600' : 'text-red-500' }}">
                ¥{{ number_format($summary['gross_profit']) }}
            </p>
        </div>
    </div>
</div>