<div class="disable_scrollbar flex flex-grow overflow-scroll">
    <div class="base_list bg-white overflow-x-auto overflow-y-auto border border-gray-600">
        <table id="filter_table" class="text-xs" data-search-url="/base" data-scroll-target=".base_list">
            <thead class="border-b border-gray-400">
                <tr class="text-left text-white bg-table-header whitespace-nowrap sticky top-0 h-7 z-10">
                    <th class="font-thin py-1 px-2 text-center">操作</th>
                    <th class="font-thin py-1 px-2 text-center">営業所名</th>
                    <th class="font-thin py-1 px-2 text-center">略称営業所名</th>
                    <th class="font-thin py-1 px-2 text-center">顧客数</th>
                    <th class="font-thin py-1 px-2 text-center">エイリアス数</th>
                </tr>
                <tr class="filter-row sticky top-[28px] bg-white z-10">
                    <th></th>
                    <x-filter.select id="filter_base_id" name="filter_base_id" :selectItems="$bases" optionValue="base_id" optionText="base_name" />
                    <x-filter.input type="text" id="filter_short_base_name" name="filter_short_base_name" />
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="bg-white">
                @foreach($bases as $base)
                    <tr class="text-left cursor-default whitespace-nowrap hover:bg-table-hover group">
                        <td class="py-1 px-5 border-b border-gray-400">
                            <div class="flex flex-row gap-5">
                                <a href="{{ route('base_detail.index', ['base_id' => $base->base_id]) }}" class="btn rounded bg-btn-enter text-white py-1 px-2">詳細</a>
                            </div>
                        </td>
                        <td class="py-1 px-5 border-b border-gray-400 text-left">{{ $base->base_name }}</td>
                        <td class="py-1 px-5 border-b border-gray-400 text-left">{{ $base->short_base_name }}</td>
                        <td class="py-1 px-5 border-b border-gray-400 text-right">{{ number_format($base->client_count) }}</td>
                        <td class="py-1 px-5 border-b border-gray-400 text-right">{{ number_format($base->alias_count) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>