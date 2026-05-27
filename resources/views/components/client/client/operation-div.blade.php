<div class="flex">
    <div id="dropdown" class="dropdown">
        <button id="dropdown_btn" class="dropdown_btn"><i class="las la-bars la-lg mr-1"></i>メニュー</button>
        <div class="dropdown-content" id="dropdown-content">
            <a href="{{ route('client_download.download_by_client') }}" class="dropdown-content-element"><i class="las la-download la-lg mr-1"></i>顧客データ（顧客単位）</a>
            <a href="{{ route('client_download.download_by_alias') }}" class="dropdown-content-element"><i class="las la-download la-lg mr-1"></i>顧客データ（エイリアス単位）</a>
            <button data-modal-open="#monthly_financial_download_modal" class="dropdown-content-element"><i class="las la-download la-lg mr-1"></i>収支データ</button>
        </div>
    </div>
</div>