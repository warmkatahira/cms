<x-app-layout>
    <div class="flex flex-row my-3">
        <x-base.base.operation-div />
        <x-pagination :pages="$bases" />
    </div>
    <div class="flex flex-row gap-x-5 items-start">
        <x-base.base.list :bases="$bases" />
    </div>
</x-app-layout>
@vite([
    'resources/js/base/base/base.js',
])