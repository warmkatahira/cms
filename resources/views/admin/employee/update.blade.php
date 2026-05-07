<x-app-layout>
    <x-page-back :url="session('back_url_1')" />
    <div class="flex flex-row gap-10 mt-5">
        @include('components.admin.employee.form', [
            'form_mode' => 'update',
            'employee' => $employee,
        ])
    </div>
</x-app-layout>
@vite(['resources/js/admin/employee/employee.js'])