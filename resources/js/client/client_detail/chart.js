import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
    return '¥' + num.toLocaleString();
}

// 売上内訳の色
const salesColors = {
    storage:  { bg: 'rgba(59, 130, 246, 0.75)',  border: 'rgba(59, 130, 246, 1)'  }, // 保管：青
    handling: { bg: 'rgba(168, 85, 247, 0.75)',  border: 'rgba(168, 85, 247, 1)'  }, // 荷役：紫
    freight:  { bg: 'rgba(34, 197, 94, 0.75)',   border: 'rgba(34, 197, 94, 1)'   }, // 運賃：緑
    other:    { bg: 'rgba(234, 179, 8, 0.75)',   border: 'rgba(234, 179, 8, 1)'   }, // その他：黄
};

function renderChart(includeHq) {
    const costData      = monthlyData.map(d => includeHq ? d.total_cost : d.total_cost_ex_hq);
    const profitData    = monthlyData.map(d => includeHq ? d.gross_profit : d.gross_profit_ex_hq);
    const lastYearCost  = lastYearMonthlyData.map(d => includeHq ? d.total_cost : d.total_cost_ex_hq);
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
                {
                    type: 'bar',
                    label: '売上：保管',
                    data: monthlyData.map(d => d.sales_storage),
                    backgroundColor: salesColors.storage.bg,
                    borderColor: salesColors.storage.border,
                    borderWidth: 0,
                    stack: 'sales',
                    order: 2,
                },
                {
                    type: 'bar',
                    label: '売上：荷役',
                    data: monthlyData.map(d => d.sales_handling),
                    backgroundColor: salesColors.handling.bg,
                    borderColor: salesColors.handling.border,
                    borderWidth: 0,
                    stack: 'sales',
                    order: 2,
                },
                {
                    type: 'bar',
                    label: '売上：運賃',
                    data: monthlyData.map(d => d.sales_freight),
                    backgroundColor: salesColors.freight.bg,
                    borderColor: salesColors.freight.border,
                    borderWidth: 0,
                    stack: 'sales',
                    order: 2,
                },
                {
                    type: 'bar',
                    label: '売上：その他',
                    data: monthlyData.map(d => d.sales_other),
                    backgroundColor: salesColors.other.bg,
                    borderColor: salesColors.other.border,
                    borderWidth: 0,
                    stack: 'sales',
                    order: 2,
                },
                // 経費合計（単色棒グラフ）
                {
                    type: 'bar',
                    label: '経費合計',
                    data: costData,
                    backgroundColor: 'rgba(249, 115, 22, 0.6)',
                    borderColor: 'rgba(249, 115, 22, 1)',
                    borderWidth: 0,
                    order: 2,
                },
                // 収支（折れ線）
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
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            if (context.parsed.y === 0) return null;
                            return context.dataset.label + ': ¥' + context.parsed.y.toLocaleString();
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

    renderChart(includeHq);

    if (includeHq) {
        $('#toggle_include_hq').css({ 'background-color': '#3d5a80', 'color': '#fff' });
        $('#toggle_exclude_hq').css({ 'background-color': '#fff',    'color': '#6b7280' });
    } else {
        $('#toggle_exclude_hq').css({ 'background-color': '#3d5a80', 'color': '#fff' });
        $('#toggle_include_hq').css({ 'background-color': '#fff',    'color': '#6b7280' });
    }
}

$(function () {
    window._includeHq = true;
    renderChart(true);

    $('#toggle_include_hq').on('click', function () { updateSummary(true); });
    $('#toggle_exclude_hq').on('click', function () { updateSummary(false); });
});