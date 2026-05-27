tippy('.tippy_base_aliases', {
    content(reference) {
        const aliases = reference.getAttribute('data-aliases');
        if (!aliases) return 'エイリアスなし';
        return aliases.split(',').map((name, i) =>
            `<div style="${i > 0 ? 'border-top: 2px solid rgba(255,255,255,0.5); padding-top: 3px; margin-top: 3px;' : ''}">${name}</div>`
        ).join('');
    },
    duration: 500,
    maxWidth: 'none',
    allowHTML: true,
    placement: 'right',
    theme: 'tippy_main_theme',
});

// ダウンロードURLを動的に生成
function buildMonthlyDownloadUrl(baseUrl) {
    const startId = $('#modal_start_fiscal_year_id').val();
    const endId   = $('#modal_end_fiscal_year_id').val();
    return `${baseUrl}?start_fiscal_year_id=${startId}&end_fiscal_year_id=${endId}`;
}

$('#btn_monthly_download_by_client').on('click', function (e) {
    e.preventDefault();
    const baseUrl = $('#monthly_financial_download_modal').data('url-client');
    location.href = buildMonthlyDownloadUrl(baseUrl);
    //$('#monthly_financial_download_modal').addClass('hidden');
});

$('#btn_monthly_download_by_alias').on('click', function (e) {
    e.preventDefault();
    const baseUrl = $('#monthly_financial_download_modal').data('url-alias');
    location.href = buildMonthlyDownloadUrl(baseUrl);
    //$('#monthly_financial_download_modal').addClass('hidden');
});