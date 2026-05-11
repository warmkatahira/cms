<x-app-layout>
    <div class="flex flex-row my-3">
        <x-pagination :pages="$import_histories" />
    </div>
    <div class="flex flex-row gap-x-5 items-start">
        <x-admin.import-history.search route="import_history.index" />
        <x-admin.import-history.list :importHistories="$import_histories" />
    </div>
</x-app-layout>