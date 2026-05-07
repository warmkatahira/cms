<div class="disable_scrollbar flex flex-grow overflow-scroll">
    <div class="user_list bg-white overflow-x-auto overflow-y-auto border border-gray-600">
        <table id="filter_table" class="text-xs" data-search-url="/user" data-scroll-target=".user_list">
            <thead>
                <tr class="text-left text-white bg-black whitespace-nowrap sticky top-0 h-7 z-10">
                    <th class="font-thin py-1 px-2 text-center">操作</th>
                    <th class="font-thin py-1 px-2 text-center">営業所</th>
                    <th class="font-thin py-1 px-2 text-center">ユーザーID</th>
                    <th class="font-thin py-1 px-2 text-center">従業員番号</th>
                    <th class="font-thin py-1 px-2 text-center">氏名</th>
                    <th class="font-thin py-1 px-2 text-center">メールアドレス</th>
                    <th class="font-thin py-1 px-2 text-center">ステータス</th>
                    <th class="font-thin py-1 px-2 text-center">権限</th>
                    <th class="font-thin py-1 px-2 text-center">パスワード変更</th>
                    <th class="font-thin py-1 px-2 text-center">最終ログイン日時</th>
                </tr>
                <tr class="filter-row sticky top-[28px] bg-white z-10">
                    <th></th>
                    <x-filter.select id="filter_base_id" name="filter_base_id" :selectItems="$bases" optionValue="base_id" optionText="base_name" />
                    <x-filter.input type="tel" id="filter_user_id" name="filter_user_id" />
                    <x-filter.input type="tel" id="filter_employee_no" name="filter_employee_no" />
                    <x-filter.input type="tel" id="filter_user_name" name="filter_user_name" />
                    <x-filter.input type="tel" id="filter_email" name="filter_email" />
                    <x-filter.select-boolean id="filter_is_active" name="filter_is_active" label1="有効" label0="無効" />
                    <x-filter.select id="filter_role_id" name="filter_role_id" :selectItems="$roles" optionValue="role_id" optionText="role_name" />
                    <x-filter.select-boolean id="filter_is_password_change_required" name="filter_is_password_change_required" label1="必要" label0="不要" />
                    <th></th>
                </tr>
            </thead>
            <tbody class="bg-white">
                @foreach($users as $user)
                    <tr class="text-left cursor-default whitespace-nowrap @if(!$user->is_active) bg-common-disabled @endif">
                        <td class="py-1 px-2 border">
                            <div class="flex flex-row gap-5">
                                <a href="{{ route('user_update.index', ['user_no' => $user->user_no]) }}" class="btn rounded bg-btn-enter text-white py-1 px-2">更新</a>
                                <button type="button" class="btn password_reset_enter rounded bg-orange-500 text-white py-1 px-2" data-user-no="{{ $user->user_no }}">パスワードリセット</button>
                            </div>
                        </td>
                        <td class="py-1 px-2 border">{{ $user->base?->base_name }}</td>
                        <td class="py-1 px-2 border">{{ $user->user_id }}</td>
                        <td class="py-1 px-2 border text-center">{{ $user->employee_no }}</td>
                        <td class="py-1 px-2 border">
                            <div class="flex items-center gap-1">
                                <img class="profile_image_normal image_fade_in_modal_open flex-shrink-0" src="{{ asset('storage/profile_images/'.$user->profile_image_file_name) }}">
                                {{ $user->user_name }}
                            </div>
                        </td>
                        <td class="py-1 px-2 border">{{ $user->email }}</td>
                        <td class="py-1 px-2 border text-center">
                            <x-list.status :value="$user->is_active" label1="有効" label0="無効" />
                        </td>
                        <td class="py-1 px-2 border">{{ $user->role->role_name }}</td>
                        <td class="py-1 px-2 border text-center">
                            <x-list.status :value="$user->is_password_change_required" label1="必要" label0="不要" />
                        </td>
                        <td class="py-1 px-2 border">
                            @if($user->last_login_at)
                                {{ CarbonImmutable::parse($user->last_login_at)->isoFormat('YYYY年MM月DD日(ddd) HH時mm分ss秒').'('.CarbonImmutable::parse($user->last_login_at)->diffForHumans().')' }}
                            @endif</td>
                        </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <form method="POST" action="{{ route('password_reset.reset') }}" id="password_reset_form" class="hidden">
        @csrf
        <input type="hidden" id="user_no" name="user_no">
    </form>
</div>