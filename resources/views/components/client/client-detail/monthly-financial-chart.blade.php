<div class="bg-white rounded-2xl border border-gray-200 shadow-sm w-7/12 min-w-0">
    <button id="toggle_monthly_chart" class="w-full flex items-center justify-between p-6 text-left">
        <p id="label_chart_title" class="text-sm font-semibold text-gray-600">月次収支グラフ</p>
        <i id="toggle_monthly_chart_icon" class="las la-angle-down text-gray-400 transition-transform"></i>
    </button>
    <div id="monthly_chart_body" class="px-6 pb-6">
        <canvas id="monthly_chart"></canvas>
        <div id="chart_legend" class="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3"></div>
    </div>
</div>