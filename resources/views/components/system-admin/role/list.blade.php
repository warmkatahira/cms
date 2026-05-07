<div class="disable_scrollbar flex flex-grow overflow-scroll">
    <div class="role_list bg-white overflow-x-auto overflow-y-auto border border-gray-600">
        <table class="text-xs">
            <thead>
                <tr class="text-left text-white bg-black whitespace-nowrap sticky top-0">
                    <th class="font-thin py-1 px-2 text-center">権限名</th>
                    <th class="font-thin py-1 px-2 text-center">並び順</th>
                    <th class="font-thin py-1 px-2 text-center">有効従業員数</th>
                    <th class="font-thin py-1 px-2 text-center">最終更新日時</th>
                </tr>
            </thead>
            <tbody class="bg-white">
                @foreach($roles as $role)
                    <tr class="text-left cursor-default whitespace-nowrap hover:bg-theme-sub group">
                        <td class="py-1 px-2 border">{{ $role->role_name }}</td>
                        <td class="py-1 px-2 border text-right">{{ $role->sort_order }}</td>
                        <td class="py-1 px-2 border text-right">{{ number_format($role->active_users_count) }}</td>
                        <td class="py-1 px-2 border">{{ CarbonImmutable::parse($role->updated_at)->isoFormat('Y年MM月DD日(ddd) HH:mm:ss').'('.CarbonImmutable::parse($role->updated_at)->diffForHumans().')' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>