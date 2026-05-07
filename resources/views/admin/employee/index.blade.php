<x-app-layout>
    <div class="flex flex-row my-3">
        <x-admin.employee.operation-div />
        <x-pagination :pages="$employees" />
    </div>
    <div class="flex flex-row gap-x-5 items-start">
        <x-admin.employee.list  :employees="$employees" :bases="$bases" :roles="$roles" :grantTypes="$grant_types" />
    </div>
</x-app-layout>
@vite(['resources/js/admin/employee/employee.js'])