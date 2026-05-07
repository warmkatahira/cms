<x-app-layout>
    <div class="flex flex-row my-3">
        <x-system-admin.user.operation-div />
        <x-pagination :pages="$users" />
    </div>
    <div class="flex flex-row gap-x-5 items-start">
        <x-system-admin.user.list :users="$users" :bases="$bases" :roles="$roles" />
    </div>
</x-app-layout>
@vite(['resources/js/system_admin/user/user.js'])