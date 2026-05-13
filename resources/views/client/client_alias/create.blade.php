<x-app-layout>
    <div class="w-full max-w-3xl">
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            @if(!empty($unregistered_aliases))
                <p class="text-sm text-gray-600 mb-6">以下の荷主名が顧客と紐付けされていません。紐付けを行ってください。</p>
            @else
                <p class="text-sm text-gray-600 mb-6">未登録の荷主名はありません。</p>
            @endif
            <form method="POST" action="{{ route('client_alias_create.create') }}" id="client_alias_create_form">
                @csrf
                <div class="space-y-4">
                    @foreach($unregistered_aliases as $index => $alias)
                        <div class="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                            <input type="hidden" name="aliases[{{ $index }}][base_id]" value="{{ $alias['base_id'] }}">
                            <input type="hidden" name="aliases[{{ $index }}][client_alias_name]" value="{{ $alias['client_alias_name'] }}">
                            {{-- 荷主名 --}}
                            <div class="flex-1">
                                <p class="text-xs text-gray-400 mb-0.5">荷主名</p>
                                <p class="text-sm font-medium text-gray-700">{{ $alias['client_alias_name'] }}</p>
                                <p class="text-xs text-gray-400 mt-0.5">{{ $baseMap[$alias['base_id']] ?? $alias['base_id'] }}</p>
                            </div>
                            {{-- 矢印 --}}
                            <div class="text-gray-300">
                                <i class="las la-arrow-right la-lg"></i>
                            </div>
                            {{-- 顧客選択 --}}
                            <div class="flex-1">
                                <p class="text-xs text-gray-400 mb-0.5">紐付ける顧客</p>
                                <select name="aliases[{{ $index }}][client_id]" class="select2 w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white">
                                    <option value="">選択してください</option>
                                    @foreach($clients as $client)
                                        <option value="{{ $client->client_id }}">{{ $client->client_name }}</option>
                                    @endforeach
                                </select>
                                @error("aliases.{$index}.client_id")
                                    <p class="mt-1 text-xs text-red-500">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                    @endforeach
                </div>
                <div class="mt-6 flex justify-end">
                    @if(!empty($unregistered_aliases))
                        <button
                            type="button"
                            id="client_alias_create_enter"
                            class="btn inline-flex items-center gap-2 bg-btn-enter text-white text-sm px-8 py-3 rounded-xl shadow-sm transition-all duration-150"
                        >
                            <i class="las la-save la-lg"></i>
                            登録
                        </button>
                    @endif
                </div>
            </form>
        </div>
    </div>
</x-app-layout>
@vite([
    'resources/js/client/client_alias/client_alias.js',
])