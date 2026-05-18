import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables, ChartDataLabels);

let monthlyChart = null;

const raw = document.getElementById('monthly_data').getAttribute('data-monthly');
const monthlyData = JSON.parse(raw);
const lastYearRaw = document.getElementById('monthly_data').getAttribute('data-last-year-monthly');
const lastYearMonthlyData = JSON.parse(lastYearRaw);

const $summaryData = $('#summary_data');
const summary = {
    total_cost:         parseInt($summaryData.data('total-cost')),
    total_cost_ex_hq:   parseInt($summaryData.data('total-cost-ex-hq')),
    gross_profit:       parseInt($summaryData.data('gross-profit')),
    gross_profit_ex_hq: parseInt($summaryData.data('gross-profit-ex-hq')),
};

function formatNumber(num) {
    return '¥' + parseInt(num).toLocaleString();
}

// 売上内訳の色（青系・はっきり異なる色）
const salesColors = {
    storage:  { bg: 'rgba(65, 105, 225, 0.85)', border: 'rgba(65, 105, 225, 1)' }, // 保管
    handling: { bg: 'rgba(135, 206, 250, 0.85)', border: 'rgba(135, 206, 250, 1)' }, // 荷役
    freight:  { bg: 'rgba(175, 238, 238, 0.85)', border: 'rgba(175, 238, 238, 1)' }, // 運賃
    other:    { bg: 'rgba(0, 255, 255, 0.85)', border: 'rgba(0, 255, 255, 1)' }, // その他
};

// 経費内訳の色（赤系・はっきり異なる色）
const costColors = {
    storage:  { bg: 'rgba(255, 228, 225,  0.85)', border: 'rgba(255, 228, 225,  1)' }, // 保管
    employee: { bg: 'rgba(255, 192, 203,  0.85)', border: 'rgba(255, 192, 203,  1)' }, // 社員
    part:     { bg: 'rgba(255, 240, 245,  0.85)', border: 'rgba(255, 240, 245,  1)' }, // パート
    temp:     { bg: 'rgba(255, 20, 147,  0.85)', border: 'rgba(255, 20, 147,  1)' }, // 派遣
    freight:  { bg: 'rgba(221, 160, 221, 0.85)', border: 'rgba(221, 160, 221, 1)' }, // 運賃
    other:    { bg: 'rgba(255, 0, 0,  0.85)', border: 'rgba(255, 0, 0,  1)' }, // その他
};

// 凡例定義（色の一元管理）
const legendConfig = {
    sales: [
        { label: '保管',   color: salesColors.storage.bg  },
        { label: '荷役',   color: salesColors.handling.bg },
        { label: '運賃',   color: salesColors.freight.bg  },
        { label: 'その他', color: salesColors.other.bg    },
    ],
    cost: [
        { label: '保管',   color: costColors.storage.bg  },
        { label: '社員人件費', color: costColors.employee.bg },
        { label: 'パート人件費',   color: costColors.part.bg     },
        { label: '派遣人件費',   color: costColors.temp.bg     },
        { label: '運賃',   color: costColors.freight.bg  },
        { label: 'その他', color: costColors.other.bg    },
    ],
    lines: [
        { label: '本社管理費', color: 'rgba(245,158,11,1)',    dashed: false },
        { label: '収支',       color: 'rgba(34,197,94,1)',     dashed: false },
        { label: '前年売上',   color: 'rgba(59,130,246,0.5)',  dashed: true  },
        { label: '前年経費',   color: 'rgba(249,115,22,0.5)',  dashed: true  },
        { label: '前年収支',   color: 'rgba(34,197,94,0.5)',   dashed: true  },
    ],
};

// 凡例HTMLを生成
function buildLegend() {
    const salesHtml = legendConfig.sales.map(item =>
        `<span class="flex items-center gap-1.5 text-xs text-gray-600">
            <span class="w-3 h-3 rounded-sm flex-shrink-0" style="background:${item.color}"></span>${item.label}
        </span>`
    ).join('');

    const costHtml = legendConfig.cost.map(item =>
        `<span class="flex items-center gap-1.5 text-xs text-gray-600">
            <span class="w-3 h-3 rounded-sm flex-shrink-0" style="background:${item.color}"></span>${item.label}
        </span>`
    ).join('');

    const linesHtml = legendConfig.lines.map(item =>
        `<span class="flex items-center gap-1.5 text-xs text-gray-600">
            <span class="w-5 flex-shrink-0" style="border-top: 2px ${item.dashed ? 'dashed' : 'solid'} ${item.color}"></span>${item.label}
        </span>`
    ).join('');

    document.getElementById('chart_legend').innerHTML = `
        <div>
            <p class="text-xs text-gray-400 mb-1.5">売上内訳</p>
            <div class="flex flex-wrap gap-x-4 gap-y-1.5">${salesHtml}</div>
        </div>
        <div>
            <p class="text-xs text-gray-400 mb-1.5">経費内訳</p>
            <div class="flex flex-wrap gap-x-4 gap-y-1.5">${costHtml}</div>
        </div>
        <div>
            <p class="text-xs text-gray-400 mb-1.5">折れ線</p>
            <div class="flex flex-wrap gap-x-4 gap-y-1.5">${linesHtml}</div>
        </div>
    `;
}

function renderChart(includeHq) {
    const costData     = monthlyData.map(d => d.total_cost_ex_hq);         // 常に本社管理費除き
    const profitData   = monthlyData.map(d => includeHq ? d.gross_profit : d.gross_profit_ex_hq); // 収支はトグルで切り替え
    const lastYearCost = lastYearMonthlyData.map(d => d.total_cost_ex_hq); // 常に本社管理費除き
    const lastYearSales = lastYearMonthlyData.map(d => d.total_sales);

    if (monthlyChart) {
        monthlyChart.destroy();
        monthlyChart = null;
    }

    const ctx = document.getElementById('monthly_chart').getContext('2d');
    monthlyChart = new Chart(ctx, {
        data: {
            labels: monthlyData.map(d => d.month),
            datasets: [
                // 売上内訳（積み上げ棒グラフ）
                { type: 'bar', label: '売上：保管',        data: monthlyData.map(d => d.sales_storage),  backgroundColor: salesColors.storage.bg,  borderColor: salesColors.storage.border,  borderWidth: 0, stack: 'sales', order: 2, datalabels: { display: true, formatter: () => '保', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar', label: '売上：荷役',        data: monthlyData.map(d => d.sales_handling), backgroundColor: salesColors.handling.bg, borderColor: salesColors.handling.border, borderWidth: 0, stack: 'sales', order: 2, datalabels: { display: true, formatter: () => '荷', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar', label: '売上：運賃',        data: monthlyData.map(d => d.sales_freight),  backgroundColor: salesColors.freight.bg,  borderColor: salesColors.freight.border,  borderWidth: 0, stack: 'sales', order: 2, datalabels: { display: true, formatter: () => '運', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar', label: '売上：その他',      data: monthlyData.map(d => d.sales_other),    backgroundColor: salesColors.other.bg,    borderColor: salesColors.other.border,    borderWidth: 0, stack: 'sales', order: 2, datalabels: { display: true, formatter: () => '他', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar', label: '経費：保管',        data: monthlyData.map(d => d.cost_storage),   backgroundColor: costColors.storage.bg,   borderColor: costColors.storage.border,   borderWidth: 0, stack: 'cost',  order: 2, datalabels: { display: true, formatter: () => '保', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar', label: '経費：社員人件費',  data: monthlyData.map(d => d.cost_employee),  backgroundColor: costColors.employee.bg,  borderColor: costColors.employee.border,  borderWidth: 0, stack: 'cost',  order: 2, datalabels: { display: true, formatter: () => '社', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar', label: '経費：パート人件費',data: monthlyData.map(d => d.cost_part),      backgroundColor: costColors.part.bg,      borderColor: costColors.part.border,      borderWidth: 0, stack: 'cost',  order: 2, datalabels: { display: true, formatter: () => 'パ', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar', label: '経費：派遣人件費',  data: monthlyData.map(d => d.cost_temp),      backgroundColor: costColors.temp.bg,      borderColor: costColors.temp.border,      borderWidth: 0, stack: 'cost',  order: 2, datalabels: { display: true, formatter: () => '派', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar', label: '経費：運賃',        data: monthlyData.map(d => d.cost_freight),   backgroundColor: costColors.freight.bg,   borderColor: costColors.freight.border,   borderWidth: 0, stack: 'cost',  order: 2, datalabels: { display: true, formatter: () => '運', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar', label: '経費：その他',      data: monthlyData.map(d => d.cost_other),     backgroundColor: costColors.other.bg,     borderColor: costColors.other.border,     borderWidth: 0, stack: 'cost',  order: 2, datalabels: { display: true, formatter: () => '他', color: '#555', font: { size: 10, weight: 'bold' } } },
                // 本社管理費（折れ線・常に表示）
                {
                    type: 'line',
                    label: '本社管理費',
                    data: monthlyData.map(d => d.cost_hq),
                    borderColor: 'rgba(245, 158, 11, 1)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0.3,
                    order: 1,
                },
                // 収支（折れ線）※includeHqで計算切り替え
                {
                    type: 'line',
                    label: '収支',
                    data: profitData,
                    borderColor: 'rgba(34, 197, 94, 1)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0.3,
                    order: 1,
                },
                // 前年売上（点線）
                {
                    type: 'line',
                    label: '前年売上',
                    data: lastYearSales,
                    borderColor: 'rgba(59, 130, 246, 0.4)',
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    pointRadius: 2,
                    tension: 0.3,
                    order: 1,
                },
                // 前年経費（点線）
                {
                    type: 'line',
                    label: '前年経費',
                    data: lastYearCost,
                    borderColor: 'rgba(249, 115, 22, 0.4)',
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    pointRadius: 2,
                    tension: 0.3,
                    order: 1,
                },
                // 前年収支（点線）
                {
                    type: 'line',
                    label: '前年収支',
                    data: lastYearMonthlyData.map(d => includeHq ? d.gross_profit : d.gross_profit_ex_hq),
                    borderColor: 'rgba(34, 197, 94, 0.4)',
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    pointRadius: 2,
                    tension: 0.3,
                    order: 1,
                },
            ],
        },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: { stacked: true },
                y: {
                    ticks: {
                        callback: (value) => '¥' + value.toLocaleString(),
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                datalabels: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            if (context.parsed.y === 0) return null;
                            return context.dataset.label + ': ¥' + context.parsed.y.toLocaleString();
                        },
                        afterBody: (tooltipItems) => {
                            const month = tooltipItems[0]?.dataIndex;
                            if (month === undefined) return [];

                            const ty = monthlyData[month];
                            const ly = lastYearMonthlyData[month];
                            const _includeHq = window._includeHq ?? true;

                            const tySales  = ty.total_sales;
                            const tyCost   = _includeHq ? ty.total_cost : ty.total_cost_ex_hq;
                            const tyProfit = _includeHq ? ty.gross_profit : ty.gross_profit_ex_hq;
                            const lySales  = parseInt(ly.total_sales)  || 0;
                            const lyCost   = parseInt(_includeHq ? ly.total_cost : ly.total_cost_ex_hq) || 0;
                            const lyProfit = parseInt(_includeHq ? ly.gross_profit : ly.gross_profit_ex_hq) || 0;

                            // 増減金額・増減率を計算
                            const diff = (ty, ly) => {
                                const d = ty - ly;
                                if (d >= 0) return '+¥' + d.toLocaleString();
                                return '-¥' + Math.abs(d).toLocaleString();
                            };
                            const pct = (ty, ly) => {
                                if (ly === 0) return '―';
                                const p = ((ty - ly) / Math.abs(ly) * 100).toFixed(1);
                                return (p >= 0 ? '+' : '') + p + '%';
                            };

                            return [
                                '───   前年情報   ───────────',
                                `前年売上: ¥${lySales.toLocaleString()}　${diff(tySales, lySales)}（${pct(tySales, lySales)}）`,
                                `前年経費: ¥${lyCost.toLocaleString()}　${diff(tyCost, lyCost)}（${pct(tyCost, lyCost)}）`,
                                `前年収支: ¥${lyProfit.toLocaleString()}　${diff(tyProfit, lyProfit)}（${pct(tyProfit, lyProfit)}）`,
                            ];
                        },
                    },
                    filter: (tooltipItem) => {
                        if (tooltipItem.dataset.label.startsWith('前年')) return false;
                        if (tooltipItem.parsed.y === 0) return false;
                        return true;
                    },
                },
            },
        },
    });
}

function updateSummary(includeHq) {
    window._includeHq = includeHq;
    const cost   = includeHq ? summary.total_cost : summary.total_cost_ex_hq;
    const profit = includeHq ? summary.gross_profit : summary.gross_profit_ex_hq;

    $('#total_cost').text(formatNumber(cost));
    $('#gross_profit')
        .text(formatNumber(profit))
        .removeClass('text-green-600 text-red-500')
        .addClass(profit >= 0 ? 'text-green-600' : 'text-red-500');

    $('#hq_cost_row').toggle(includeHq);

    // 月別テーブルを更新
    monthlyData.forEach((row, i) => {
        const rowCost   = includeHq ? row.total_cost : row.total_cost_ex_hq;
        const rowProfit = includeHq ? row.gross_profit : row.gross_profit_ex_hq;

        $(`#monthly_cost_${i}`).text(formatNumber(rowCost));
        $(`#monthly_hq_${i}`).css('visibility', includeHq ? 'visible' : 'hidden');
        $(`#monthly_profit_${i}`)
            .text(formatNumber(rowProfit))
            .removeClass('text-green-600 text-red-500')
            .addClass(rowProfit >= 0 ? 'text-green-600' : 'text-red-500');
    });

    // 合計行を更新
    const totalCost   = includeHq ? summary.total_cost : summary.total_cost_ex_hq;
    const totalProfit = includeHq ? summary.gross_profit : summary.gross_profit_ex_hq;
    $('#monthly_cost_total').text(formatNumber(totalCost));
    $('#monthly_hq_total').css('visibility', includeHq ? 'visible' : 'hidden');
    $('#monthly_profit_total')
        .text(formatNumber(totalProfit))
        .removeClass('text-green-600 text-red-500')
        .addClass(totalProfit >= 0 ? 'text-green-600' : 'text-red-500');

    renderChart(includeHq);

    if (includeHq) {
        $('#toggle_include_hq').removeClass('bg-white text-gray-500').addClass('bg-theme-main text-white');
        $('#toggle_exclude_hq').removeClass('bg-theme-main text-white').addClass('bg-white text-gray-500');
    } else {
        $('#toggle_exclude_hq').removeClass('bg-white text-gray-500').addClass('bg-theme-main text-white');
        $('#toggle_include_hq').removeClass('bg-theme-main text-white').addClass('bg-white text-gray-500');
    }
    // 本社管理費列の表示切り替え
    $('#th_hq').css('visibility', includeHq ? 'visible' : 'hidden');
    monthlyData.forEach((row, i) => {
        $(`#monthly_hq_${i}`).css('visibility', includeHq ? 'visible' : 'hidden');
    });
    $('#monthly_hq_total').css('visibility', includeHq ? 'visible' : 'hidden');
}

$(function () {
    window._includeHq = true;
    renderChart(true);
    buildLegend();

    // アコーディオン
    $('#toggle_monthly_table').on('click', function () {
        $('#monthly_table_body').toggleClass('hidden');
        $('#toggle_monthly_table_icon').toggleClass('rotate-180');
    });

    $('#toggle_monthly_chart').on('click', function () {
        const isHidden = $('#monthly_chart_body').hasClass('hidden');
        $('#monthly_chart_body').toggleClass('hidden');
        $('#toggle_monthly_chart_icon').toggleClass('rotate-180');
        // グラフは表示時に初回描画
        if (isHidden && !monthlyChart) {
            renderChart(window._includeHq);
        }
    });

    $('#toggle_aliases').on('click', function () {
        $('#aliases_body').toggleClass('hidden');
        $('#toggle_aliases_icon').toggleClass('rotate-180');
    });

    $('#toggle_include_hq').on('click', function () { updateSummary(true); });
    $('#toggle_exclude_hq').on('click', function () { updateSummary(false); });
});