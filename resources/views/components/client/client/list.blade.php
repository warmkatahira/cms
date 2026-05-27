<div class="disable_scrollbar flex flex-grow overflow-scroll">
    <div class="client_list bg-white overflow-x-auto overflow-y-auto border border-gray-600">
        <table id="filter_table" class="text-xs" data-search-url="/client" data-scroll-target=".client_list">
            <thead class="border-b border-gray-400">
                <tr class="text-left text-white bg-table-header whitespace-nowrap sticky top-0 h-7 z-10">
                    <th class="font-thin py-1 px-2 text-center">操作</th>
                    <th class="font-thin py-1 px-2 text-center">ステータス</th>
                    <th class="font-thin py-1 px-2 text-center">顧客名</th>
                    <th class="font-thin py-1 px-2 text-center">担当営業所</th>
                    <th class="font-thin py-1 px-2 text-center">最終更新者</th>
                    <th class="font-thin py-1 px-2 text-center">最終更新日時</th>
                </tr>
                <tr class="filter-row sticky top-[28px] bg-white z-10">
                    <th></th>
                    <x-filter.select-boolean id="filter_is_active" name="filter_is_active" label1="有効" label0="無効" />
                    <x-filter.input type="text" id="filter_client_name" name="filter_client_name" />
                    <x-filter.select id="filter_base_id" name="filter_base_id" :selectItems="$bases" optionValue="base_id" optionText="base_name" />
                    <x-filter.input type="text" id="filter_user_name" name="filter_user_name" />
                    <th></th>
                </tr>
            </thead>
            <tbody class="bg-white">
                @foreach($clients as $client)
                    <tr class="text-left cursor-default whitespace-nowrap hover:bg-table-hover group">
                        <td class="py-1 px-2 border-b border-gray-400">
                            <div class="flex flex-row gap-5">
                                <a href="{{ route('client_detail.index', ['client_id' => $client->client_id]) }}" class="btn rounded bg-btn-enter text-white py-1 px-2">詳細</a>
                            </div>
                        </td>
                        <td class="py-1 px-2 border-b border-gray-400 text-center">
                            <x-list.status :value="$client->is_active" label1="有効" label0="無効" />
                        </td>
                        <td class="py-1 px-5 border-b border-gray-400">
                            <div class="flex items-center gap-3">
                                <img class="client_image_normal image_fade_in_modal_open flex-shrink-0" src="{{ asset('storage/client_images/'.$client->client_image_file_name) }}">
                                {{ $client->client_name }}
                            </div>
                        </td>
                        <td class="py-1 px-2 border-b border-gray-400">
                            @php $bases = $client->clientAliases->groupBy('base_id'); @endphp
                            <div class="flex flex-wrap gap-1">
                                @foreach($bases as $baseId => $aliases)
                                    <span class="inline-flex items-center px-2 py-0.5 rounded bg-badge-normal text-xs tippy_base_aliases"
                                        data-aliases="{{ $aliases->map(fn($a) => $a->client_alias_name . ($a->users->isNotEmpty() ? '【' . $a->users->map(fn($u) => $u->user_name)->join('・') . '】' : ''))->join(',') }}">
                                        {{ $aliases->first()->base->short_base_name ?? $baseId }}
                                    </span>
                                @endforeach
                            </div>
                        </td>
                        <td class="py-1 px-5 border-b border-gray-400">
                            <div class="flex items-center gap-1">
                                <img class="profile_image_normal image_fade_in_modal_open flex-shrink-0" src="{{ asset('storage/profile_images/'.$client->user->profile_image_file_name) }}">
                                {{ $client->user->user_name }}
                            </div>
                        </td>
                        <td class="py-1 px-2 border-b border-gray-400 text-center">{{ CarbonImmutable::parse($client->updated_at)->isoFormat('YYYY年MM月DD日(ddd) HH時mm分ss秒') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>