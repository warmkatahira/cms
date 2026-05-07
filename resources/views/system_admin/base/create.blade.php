<x-app-layout>
    <x-page-back :url="route('base.index')" />
    <div class="flex flex-row gap-10 mt-5">
        @include('components.system-admin.base.form', [
            'form_mode' => 'create',
        ])
    </div>
</x-app-layout>
@vite(['resources/js/system_admin/base/base.js'])