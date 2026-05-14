<x-app-layout>
    <div class="flex flex-row my-3">
        <x-pagination :pages="$clients" />
    </div>
    <div class="flex flex-row gap-x-5 items-start">
        <x-client.client.list :clients="$clients" />
    </div>
</x-app-layout>
@vite([
    'resources/js/client/client/client.js',
])