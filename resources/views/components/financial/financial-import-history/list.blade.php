<div class="disable_scrollbar flex flex-grow overflow-scroll">
    <div class="financial_import_history_list bg-white overflow-x-auto overflow-y-auto border border-gray-600">
        <table id="filter_table" class="text-xs" data-search-url="/financial_import_history" data-scroll-target=".financial_import_history_list">
            <thead>
                <tr class="text-left text-white bg-black whitespace-nowrap sticky top-0 h-7 z-10">
                    <th class="font-thin py-1 px-2 text-center">取込日</th>
                    <th class="font-thin py-1 px-2 text-center">取込時間</th>
                    <th class="font-thin py-1 px-2 text-center">収支データファイル名</th>
                    <th class="font-thin py-1 px-2 text-center">エラーファイル名</th>
                    <th class="font-thin py-1 px-2 text-center">メッセージ</th>
                </tr>
                <tr class="filter-row sticky top-[28px] bg-white z-10">
                    <x-filter.date-period type="date" fromId="filter_import_date_from" fromName="filter_import_date_from" toId="filter_import_date_to" toName="filter_import_date_to" />
                    <x-filter.input type="tel" id="filter_import_time" name="filter_import_time" />
                    <x-filter.input type="text" id="filter_import_original_file_name" name="filter_import_original_file_name" />
                    <x-filter.input type="text" id="filter_error_file_name" name="filter_error_file_name" />
                    <x-filter.input type="text" id="filter_message" name="filter_error_message" />
                </tr>
            </thead>
            <tbody class="bg-white">
                @foreach($financialImportHistories as $financial_import_history)
                    <tr class="text-left cursor-default whitespace-nowrap hover:bg-table-hover group @if($financial_import_history->message) bg-pink-200 @endif">
                        <td class="py-1 px-2 border text-center">{{ CarbonImmutable::parse($financial_import_history->created_at)->isoFormat('YYYY年MM月DD日(ddd)') }}</td>
                        <td class="py-1 px-2 border text-center">{{ CarbonImmutable::parse($financial_import_history->created_at)->isoFormat('HH時mm分ss秒') }}</td>
                        <td class="py-1 px-2 border">{{ $financial_import_history->import_original_file_name }}</td>
                        <td class="py-1 px-2 border">
                            @if(!is_null($financial_import_history->error_file_name))
                                <a href="{{ route('error_file_download.download', ['filename' => $financial_import_history->error_file_name]) }}" class="text-center text-blue-500"><i class="las la-cloud-download-alt mr-1 la-lg"></i>ダウンロード</a>
                            @endif
                        </td>
                        <td class="py-1 px-2 border">{!! nl2br(e($financial_import_history->message)) !!}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>