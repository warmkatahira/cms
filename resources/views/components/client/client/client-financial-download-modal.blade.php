{{-- 収支データダウンロードモーダル --}}
<div id="monthly_financial_download_modal"
    data-url-client="{{ route('client_financial_download.download_by_client') }}"
    data-url-alias="{{ route('client_financial_download.download_by_alias') }}"
    class="modal_overlay fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
    style="display:none;">
    <div class="bg-white rounded-2xl p-6 w-96 shadow-xl">
        <p class="text-sm font-semibold text-gray-600 mb-4">収支データダウンロード</p>
        <div class="space-y-3">
            <div>
                <label class="text-xs text-gray-500">開始期</label>
                <select id="modal_start_fiscal_year_id" class="w-full border border-gray-200 rounded-lg text-sm p-2 mt-1">
                    @foreach($fiscalYears as $fy)
                        <option value="{{ $fy->fiscal_year_id }}">第{{ $fy->period }}期（{{ CarbonImmutable::parse($fy->start_date)->format('Y/m') }}〜{{ CarbonImmutable::parse($fy->end_date)->format('Y/m') }}）</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="text-xs text-gray-500">終了期</label>
                <select id="modal_end_fiscal_year_id" class="w-full border border-gray-200 rounded-lg text-sm p-2 mt-1">
                    @foreach($fiscalYears as $fy)
                        <option value="{{ $fy->fiscal_year_id }}">第{{ $fy->period }}期（{{ CarbonImmutable::parse($fy->start_date)->format('Y/m') }}〜{{ CarbonImmutable::parse($fy->end_date)->format('Y/m') }}）</option>
                    @endforeach
                </select>
            </div>
        </div>
        <div class="flex gap-2 mt-6">
            <a id="btn_monthly_download_by_client" href="#" class="btn rounded bg-btn-enter text-white py-1 px-3 text-xs">顧客単位</a>
            <a id="btn_monthly_download_by_alias" href="#" class="btn rounded bg-btn-enter text-white py-1 px-3 text-xs">エイリアス単位</a>
            <button data-modal-close class="btn rounded bg-btn-cancel ml-auto text-xs text-white px-3">キャンセル</button>
        </div>
    </div>
</div>

{{-- トリガーボタン --}}
<button id="open_monthly_financial_download_modal" class="btn rounded bg-btn-enter text-white py-1 px-3 text-xs">月別財務データ</button>