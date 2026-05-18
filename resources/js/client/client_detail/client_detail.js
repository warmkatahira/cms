$(function () {
    // データ属性からサービスの値を取得
    const $summaryData = $('#summary_data');
    const summary = {
        total_cost:         parseInt($summaryData.data('total-cost')),
        total_cost_ex_hq:   parseInt($summaryData.data('total-cost-ex-hq')),
        gross_profit:       parseInt($summaryData.data('gross-profit')),
        gross_profit_ex_hq: parseInt($summaryData.data('gross-profit-ex-hq')),
    };

    // 数値をカンマ区切りにフォーマット
    function formatNumber(num) {
        return '¥' + num.toLocaleString();
    }

    // 表示を更新
    function updateSummary(includeHq) {
        const cost   = includeHq ? summary.total_cost : summary.total_cost_ex_hq;
        const profit = includeHq ? summary.gross_profit : summary.gross_profit_ex_hq;

        $('#total_cost').text(formatNumber(cost));
        $('#gross_profit')
            .text(formatNumber(profit))
            .removeClass('text-green-600 text-red-500')
            .addClass(profit >= 0 ? 'text-green-600' : 'text-red-500');

        // トグルボタンのスタイル切り替え
        if (includeHq) {
            $('#toggle_include_hq').addClass('bg-theme-main text-white').removeClass('bg-white text-gray-500');
            $('#toggle_exclude_hq').addClass('bg-white text-gray-500').removeClass('bg-theme-main text-white');
        } else {
            $('#toggle_exclude_hq').addClass('bg-theme-main text-white').removeClass('bg-white text-gray-500');
            $('#toggle_include_hq').addClass('bg-white text-gray-500').removeClass('bg-theme-main text-white');
        }
    }

    $('#toggle_include_hq').on('click', function () {
        updateSummary(true);
    });

    $('#toggle_exclude_hq').on('click', function () {
        updateSummary(false);
    });
});