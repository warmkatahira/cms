import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables, ChartDataLabels);

// ─── 初期データ（当期・サーバーサイドで埋め込み済み） ────────────────
let monthlyData         = JSON.parse(document.getElementById('monthly_data').getAttribute('data-monthly'));
let lastYearMonthlyData = JSON.parse(document.getElementById('monthly_data').getAttribute('data-last-year-monthly'));

const $summaryData = $('#summary_data');
let summary = {
    total_sales:        parseFloat($summaryData.data('total-sales')),
    total_cost:         parseFloat($summaryData.data('total-cost')),
    total_cost_ex_hq:   parseFloat($summaryData.data('total-cost-ex-hq')),
    total_cost_hq:      parseFloat($summaryData.data('total-cost-hq')),
    gross_profit:       parseFloat($summaryData.data('gross-profit')),
    gross_profit_ex_hq: parseFloat($summaryData.data('gross-profit-ex-hq')),
};

const $meta    = $('#page_meta');
const clientId = $meta.data('client-id');

let monthlyChart = null;
let showDatalabels = true;

// ─── フォーマット ────────────────────────────────────────────────────
function formatNumber(num) {
    return '¥' + parseInt(num).toLocaleString();
}

// ─── 色定義 ─────────────────────────────────────────────────────────
const salesColors = {
    storage:  { bg: 'rgba(65, 105, 225, 0.85)',  border: 'rgba(65, 105, 225, 1)'  },
    handling: { bg: 'rgba(135, 206, 250, 0.85)', border: 'rgba(135, 206, 250, 1)' },
    freight:  { bg: 'rgba(175, 238, 238, 0.85)', border: 'rgba(175, 238, 238, 1)' },
    other:    { bg: 'rgba(0, 255, 255, 0.85)',   border: 'rgba(0, 255, 255, 1)'   },
};
const costColors = {
    storage:  { bg: 'rgba(255, 228, 225, 0.85)', border: 'rgba(255, 228, 225, 1)' },
    employee: { bg: 'rgba(255, 192, 203, 0.85)', border: 'rgba(255, 192, 203, 1)' },
    part:     { bg: 'rgba(255, 240, 245, 0.85)', border: 'rgba(255, 240, 245, 1)' },
    temp:     { bg: 'rgba(255, 20, 147, 0.85)',  border: 'rgba(255, 20, 147, 1)'  },
    freight:  { bg: 'rgba(221, 160, 221, 0.85)', border: 'rgba(221, 160, 221, 1)' },
    other:    { bg: 'rgba(255, 0, 0, 0.85)',     border: 'rgba(255, 0, 0, 1)'     },
};

// ─── 凡例 ────────────────────────────────────────────────────────────
const legendConfig = {
    sales: [
        { label: '保管',   color: salesColors.storage.bg  },
        { label: '荷役',   color: salesColors.handling.bg },
        { label: '運賃',   color: salesColors.freight.bg  },
        { label: 'その他', color: salesColors.other.bg    },
    ],
    cost: [
        { label: '保管',       color: costColors.storage.bg  },
        { label: '社員人件費', color: costColors.employee.bg },
        { label: 'パート人件費', color: costColors.part.bg   },
        { label: '派遣人件費', color: costColors.temp.bg     },
        { label: '運賃',       color: costColors.freight.bg  },
        { label: 'その他',     color: costColors.other.bg    },
    ],
    lines: [
        { label: '本社管理費', color: 'rgba(245,158,11,1)',   dashed: false },
        { label: '収支',       color: 'rgba(34,197,94,1)',    dashed: false },
        { label: '前期売上',   color: 'rgba(59,130,246,0.5)', dashed: true  },
        { label: '前期経費',   color: 'rgba(249,115,22,0.5)', dashed: true  },
        { label: '前期収支',   color: 'rgba(34,197,94,0.5)',  dashed: true  },
    ],
};

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

// ─── グラフ描画 ──────────────────────────────────────────────────────
function renderChart(includeHq) {
    const profitData    = monthlyData.map(d => includeHq ? d.gross_profit : d.gross_profit_ex_hq);
    const lastYearSales = lastYearMonthlyData.map(d => d.total_sales);
    const lastYearCost  = lastYearMonthlyData.map(d => d.total_cost_ex_hq);

    if (monthlyChart) {
        monthlyChart.destroy();
        monthlyChart = null;
    }

    const ctx = document.getElementById('monthly_chart').getContext('2d');
    monthlyChart = new Chart(ctx, {
        data: {
            labels: monthlyData.map(d => d.month),
            datasets: [
                { type: 'bar',  label: '売上：保管',         data: monthlyData.map(d => d.sales_storage),  backgroundColor: salesColors.storage.bg,  borderWidth: 0, stack: 'sales', order: 1,  datalabels: { display: showDatalabels, formatter: () => '保', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar',  label: '売上：荷役',         data: monthlyData.map(d => d.sales_handling), backgroundColor: salesColors.handling.bg, borderWidth: 0, stack: 'sales', order: 2,  datalabels: { display: showDatalabels, formatter: () => '荷', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar',  label: '売上：運賃',         data: monthlyData.map(d => d.sales_freight),  backgroundColor: salesColors.freight.bg,  borderWidth: 0, stack: 'sales', order: 3,  datalabels: { display: showDatalabels, formatter: () => '運', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar',  label: '売上：その他',       data: monthlyData.map(d => d.sales_other),    backgroundColor: salesColors.other.bg,    borderWidth: 0, stack: 'sales', order: 4,  datalabels: { display: showDatalabels, formatter: () => '他', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar',  label: '経費：保管',         data: monthlyData.map(d => d.cost_storage),   backgroundColor: costColors.storage.bg,   borderWidth: 0, stack: 'cost',  order: 5,  datalabels: { display: showDatalabels, formatter: () => '保', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar',  label: '経費：社員人件費',   data: monthlyData.map(d => d.cost_employee),  backgroundColor: costColors.employee.bg,  borderWidth: 0, stack: 'cost',  order: 6,  datalabels: { display: showDatalabels, formatter: () => '社', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar',  label: '経費：パート人件費', data: monthlyData.map(d => d.cost_part),      backgroundColor: costColors.part.bg,      borderWidth: 0, stack: 'cost',  order: 7,  datalabels: { display: showDatalabels, formatter: () => 'パ', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar',  label: '経費：派遣人件費',   data: monthlyData.map(d => d.cost_temp),      backgroundColor: costColors.temp.bg,      borderWidth: 0, stack: 'cost',  order: 8,  datalabels: { display: showDatalabels, formatter: () => '派', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar',  label: '経費：運賃',         data: monthlyData.map(d => d.cost_freight),   backgroundColor: costColors.freight.bg,   borderWidth: 0, stack: 'cost',  order: 9,  datalabels: { display: showDatalabels, formatter: () => '運', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'bar',  label: '経費：その他',       data: monthlyData.map(d => d.cost_other),     backgroundColor: costColors.other.bg,     borderWidth: 0, stack: 'cost',  order: 10, datalabels: { display: showDatalabels, formatter: () => '他', color: '#555', font: { size: 10, weight: 'bold' } } },
                { type: 'line', label: '本社管理費', data: monthlyData.map(d => d.cost_hq),  backgroundColor: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,1)',  borderWidth: 2, pointRadius: 3, tension: 0.3, order: 11 },
                { type: 'line', label: '収支',       data: profitData,                        backgroundColor: 'rgba(34,197,94,0.1)',  borderColor: 'rgba(34,197,94,1)',   borderWidth: 2, pointRadius: 3, tension: 0.3, order: 12 },
                { type: 'line', label: '前期売上',   data: lastYearSales,                     borderColor: 'rgba(59,130,246,0.4)',     borderWidth: 1.5, borderDash: [5,5], pointRadius: 2, tension: 0.3, order: 13 },
                { type: 'line', label: '前期経費',   data: lastYearCost,                      borderColor: 'rgba(249,115,22,0.4)',     borderWidth: 1.5, borderDash: [5,5], pointRadius: 2, tension: 0.3, order: 14 },
                { type: 'line', label: '前期収支',   data: lastYearMonthlyData.map(d => includeHq ? d.gross_profit : d.gross_profit_ex_hq), borderColor: 'rgba(34,197,94,0.4)', borderWidth: 1.5, borderDash: [5,5], pointRadius: 2, tension: 0.3, order: 15 },
            ],
        },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: { stacked: true },
                y: { ticks: { callback: (value) => '¥' + value.toLocaleString() } },
            },
            plugins: {
                legend: { display: false },
                datalabels: { display: false },
                tooltip: {
                    bodyFont: { size: 11 },
                    titleFont: { size: 11 },
                    padding: 8,
                    callbacks: {
                        beforeLabel: (context) => {
                            if (context.dataset.label === '売上：保管') return '─── 売上 ───────────';
                            if (context.dataset.label === '経費：保管') return '─── 経費 ───────────';
                            if (context.dataset.label === '収支')       return '─── 収支 ───────────';
                            if (context.dataset.label === '前期売上')   return '─── 前期 ───────────';
                            return null;
                        },
                        label: (context) => {
                            const month      = context.dataIndex;
                            const ty         = monthlyData[month];
                            const ly         = lastYearMonthlyData[month];
                            const _includeHq = window._includeHq ?? true;

                            const diff = (a, b) => {
                                const d = a - b;
                                return (d >= 0 ? '+¥' : '-¥') + Math.abs(d).toLocaleString();
                            };
                            const pct = (a, b) => {
                                if (b === 0) return '―';
                                const p = ((a - b) / Math.abs(b) * 100).toFixed(1);
                                return (p >= 0 ? '+' : '') + p + '%';
                            };

                            if (context.dataset.label === '前期売上') {
                                const tySales = ty.total_sales;
                                const lySales = parseFloat(ly.total_sales) || 0;
                                return `前期: ¥${lySales.toLocaleString()}　前期比: ${diff(tySales, lySales)}（${pct(tySales, lySales)}）`;
                            }
                            if (context.dataset.label === '前期経費') {
                                const tyCost = _includeHq ? ty.total_cost : ty.total_cost_ex_hq;
                                const lyCost = parseFloat(_includeHq ? ly.total_cost : ly.total_cost_ex_hq) || 0;
                                return `前期: ¥${lyCost.toLocaleString()}　前期比: ${diff(tyCost, lyCost)}（${pct(tyCost, lyCost)}）`;
                            }
                            if (context.dataset.label === '前期収支') {
                                const tyProfit = _includeHq ? ty.gross_profit : ty.gross_profit_ex_hq;
                                const lyProfit = parseFloat(_includeHq ? ly.gross_profit : ly.gross_profit_ex_hq) || 0;
                                return `前期: ¥${lyProfit.toLocaleString()}　前期比: ${diff(tyProfit, lyProfit)}（${pct(tyProfit, lyProfit)}）`;
                            }
                            if (context.parsed.y === 0) return null;
                            const name = context.dataset.label.replace('売上：', '').replace('経費：', '');
                            return name + ': ¥' + context.parsed.y.toLocaleString();
                        },
                        afterLabel: (context) => {
                            const month      = context.dataIndex;
                            const ty         = monthlyData[month];
                            const _includeHq = window._includeHq ?? true;
                            if (context.dataset.label === '売上：その他') {
                                return `合計: ¥${parseInt(ty.total_sales).toLocaleString()}`;
                            }
                            if (context.dataset.label === '経費：その他' && !_includeHq) {
                                return `合計: ¥${parseInt(ty.total_cost_ex_hq).toLocaleString()}`;
                            }
                            if (context.dataset.label === '本社管理費') {
                                return `合計: ¥${parseInt(ty.total_cost).toLocaleString()}`;
                            }
                            return null;
                        },
                    },
                    filter: (tooltipItem) => {
                        const month    = tooltipItem.dataIndex;
                        const ty       = monthlyData[month];
                        const ly       = lastYearMonthlyData[month];
                        const tyHasData = ty && parseFloat(ty.total_sales) !== 0;
                        const lyHasData = ly && parseFloat(ly.total_sales) !== 0;
                        if (!tyHasData && !lyHasData) return false;
                        const label = tooltipItem.dataset.label;
                        if (label === '前期売上' || label === '前期経費' || label === '前期収支') return true;
                        if (label === '本社管理費' && !(window._includeHq ?? true)) return false;
                        if (tooltipItem.parsed.y === 0) return false;
                        return true;
                    },
                },
            },
        },
    });
}

// ─── サマリー・テーブル更新 ──────────────────────────────────────────
function updateSummary(includeHq) {
    window._includeHq = includeHq;
    const cost   = includeHq ? summary.total_cost : summary.total_cost_ex_hq;
    const profit = includeHq ? summary.gross_profit : summary.gross_profit_ex_hq;

    $('#total_sales').text(formatNumber(summary.total_sales));
    $('#total_cost').text(formatNumber(cost));
    $('#hq_cost_row').toggle(includeHq);
    $('#gross_profit')
        .text(formatNumber(profit))
        .removeClass('text-green-600 text-red-500')
        .addClass(profit >= 0 ? 'text-green-600' : 'text-red-500');

    // 月別テーブル
    monthlyData.forEach((row, i) => {
        const rowCost   = includeHq ? row.total_cost : row.total_cost_ex_hq;
        const rowProfit = includeHq ? row.gross_profit : row.gross_profit_ex_hq;
        $(`#monthly_sales_${i}`).text(formatNumber(row.total_sales));
        $(`#monthly_cost_${i}`).text(formatNumber(rowCost));
        $(`#monthly_hq_${i}`).css('visibility', includeHq ? 'visible' : 'hidden');
        $(`#monthly_profit_${i}`)
            .text(formatNumber(rowProfit))
            .removeClass('text-green-600 text-red-500')
            .addClass(rowProfit >= 0 ? 'text-green-600' : 'text-red-500');
    });

    // 合計行
    $('#monthly_sales_total').text(formatNumber(summary.total_sales));
    $('#monthly_cost_total').text(formatNumber(cost));
    $('#monthly_hq_total').css('visibility', includeHq ? 'visible' : 'hidden');
    $('#monthly_profit_total')
        .text(formatNumber(profit))
        .removeClass('text-green-600 text-red-500')
        .addClass(profit >= 0 ? 'text-green-600' : 'text-red-500');

    // 本社管理費列ヘッダー
    $('#th_hq').css('visibility', includeHq ? 'visible' : 'hidden');

    updateSalesAvg();
    updateCostAvg(includeHq, cost);
    renderChart(includeHq);

    // トグルボタン
    if (includeHq) {
        $('#toggle_include_hq').removeClass('bg-white text-gray-500').addClass('bg-theme-main text-white');
        $('#toggle_exclude_hq').removeClass('bg-theme-main text-white').addClass('bg-white text-gray-500');
    } else {
        $('#toggle_exclude_hq').removeClass('bg-white text-gray-500').addClass('bg-theme-main text-white');
        $('#toggle_include_hq').removeClass('bg-theme-main text-white').addClass('bg-white text-gray-500');
    }
}

function updateSalesAvg() {
    const salesMonths = monthlyData.filter(d => parseFloat(d.total_sales) > 0).length;
    const salesAvg    = salesMonths > 0 ? Math.round(summary.total_sales / salesMonths) : 0;
    $('#sales_avg').text(`月平均 ¥${salesAvg.toLocaleString()}（${salesMonths}ヶ月）`);
}

function updateCostAvg(includeHq, totalCost) {
    const costKey    = includeHq ? 'total_cost' : 'total_cost_ex_hq';
    const costMonths = monthlyData.filter(d => parseFloat(d[costKey]) > 0).length;
    const costAvg    = costMonths > 0 ? Math.round(totalCost / costMonths) : 0;
    $('#cost_avg').text(`月平均 ¥${costAvg.toLocaleString()}（${costMonths}ヶ月）`);
}

// ─── 期ラベル更新 ────────────────────────────────────────────────────
function updatePeriodLabels(fiscalYear) {
    // slice(0,7)で YYYY-MM だけ取り出してから置換（1回で済む）
    const start = fiscalYear.start_date.slice(0, 7).replace('-', '/');
    const end   = fiscalYear.end_date.slice(0, 7).replace('-', '/');
    const label = `第${fiscalYear.period}期（${start}〜${end}）`;

    // トリガーボタンのラベルを更新（period と range を別々に）
    $('#fiscal_year_period_label').text(`第${fiscalYear.period}期`);
    $('#fiscal_year_range_label').text(`${start}〜${end}`);

    // 各セクションタイトルを更新
    $('#label_summary_title').text(label + ' 収支サマリー');
    $('#label_monthly_title').text(label + ' 月別収支サマリー');
    $('#label_chart_title').text(label + ' 月別収支グラフ');
}

// ─── 月別テーブルを再構築（期切り替え時・行数が変わるため） ──────────
function rebuildMonthlyTable() {
    const includeHq = window._includeHq ?? true;
    const rows = monthlyData.map((row, i) => {
        const rowCost   = includeHq ? row.total_cost : row.total_cost_ex_hq;
        const rowProfit = includeHq ? row.gross_profit : row.gross_profit_ex_hq;
        const profitClass = rowProfit >= 0 ? 'text-green-600' : 'text-red-500';
        return `
            <tr class="border-b border-gray-50 hover:bg-gray-50">
                <td class="py-2 text-left text-gray-600">${row.month}</td>
                <td class="py-2 text-gray-700" id="monthly_sales_${i}">${formatNumber(row.total_sales)}</td>
                <td class="py-2 text-gray-700" id="monthly_cost_${i}">${formatNumber(rowCost)}</td>
                <td class="py-2 text-gray-400" id="monthly_hq_${i}" style="visibility:${includeHq ? 'visible' : 'hidden'}">${formatNumber(row.cost_hq)}</td>
                <td class="py-2 font-medium ${profitClass}" id="monthly_profit_${i}">${formatNumber(rowProfit)}</td>
            </tr>
        `;
    }).join('');
    $('#monthly_table_rows').html(rows);
}

// ─── 期切り替えAPI ───────────────────────────────────────────────────
async function switchFiscalYear(period, fiscalYear) {
    try {
        $('#fiscal_year_trigger').prop('disabled', true);
        const res = await fetch(`/client_detail/fiscal/${period}?client_id=${clientId}`, {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Accept': 'application/json',
            },
        });
        if (!res.ok) throw new Error('取得失敗');
        const data = await res.json();

        monthlyData         = data.monthly;
        lastYearMonthlyData = data.last_year_monthly;
        summary = {
            total_sales:        parseFloat(data.summary.total_sales),
            total_cost:         parseFloat(data.summary.total_cost),
            total_cost_ex_hq:   parseFloat(data.summary.total_cost_ex_hq),
            total_cost_hq:      parseFloat(data.summary.total_cost_hq),
            gross_profit:       parseFloat(data.summary.gross_profit),
            gross_profit_ex_hq: parseFloat(data.summary.gross_profit_ex_hq),
        };

        // ─── 成功後にチェックマーク更新 ──────────────────────────
        $('.fiscal_year_option').each(function () {
            const isSelected = parseInt($(this).data('period')) === period;
            $(this)
                .toggleClass('text-theme-main font-semibold bg-theme-main/5', isSelected)
                .toggleClass('text-gray-700', !isSelected);
            $(this).find('.la-check').css('display', isSelected ? 'inline' : 'none');
        });

        updatePeriodLabels(data.fiscal_year ?? fiscalYear);
        rebuildMonthlyTable();
        updateSummary(window._includeHq ?? true);

    } catch (e) {
        alert('データの取得に失敗しました');
    } finally {
        $('#fiscal_year_trigger').prop('disabled', false);
    }
}

// ─── 初期化 ──────────────────────────────────────────────────────────
$(function () {
    window._includeHq = true;

    // ─── 初期期情報は page_meta から取得 ───────────────────────────
    const initialPeriod = parseInt($meta.data('current-period'));
    const $initialOpt   = $(`.fiscal_year_option[data-period="${initialPeriod}"]`);
    updatePeriodLabels({
        period:     initialPeriod,
        start_date: $initialOpt.data('start'),
        end_date:   $initialOpt.data('end'),
    });

    updateSummary(true);
    buildLegend();

    // 期セレクタ
    // ─── カスタムドロップダウン ───────────────────────────────────────
    const $trigger = $('#fiscal_year_trigger');
    const $menu    = $('#fiscal_year_menu');
    const $chevron = $('#fiscal_year_chevron');

    // 開閉
    $trigger.on('click', function (e) {
        e.stopPropagation();
        const isOpen = !$menu.hasClass('hidden');
        $menu.toggleClass('hidden');
        $chevron.toggleClass('rotate-180', !isOpen);
    });

    // 外側クリックで閉じる
    $(document).on('click', function () {
        $menu.addClass('hidden');
        $chevron.removeClass('rotate-180');
    });

    // 期を選択（チェックマーク更新部分も修正）
    $(document).on('click', '.fiscal_year_option', function () {
        const period = parseInt($(this).data('period'));
        const start  = $(this).data('start');
        const end    = $(this).data('end');

        // ─── チェックマーク更新はここでやらない ───

        // メニューを閉じる
        $menu.addClass('hidden');
        $chevron.removeClass('rotate-180');

        // データ取得
        switchFiscalYear(period, { period, start_date: start, end_date: end });
    });

    // 本社管理費トグル
    $('#toggle_include_hq').on('click', function () { updateSummary(true);  });
    $('#toggle_exclude_hq').on('click', function () { updateSummary(false); });

    // アコーディオン
    $('#toggle_monthly_table').on('click', function () {
        $('#monthly_table_body').toggleClass('hidden');
        $('#toggle_monthly_table_icon').toggleClass('rotate-180');
    });
    $('#toggle_monthly_chart').on('click', function () {
        $('#monthly_chart_body').toggleClass('hidden');
        $('#toggle_monthly_chart_icon').toggleClass('rotate-180');
    });
    $('#toggle_aliases').on('click', function () {
        $('#aliases_body').toggleClass('hidden');
        $('#toggle_aliases_icon').toggleClass('rotate-180');
    });

    // 内訳ラベルのボタンが押された場合
    $('#toggle_datalabels').on('click', function () {
        showDatalabels = !showDatalabels;
        $(this).text(showDatalabels ? '内訳ラベルを非表示' : '内訳ラベルを表示');
        renderChart(window._includeHq ?? true);
    });
});