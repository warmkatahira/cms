<x-app-layout>
    <div>
        <div class="w-full max-w-2xl">
            <form method="POST" action="{{ route('file_import.import') }}" enctype="multipart/form-data" id="file_import_form">
                @csrf
                <div class="space-y-4">
                    <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</div>
                            <span class="text-sm font-semibold text-gray-700">従業員データ</span>
                        </div>
                        <input type="file" id="employee_file" name="employee_file" accept=".csv" class="hidden">
                        <div id="employee_file_area_1"
                            class="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                            <div class="flex flex-col items-center justify-center gap-2 text-gray-400 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span class="text-sm font-medium" id="employee_file_label_1">クリックまたはドラッグ＆ドロップ</span>
                                <span class="text-xs text-gray-300">.csv のみ対応</span>
                            </div>
                        </div>
                        @error('employee_file')
                            <p class="mt-2 text-xs text-red-500 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {{ $message }}
                            </p>
                        @enderror
                    </div>
                    <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</div>
                            <span class="text-sm font-semibold text-gray-700">有給データ</span>
                        </div>
                        <input type="file" id="paid_leave_file" name="paid_leave_file" accept=".csv" class="hidden">
                        <div id="paid_leave_file_area_2"
                            class="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                            <div class="flex flex-col items-center justify-center gap-2 text-gray-400 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span class="text-sm font-medium" id="paid_leave_file_label_2">クリックまたはドラッグ＆ドロップ</span>
                                <span class="text-xs text-gray-300">.csv のみ対応</span>
                            </div>
                        </div>
                        @error('paid_leave_file')
                            <p class="mt-2 text-xs text-red-500 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {{ $message }}
                            </p>
                        @enderror
                    </div>
                </div>
                <div class="mt-6 flex justify-end">
                    <button
                        type="button"
                        id="file_import_enter"
                        class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-8 py-3 rounded-xl shadow-sm transition-all duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        取り込み
                    </button>
                </div>

            </form>
        </div>
    </div>
</x-app-layout>

@vite([
    'resources/js/admin/file_import/file_import.js',
])