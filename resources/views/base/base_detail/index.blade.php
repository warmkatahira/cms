<x-app-layout>
    <div class="w-full space-y-3">
        <x-page-back />
        {{-- 期セレクタ --}}
        <x-base.base-detail.fiscal-year-dropdown :currentFiscalYear="$currentFiscalYear" :fiscalYears="$fiscalYears" />
        <div class="flex gap-5 items-stretch w-full">
            {{-- 営業所情報 --}}
            <x-base.base-detail.base-info :base="$base" />
            {{-- 収支サマリー --}}
            <x-common.financial-summary :summary="$summary" />
        </div>
        {{-- ページメタ・サマリーデータ（JS用・非表示） --}}
        <x-base.base-detail.page-meta :base="$base" :currentFiscalYear="$currentFiscalYear" :summary="$summary" :monthlyData="$monthlyData" :lastYearMonthlyData="$lastYearMonthlyData" />
        <div class="flex gap-5 items-start w-full">
            {{-- 月別収支サマリー --}}
            <x-common.monthly-financial-summary :monthlyData="$monthlyData" :summary="$summary" />
            {{-- 月別収支グラフ --}}
            <x-common.monthly-financial-chart />
        </div>
    </div>
</x-app-layout>
@vite([
    'resources/js/base/base_detail/chart.js',
])