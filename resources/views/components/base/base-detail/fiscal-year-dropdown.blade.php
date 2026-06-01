<div class="flex justify-end">
    <div class="relative" id="fiscal_year_dropdown">
        {{-- トリガーボタン --}}
        <button id="fiscal_year_trigger"
            class="btn flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm text-gray-700 hover:border-gray-300 hover:shadow transition-all">
            <i class="las la-calendar-alt text-theme-main la-lg"></i>
            <span id="fiscal_year_period_label" class="font-semibold">第{{ $currentFiscalYear->period }}期</span>
            <span id="fiscal_year_range_label" class="text-gray-400">（{{ $currentFiscalYear->start_date->format('Y/m') }}〜{{ $currentFiscalYear->end_date->format('Y/m') }}）</span>
            <i id="fiscal_year_chevron" class="las la-angle-down text-gray-400 text-xs transition-transform ml-1"></i>
        </button>
        {{-- ドロップダウンメニュー --}}
        <div id="fiscal_year_menu"
            class="hidden absolute z-50 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden right-0">
            <div class="px-3 py-2 border-b border-gray-100">
                <p class="text-xs text-gray-400">期を選択</p>
            </div>
            <div class="max-h-64 overflow-y-auto py-1">
                @foreach($fiscalYears as $fy)
                    <button
                        class="fiscal_year_option w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors {{ $fy->period === $currentFiscalYear->period ? 'text-theme-main font-semibold bg-theme-main/5' : 'text-gray-700' }}"
                        data-period="{{ $fy->period }}"
                        data-start="{{ $fy->start_date->format('Y-m-d') }}"
                        data-end="{{ $fy->end_date->format('Y-m-d') }}">
                        <span>第{{ $fy->period }}期</span>
                        <span class="flex items-center gap-3">
                            <span class="text-xs {{ $fy->period === $currentFiscalYear->period ? 'text-theme-main' : 'text-gray-400' }}">
                                {{ $fy->start_date->format('Y/m') }}〜{{ $fy->end_date->format('Y/m') }}
                            </span>
                            <i class="las la-check text-theme-main"
                            style="display: {{ $fy->period === $currentFiscalYear->period ? 'inline' : 'none' }}"></i>
                        </span>
                    </button>
                @endforeach
            </div>
        </div>
    </div>
</div>