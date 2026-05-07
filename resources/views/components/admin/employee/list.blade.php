<div class="disable_scrollbar flex flex-grow overflow-scroll">
    <div class="employee_list bg-white overflow-x-auto overflow-y-auto border border-gray-600">
        <table id="filter_table" class="text-xs" data-search-url="/employee" data-scroll-target=".employee_list">
            <thead>
                <tr class="text-left text-white bg-black whitespace-nowrap sticky top-0 h-7 z-10">
                    <th class="font-thin py-1 px-2 text-center">操作</th>
                    <th class="font-thin py-1 px-2 text-center">ステータス</th>
                    <th class="font-thin py-1 px-2 text-center">営業所</th>
                    <th class="font-thin py-1 px-2 text-center">従業員番号</th>
                    <th class="font-thin py-1 px-2 text-center">氏名</th>
                    <th class="font-thin py-1 px-2 text-center">入社日</th>
                    <th class="font-thin py-1 px-2 text-center">勤続年数</th>
                    <th class="font-thin py-1 px-2 text-center">次回付与</th>
                    <th class="font-thin py-1 px-2 text-center">使用日数リセット</th>
                    <th class="font-thin py-1 px-2 text-center">付与区分</th>
                    <th class="font-thin py-1 px-2 text-center">週所定労働日数</th>
                    <th class="font-thin py-1 px-2 text-center">繰越保有日数</th>
                    <th class="font-thin py-1 px-2 text-center">当年保有日数</th>
                    <th class="font-thin py-1 px-2 text-center">総保有日数</th>
                    <th class="font-thin py-1 px-2 text-center">使用日数</th>
                    <th class="font-thin py-1 px-2 text-center">残日数</th>
                    <th class="font-thin py-1 px-2 text-center">繰越義務日数</th>
                    <th class="font-thin py-1 px-2 text-center">当年義務日数</th>
                    <th class="font-thin py-1 px-2 text-center">総義務日数</th>
                    <th class="font-thin py-1 px-2 text-center">義務残日数</th>
                    <th class="font-thin py-1 px-2 text-center">義務期限</th>
                </tr>
                <tr class="filter-row sticky top-[28px] bg-white z-10">
                    <th></th>
                    <x-filter.select-boolean id="filter_is_active" name="filter_is_active" label1="有効" label0="無効" :disabled="!auth()->user()->can('admin_check')" />
                    <x-filter.select id="filter_base_id" name="filter_base_id" :selectItems="$bases" optionValue="base_id" optionText="base_name" :disabled="!auth()->user()->can('admin_check')" />
                    <x-filter.input type="tel" id="filter_employee_no" name="filter_employee_no" />
                    <x-filter.input type="tel" id="filter_user_name" name="filter_user_name" />
                    <x-filter.date-period type="date" fromId="filter_hire_date_from" fromName="filter_hire_date_from" toId="filter_hire_date_to" toName="filter_hire_date_to" />
                    <x-filter.input type="text" id="filter_service_years" name="filter_service_years" />
                    <x-filter.input type="month" id="filter_next_grant_year_month" name="filter_next_grant_year_month" />
                    <x-filter.input type="month" id="filter_used_days_reset_year_month" name="filter_used_days_reset_year_month" />
                    <x-filter.select id="filter_grant_type" name="filter_grant_type" :selectItems="$grantTypes" optionValue="value" optionText="label" />
                    <x-filter.input type="text" id="filter_work_days_per_week" name="filter_work_days_per_week" />
                    <x-filter.input type="tel" id="filter_carried_over_days" name="filter_carried_over_days" />
                    <x-filter.input type="tel" id="filter_granted_days" name="filter_granted_days" />
                    <x-filter.input type="tel" id="filter_total_days" name="filter_total_days" />
                    <x-filter.input type="tel" id="filter_used_days" name="filter_used_days" />
                    <x-filter.input type="tel" id="filter_remaining_days" name="filter_remaining_days" />
                    <x-filter.input type="tel" id="filter_carried_over_required_days" name="filter_carried_over_required_days" />
                    <x-filter.input type="tel" id="filter_granted_required_days" name="filter_granted_required_days" />
                    <x-filter.input type="tel" id="filter_total_required_days" name="filter_total_required_days" />
                    <x-filter.input type="tel" id="filter_remaining_required_days" name="filter_remaining_required_days" />
                    <x-filter.input type="date" id="filter_required_deadline" name="filter_required_deadline" />
                </tr>
            </thead>
            <tbody class="bg-white">
                @foreach($employees as $employee)
                    <tr class="text-left cursor-default whitespace-nowrap @if(!$employee->is_active) bg-common-disabled @endif">
                        <td class="py-1 px-2 border">
                            <div class="flex flex-row gap-5">
                                <a href="{{ route('employee_update.index', ['user_no' => $employee->user_no]) }}" class="btn bg-btn-enter text-white py-1 px-2">更新</a>
                            </div>
                        </td>
                        <td class="py-1 px-2 border text-center">
                            <x-list.status :value="$employee->is_active" label1="有効" label0="無効" />
                        </td>
                        <td class="py-1 px-2 border">{{ $employee->base?->base_name }}</td>
                        <td class="py-1 px-2 border text-center">{{ $employee->employee_no }}</td>
                        <td class="py-1 px-2 border">
                            <div class="flex items-center gap-1">
                                <img class="profile_image_normal image_fade_in_modal_open flex-shrink-0" src="{{ asset('storage/profile_images/'.$employee->profile_image_file_name) }}">
                                {{ $employee->user_name }}
                            </div>
                        </td>
                        <td class="py-1 px-2 border text-center">{{ CarbonImmutable::parse($employee->hire_date)->isoFormat('YYYY年MM月DD日') }}</td>
                        <td class="py-1 px-2 border text-center">{{ $employee->service_years }}</td>
                        <td class="py-1 px-2 border text-center">
                            {{ $employee->next_grant_year_month ? CarbonImmutable::createFromFormat('Ym', $employee->next_grant_year_month)->isoFormat('YYYY年MM月') : '' }}
                        </td>
                        <td class="py-1 px-2 border text-center">
                            {{ $employee->used_days_reset_year_month ? CarbonImmutable::createFromFormat('Ym', $employee->used_days_reset_year_month)->isoFormat('YYYY年MM月') : '' }}
                        </td>
                        <td class="py-1 px-2 border text-center">{{ $employee->grant_type->label() }}</td>
                        <td class="py-1 px-2 border">{{ $employee->work_days_per_week }}</td>
                        <td class="py-1 px-2 border text-right">{{ number_format($employee->carried_over_days, 1) }}</td>
                        <td class="py-1 px-2 border text-right">{{ number_format($employee->granted_days, 1) }}</td>
                        <td class="py-1 px-2 border text-right">{{ number_format($employee->total_days, 1) }}</td>
                        <td class="py-1 px-2 border text-right">{{ number_format($employee->used_days, 1) }}</td>
                        <td class="py-1 px-2 border text-right">{{ number_format($employee->remaining_days, 1) }}</td>
                        <td class="py-1 px-2 border text-right">{{ number_format($employee->carried_over_required_days, 1) }}</td>
                        <td class="py-1 px-2 border text-right">{{ number_format($employee->granted_required_days, 1) }}</td>
                        <td class="py-1 px-2 border text-right">{{ number_format($employee->total_required_days, 1) }}</td>
                        <td class="py-1 px-2 border text-right">{{ number_format($employee->remaining_required_days, 1) }}</td>
                        <td class="py-1 px-2 border text-center">
                            @if($employee->required_deadline)
                                {{ CarbonImmutable::parse($employee->required_deadline)->isoFormat('YYYY年MM月DD日') }}
                            @endif
                        </td>
                @endforeach
            </tbody>
        </table>
    </div>
</div>