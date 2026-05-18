// Chart.jsを読み込み
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// グラフのインスタンスを保持
let monthlyChart = null;

// 今年の月次データを取得
const raw = document.getElementById('monthly_data').getAttribute('data-monthly');
const monthlyData = JSON.parse(raw);
// 前年の月次データを取得
const lastYearRaw = document.getElementById('monthly_data').getAttribute('data-last-year-monthly');
const lastYearMonthlyData = JSON.parse(lastYearRaw);

// サマリーデータをデータ属性から取得
const $summaryData = $('#summary_data');
const summary = {
    total_cost:         parseInt($summaryData.data('total-cost')),          // 経費合計（本社管理費含む）
    total_cost_ex_hq:   parseInt($summaryData.data('total-cost-ex-hq')),    // 経費合計（本社管理費除く）
    gross_profit:       parseInt($summaryData.data('gross-profit')),         // 収支（本社管理費含む）
    gross_profit_ex_hq: parseInt($summaryData.data('gross-profit-ex-hq')),  // 収支（本社管理費除く）
};

// 数値をカンマ区切りにフォーマット
function formatNumber(num) {
    return '¥' + num.toLocaleString();
}

// グラフを描画・更新
function renderChart(includeHq) {
    // 本社管理費含む/除くに応じてデータを切り替え
    const costData     = monthlyData.map(d => includeHq ? d.total_cost : d.total_cost_ex_hq);          // 今年経費
    const profitData   = monthlyData.map(d => includeHq ? d.gross_profit : d.gross_profit_ex_hq);      // 今年収支
    const lastYearCost = lastYearMonthlyData.map(d => includeHq ? d.total_cost : d.total_cost_ex_hq);  // 前年経費
    const lastYearSales = lastYearMonthlyData.map(d => d.total_sales);                                  // 前年売上

    if (monthlyChart) {
        // 既存グラフのデータのみ更新（再描画コストを抑える）
        monthlyChart.data.datasets[1].data = costData;      // 経費合計
        monthlyChart.data.datasets[2].data = profitData;    // 収支
        monthlyChart.data.datasets[3].data = lastYearSales; // 前年売上
        monthlyChart.data.datasets[4].data = lastYearCost;  // 前年経費
        monthlyChart.data.datasets[5].data = lastYearMonthlyData.map(d => includeHq ? d.gross_profit : d.gross_profit_ex_hq); // 前年収支
        monthlyChart.update();
        return;
    }

    // 初回描画
    const ctx = document.getElementById('monthly_chart').getContext('2d');
    monthlyChart = new Chart(ctx, {
        data: {
            labels: monthlyData.map(d => d.month),
            datasets: [
                // 今年売上（棒グラフ）
                {
                    type: 'bar',
                    label: '売上合計',
                    data: monthlyData.map(d => d.total_sales),
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                    order: 2,
                },
                // 今年経費（棒グラフ）
                {
                    type: 'bar',
                    label: '経費合計',
                    data: costData,
                    backgroundColor: 'rgba(249, 115, 22, 0.6)',
                    borderColor: 'rgba(249, 115, 22, 1)',
                    borderWidth: 1,
                    order: 2,
                },
                // 今年収支（折れ線グラフ）
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
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    ticks: {
                        // Y軸の金額表示
                        callback: (value) => '¥' + value.toLocaleString(),
                    },
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        // ツールチップの金額表示
                        label: (context) => context.dataset.label + ': ¥' + context.parsed.y.toLocaleString(),
                    },
                },
            },
        },
    });
}

// サマリーと グラフの表示を更新
function updateSummary(includeHq) {
    const cost   = includeHq ? summary.total_cost : summary.total_cost_ex_hq;
    const profit = includeHq ? summary.gross_profit : summary.gross_profit_ex_hq;

    // 経費合計・収支を更新
    $('#total_cost').text(formatNumber(cost));
    $('#gross_profit')
        .text(formatNumber(profit))
        .removeClass('text-green-600 text-red-500')
        .addClass(profit >= 0 ? 'text-green-600' : 'text-red-500');

    // グラフも連動して更新
    renderChart(includeHq);

    // トグルボタンのスタイル切り替え
    if (includeHq) {
        $('#toggle_include_hq').css({'background-color': '#3d5a80', 'color': '#fff'});
        $('#toggle_exclude_hq').css({'background-color': '#fff', 'color': '#6b7280'});
    } else {
        $('#toggle_exclude_hq').css({'background-color': '#3d5a80', 'color': '#fff'});
        $('#toggle_include_hq').css({'background-color': '#fff', 'color': '#6b7280'});
    }
}

$(function () {
    // 初回は本社管理費含むで描画
    renderChart(true);

    // 本社管理費含むボタン
    $('#toggle_include_hq').on('click', function () {
        updateSummary(true);
    });

    // 本社管理費除くボタン
    $('#toggle_exclude_hq').on('click', function () {
        updateSummary(false);
    });
});