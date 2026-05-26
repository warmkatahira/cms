<div id="page_meta"
    data-client-id="{{ $client->client_id }}"
    data-current-period="{{ $currentFiscalYear->period }}"
></div>
<div id="summary_data"
    data-total-sales="{{ $summary['total_sales'] }}"
    data-total-cost="{{ $summary['total_cost'] }}"
    data-total-cost-ex-hq="{{ $summary['total_cost_ex_hq'] }}"
    data-total-cost-hq="{{ $summary['total_cost_hq'] }}"
    data-gross-profit="{{ $summary['gross_profit'] }}"
    data-gross-profit-ex-hq="{{ $summary['gross_profit_ex_hq'] }}"
></div>
{{-- 月次データをデータ属性で渡す --}}
<div id="monthly_data"
    data-monthly='{{ json_encode($monthlyData) }}'
    data-last-year-monthly='{{ json_encode($lastYearMonthlyData) }}'
></div>