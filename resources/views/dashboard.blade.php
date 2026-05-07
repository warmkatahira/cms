<x-app-layout>
    {{-- @if(Auth::user()->role_id === RoleEnum::USER) --}}
        <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 md:hidden bg-white rounded-xl shadow-lg p-4">
                <p class="text-2xl font-bold text-gray-800 text-center">{{ Auth::user()->user_name }}<span class="text-base font-normal text-gray-400 pl-3">さん</span></p>
            </div>
            <div class="col-span-12 grid grid-cols-12 gap-3">
                <x-dashboard.info-div label="保有日数" :value="$employee->total_days" format="day" />
                <x-dashboard.info-div label="取得日数" :value="$employee->used_days" format="day" usedDays="true"  />
                <x-dashboard.info-div label="残日数" :value="$employee->remaining_days" format="day" />
            </diiv>
            <div class="col-span-12 grid grid-cols-12 gap-3">
                <x-dashboard.info-div label="義務の日数" :value="$employee->total_required_days" format="day" />
                <x-dashboard.info-div label="義務の残日数" :value="$employee->remaining_required_days" format="day" />
                <x-dashboard.info-div label="義務の期限" :value="$employee->required_deadline" format="date" />
            </diiv>
        </diiv>
    {{-- @endif --}}
</x-app-layout>