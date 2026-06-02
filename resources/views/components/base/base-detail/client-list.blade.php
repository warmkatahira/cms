<div class="bg-white rounded-2xl border border-gray-200 w-6/12 shadow-sm">
    <button id="toggle_clients" class="w-full flex items-center justify-between p-6 text-left">
        <p class="text-sm font-semibold text-gray-600">顧客情報</p>
        <i id="toggle_clients_icon" class="las la-angle-down text-gray-400 transition-transform"></i>
    </button>
    <div id="clients_body" class="px-6 pb-6">
        @if($clients->isEmpty())
            <p class="text-sm text-gray-400">この営業所に紐付く顧客はいません。</p>
        @else
            <div class="flex flex-wrap gap-2">
                @foreach($clients as $client_id => $aliases)
                    @php
                        $client = $aliases->first()->client;
                        $tip = $aliases->map(function ($alias) {
                            $users = $alias->users->isNotEmpty()
                                ? $alias->users->map(fn($u) => $u->user_name)->join('・')
                                : '設定なし';
                            return e($alias->client_alias_name) . '【' . e($users) . '】';
                        })->join('<br>');
                    @endphp
                    <span
                        class="client_chip inline-flex items-center px-3 py-1.5 rounded-lg text-xs bg-badge-normal cursor-default hover:bg-gray-200 transition-colors"
                        data-tippy-content="{{ $tip }}">
                        <i class="las la-building mr-1"></i>
                        {{ $client->client_name ?? $client_id }}
                        <span class="ml-1 text-gray-400">（{{ $aliases->count() }}）</span>
                    </span>
                @endforeach
            </div>
        @endif
    </div>
</div>