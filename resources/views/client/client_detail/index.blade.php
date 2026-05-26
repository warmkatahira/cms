<x-app-layout>
    <div class="w-full space-y-3">
        {{-- 期セレクタ（カスタムドロップダウン） --}}
        <x-client.client-detail.fiscal-year-dropdown :currentFiscalYear="$currentFiscalYear" :fiscalYears="$fiscalYears" />
        <div class="flex gap-5 items-stretch w-full">
            {{-- 顧客情報 --}}
            <x-client.client-detail.client-info :client="$client" />
            {{-- 収支サマリー --}}
            <x-client.client-detail.financial-summary :summary="$summary" />
        </div>
        {{-- ページメタ・サマリーデータ --}}
        <x-client.client-detail.page-meta :client="$client" :currentFiscalYear="$currentFiscalYear" :summary="$summary" :monthlyData="$monthlyData" :lastYearMonthlyData="$lastYearMonthlyData" />
        <div class="flex gap-5 items-start w-full">
            {{-- 月別収支サマリー --}}
            <x-client.client-detail.monthly-financial-summary :monthlyData="$monthlyData" :summary="$summary" />
            {{-- 月次収支グラフ --}}
            <x-client.client-detail.monthly-financial-chart />
        </div>
        <div class="flex gap-5 items-start w-full">
            {{-- エイリアス情報 --}}
            <x-client.client-detail.client-alias :client="$client" />
        </div>
    </div>
</x-app-layout>
@vite([
    'resources/js/client/client_detail/client_detail.js',
    'resources/js/client/client_detail/chart.js',
])