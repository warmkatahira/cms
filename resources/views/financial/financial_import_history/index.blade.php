<x-app-layout>
    <div class="flex flex-row my-3">
        <x-pagination :pages="$financial_import_histories" />
    </div>
    <div class="flex flex-row gap-x-5 items-start">
        <x-financial.financial-import-history.search route="import_history.index" />
        <x-financial.financial-import-history.list :financialImportHistories="$financial_import_histories" />
    </div>
</x-app-layout>