<div class="disable_scrollbar flex flex-grow overflow-scroll">
    <div class="import_history_list bg-white overflow-x-auto overflow-y-auto border border-gray-600">
        <table class="text-xs">
            <thead>
                <tr class="text-left text-white bg-black whitespace-nowrap sticky top-0">
                    <th class="font-thin py-1 px-2 text-center">取込日</th>
                    <th class="font-thin py-1 px-2 text-center">取込時間</th>
                    <th class="font-thin py-1 px-2 text-center">従業員データファイル名</th>
                    <th class="font-thin py-1 px-2 text-center">有給データファイル名</th>
                    <th class="font-thin py-1 px-2 text-center">エラーファイル名</th>
                    <th class="font-thin py-1 px-2 text-center">メッセージ</th>
                </tr>
            </thead>
            <tbody class="bg-white">
                @foreach($importHistories as $import_history)
                    <tr class="text-left cursor-default whitespace-nowrap hover:bg-theme-sub group @if($import_history->message) bg-pink-200 @endif">
                        <td class="py-1 px-2 border">{{ CarbonImmutable::parse($import_history->created_at)->isoFormat('YYYY年MM月DD日(ddd)') }}</td>
                        <td class="py-1 px-2 border">{{ CarbonImmutable::parse($import_history->created_at)->isoFormat('HH時mm分ss秒') }}</td>
                        <td class="py-1 px-2 border text-center">{{ $import_history->import_employee_original_file_name }}</td>
                        <td class="py-1 px-2 border text-center">{{ $import_history->import_paid_leave_original_file_name }}</td>
                        <td class="py-1 px-2 border">
                            @if(!is_null($import_history->error_file_name))
                                <a href="{{ route('error_file_download.download', ['filename' => $import_history->error_file_name]) }}" class="text-center text-blue-500"><i class="las la-cloud-download-alt mr-1 la-lg"></i>ダウンロード</a>
                            @endif
                        </td>
                        <td class="py-1 px-2 border">{!! nl2br(e($import_history->message)) !!}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>