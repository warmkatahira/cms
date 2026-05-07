<div class="disable_scrollbar flex flex-grow overflow-scroll">
    <div class="working_hour_list bg-white overflow-x-auto overflow-y-auto border border-gray-600">
        <table class="text-xs">
            <thead>
                <tr class="text-left text-white bg-black whitespace-nowrap sticky top-0">
                    <th class="font-thin py-1 px-2 text-center">操作</th>
                    <th class="font-thin py-1 px-2 text-center">勤務区分</th>
                    <th class="font-thin py-1 px-2 text-center">勤務時間数</th>
                    <th class="font-thin py-1 px-2 text-center">適用従業員数</th>
                </tr>
            </thead>
            <tbody class="bg-white">
                @foreach($workingHours as $working_hour)
                    <tr class="text-left cursor-default whitespace-nowrap hover:bg-theme-sub group">
                        <td class="py-1 px-2 border">
                            <div class="flex flex-row gap-5">
                                <button type="button" class="btn working_hour_delete_enter bg-btn-cancel text-white py-1 px-2" data-working-hour-id="{{ $working_hour->working_hour_id }}">削除</button>
                            </div>
                        </td>
                        <td class="py-1 px-2 border text-center">{{ WorkingHourEnum::get_working_type_jp($working_hour->working_type) }}</td>
                        <td class="py-1 px-2 border text-right">{{ $working_hour->working_hour }}</td>
                        @if($workingType === WorkingHourEnum::WORKING_TYPE_DAILY)
                            <td class="py-1 px-2 border text-right">{{ $working_hour->getPaidLeaveRecord($working_hour->working_hour, $workingType, WorkingHourEnum::DAILY_WORKING_HOURS) }}</td>
                        @elseif($workingType === WorkingHourEnum::WORKING_TYPE_HALF)
                            <td class="py-1 px-2 border text-right">{{ $working_hour->getPaidLeaveRecord($working_hour->working_hour, $workingType, WorkingHourEnum::HALF_DAY_WORKING_HOURS) }}</td>
                        @endif
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
<form method="POST" action="{{ route('working_hour_delete.delete') }}" id="working_hour_delete_form" class="hidden">
    @csrf
    <input type="hidden" id="working_hour_id" name="working_hour_id">
</form>