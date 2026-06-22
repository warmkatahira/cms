<div class="bg-white rounded-2xl border border-gray-200 shadow-sm w-1/2 min-w-0">
    <button id="toggle_monthly_chart" class="w-full flex items-center justify-between p-6 text-left">
        <p id="label_chart_title" class="text-sm font-semibold text-gray-600">月次収支グラフ</p>
        <i id="toggle_monthly_chart_icon" class="las la-angle-down text-gray-400 transition-transform"></i>
    </button>
    <div id="monthly_chart_body" class="px-6 pb-6">
        <canvas id="monthly_chart"></canvas>
        <div id="chart_legend" class="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3"></div>
        <div class="mt-3 flex justify-end">
            <button id="toggle_datalabels" class="text-xs text-gray-400 border border-gray-200 rounded px-3 py-1 hover:bg-gray-50">
                内訳ラベルを非表示
            </button>
        </div>
    </div>
</div>