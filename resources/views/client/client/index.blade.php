<x-app-layout>
    <div class="flex flex-row my-3">
        <x-client.client.operation-div />
        <x-pagination :pages="$clients" />
    </div>
    <div class="flex flex-row gap-x-5 items-start">
        <x-client.client.list :clients="$clients" :bases="$bases" />
    </div>
</x-app-layout>
@vite([
    'resources/js/client/client/client.js',
])