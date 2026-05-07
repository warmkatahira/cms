<x-app-layout>
    <div class="flex flex-row my-3">
        <x-system-admin.working_hour.operation-div />
    </div>
    <div class="flex flex-row gap-x-5 items-start">
        <x-system-admin.working_hour.list :workingHours="$daily_working_hours" :workingType="WorkingHourEnum::WORKING_TYPE_DAILY" />
        <x-system-admin.working_hour.list :workingHours="$half_day_working_hours" :workingType="WorkingHourEnum::WORKING_TYPE_HALF" />
    </div>
</x-app-layout>
@vite(['resources/js/system_admin/working_hour/working_hour.js'])