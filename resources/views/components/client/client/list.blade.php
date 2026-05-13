<div class="disable_scrollbar flex flex-grow overflow-scroll">
    <div class="client_list bg-white overflow-x-auto overflow-y-auto border border-gray-600">
        <table id="filter_table" class="text-xs" data-search-url="/client" data-scroll-target=".client_list">
            <thead class="border-b border-gray-400">
                <tr class="text-left text-white bg-table-header whitespace-nowrap sticky top-0 h-7 z-10">
                    <th class="font-thin py-1 px-2 text-center">ステータス</th>
                    <th class="font-thin py-1 px-2 text-center">顧客名</th>
                    <th class="font-thin py-1 px-2 text-center">紐付け荷主数</th>
                    <th class="font-thin py-1 px-2 text-center">最終更新者</th>
                    <th class="font-thin py-1 px-2 text-center">最終更新日時</th>
                </tr>
                <tr class="filter-row sticky top-[28px] bg-white z-10">
                    <x-filter.select-boolean id="filter_is_active" name="filter_is_active" label1="有効" label0="無効" />
                    <x-filter.input type="text" id="filter_client_name" name="filter_client_name" />
                    <x-filter.input type="tel" id="filter_client_alias_count" name="filter_client_alias_count" />
                    <x-filter.input type="text" id="filter_user_name" name="filter_user_name" />
                    <x-filter.input type="text" id="filter_updated_at" name="filter_updated_at" />
                </tr>
            </thead>
            <tbody class="bg-white">
                @foreach($clients as $client)
                    <tr class="text-left cursor-default whitespace-nowrap hover:bg-table-hover group">
                        <td class="py-1 px-2 border-b border-gray-400 text-center">
                            <x-list.status :value="$client->is_active" label1="有効" label0="無効" />
                        </td>
                        <td class="py-1 px-2 border-b border-gray-400">
                            <div class="flex items-center gap-3">
                                <img class="client_image_normal image_fade_in_modal_open flex-shrink-0" src="{{ asset('storage/client_images/'.$client->client_image_file_name) }}">
                                {{ $client->client_name }}
                            </div>
                        </td>
                        <td class="py-1 px-2 border-b border-gray-400 text-center">
                            <span class="inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-full bg-gray-300 text-gray-600 font-medium">
                                {{ number_format($client->client_aliases_count) }}
                            </span>
                        </td>
                        <td class="py-1 px-2 border-b border-gray-400">
                            <div class="flex items-center gap-1">
                                <img class="profile_image_normal image_fade_in_modal_open flex-shrink-0" src="{{ asset('storage/profile_images/'.$client->user->profile_image_file_name) }}">
                                {{ $client->user->user_name }}
                            </div>
                        </td>
                        <td class="py-1 px-2 border-b border-gray-400 text-center">{{ CarbonImmutable::parse($client->created_at)->isoFormat('YYYY年MM月DD日(ddd) HH時mm分ss秒') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>