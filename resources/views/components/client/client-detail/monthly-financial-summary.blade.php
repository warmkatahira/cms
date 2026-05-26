<div class="bg-white rounded-2xl border border-gray-200 shadow-sm w-5/12 min-w-0">
    <button id="toggle_monthly_table" class="w-full flex items-center justify-between p-6 text-left">
        <p id="label_monthly_title" class="text-sm font-semibold text-gray-600">月別収支サマリー</p>
        <i id="toggle_monthly_table_icon" class="las la-angle-down text-gray-400 transition-transform"></i>
    </button>
    <div id="monthly_table_body" class="hidden px-6 pb-6">
        <div class="overflow-x-auto">
            <table class="w-full text-xs text-right">
                <thead>
                    <tr class="text-gray-400 border-b border-gray-100">
                        <th class="text-left pb-2 font-normal">月</th>
                        <th class="pb-2 font-normal">売上合計</th>
                        <th class="pb-2 font-normal">経費合計</th>
                        <th class="pb-2 font-normal" id="th_hq">うち本社管理費</th>
                        <th class="pb-2 font-normal">収支</th>
                    </tr>
                </thead>
                <tbody id="monthly_table_rows">
                    @foreach($monthlyData as $i => $row)
                        <tr class="border-b border-gray-50 hover:bg-gray-50">
                            <td class="py-2 text-left text-gray-600">{{ $row['month'] }}</td>
                            <td class="py-2 text-gray-700" id="monthly_sales_{{ $i }}">¥{{ number_format($row['total_sales']) }}</td>
                            <td class="py-2 text-gray-700" id="monthly_cost_{{ $i }}">¥{{ number_format($row['total_cost']) }}</td>
                            <td class="py-2 text-gray-400" id="monthly_hq_{{ $i }}">¥{{ number_format($row['cost_hq']) }}</td>
                            <td class="py-2 font-medium {{ $row['gross_profit'] >= 0 ? 'text-green-600' : 'text-red-500' }}" id="monthly_profit_{{ $i }}">
                                ¥{{ number_format($row['gross_profit']) }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr class="border-t border-gray-200 font-medium">
                        <td class="pt-2 text-left text-gray-600">合計</td>
                        <td class="pt-2 text-gray-700" id="monthly_sales_total">¥{{ number_format($summary['total_sales']) }}</td>
                        <td class="pt-2 text-gray-700" id="monthly_cost_total">¥{{ number_format($summary['total_cost']) }}</td>
                        <td class="pt-2 text-gray-400" id="monthly_hq_total">¥{{ number_format($summary['total_cost_hq']) }}</td>
                        <td class="pt-2" id="monthly_profit_total">¥{{ number_format($summary['gross_profit']) }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>