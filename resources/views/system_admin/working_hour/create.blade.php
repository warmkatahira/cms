<x-app-layout>
    <x-page-back :url="route('working_hour.index')" />
    <div class="flex flex-row gap-10 mt-5">
        @include('components.system-admin.working_hour.form', [
        ])
    </div>
</x-app-layout>
@vite(['resources/js/system_admin/working_hour/working_hour.js'])