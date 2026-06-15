<x-app-layout>
    <div class="p-0">

        {{-- ヘッダー --}}
        <div class="flex items-center justify-between mb-4">
            <button onclick="openCreateModal()"
                    class="flex items-center gap-1 text-sm border rounded px-3 py-1 bg-white hover:bg-gray-50">
                <i class="las la-plus"></i>
                新規作成
            </button>
        </div>

        {{-- 一覧 --}}
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            @forelse($whiteboards as $wb)
            <div class="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 cursor-pointer hover:border-gray-300"
                 onclick="location.href='{{ route('board.index', ['whiteboard_id' => $wb->whiteboard_id]) }}'">

                {{-- タイトル行 --}}
                <div class="flex items-start justify-between gap-2">
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                        <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <i class="ti ti-layout-board text-blue-600" aria-hidden="true"></i>
                        </div>
                        <p class="text-sm font-medium text-gray-800 truncate wb-title"
                            data-id="{{ $wb->whiteboard_id }}"
                            onclick="event.stopPropagation(); startEditTitle(this)"
                            style="cursor:text;">
                                {{ $wb->title }}
                        </p>
                    </div>
                    <button onclick="event.stopPropagation(); deleteWhiteboard({{ $wb->whiteboard_id }})"
                            class="text-xs text-red-400 hover:text-red-600 shrink-0 px-1">
                        削除
                    </button>
                </div>

                {{-- メタ情報 --}}
                <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-1 text-xs text-gray-400">
                        <i class="ti ti-user" style="font-size:13px;" aria-hidden="true"></i>
                        <span>作成者：{{ $wb->createdBy?->user_name ?? '不明' }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-400">
                        <i class="ti ti-users" style="font-size:13px;" aria-hidden="true"></i>
                        <span>{{ $wb->users->count() }}人参加</span>
                        <button onclick="event.stopPropagation(); openEditUsers({{ $wb->whiteboard_id }}, {{ $wb->users->pluck('user_no')->toJson() }}, {{ $wb->created_by ?? 'null' }})"
                                class="text-xs text-gray-400 hover:text-gray-600 underline">
                            編集
                        </button>
                        {{-- アバター --}}
                        <div class="flex">
                            @foreach($wb->users->take(5) as $u)
                            <div class="w-6 h-6 rounded-full border-2 border-white -ml-1 first:ml-0 overflow-hidden bg-blue-50 flex items-center justify-center"
                                 style="font-size:9px;font-weight:500;color:#185FA5;">
                                @if($u->profile_image_file_name)
                                    <img src="{{ asset('storage/profile_images/'.$u->profile_image_file_name) }}"
                                         class="w-full h-full object-cover"
                                         alt="{{ $u->user_name }}">
                                @else
                                    {{ mb_substr($u->user_name, 0, 1) }}
                                @endif
                            </div>
                            @endforeach
                            @if($wb->users->count() > 5)
                            <div class="w-6 h-6 rounded-full border-2 border-white -ml-1 bg-gray-100 flex items-center justify-center"
                                 style="font-size:9px;color:#888;">
                                +{{ $wb->users->count() - 5 }}
                            </div>
                            @endif
                        </div>
                    </div>
                </div>

                {{-- フッター --}}
                <div class="flex items-center justify-between border-t border-gray-100 pt-2">
                    <span class="flex items-center gap-1 text-xs text-gray-400">
                        <i class="ti ti-clock" style="font-size:12px;" aria-hidden="true"></i>
                        最終更新日時：{{ $wb->last_activity_at }}
                    </span>
                    <i class="ti ti-arrow-right text-gray-300" style="font-size:16px;" aria-hidden="true"></i>
                </div>

            </div>
            @empty
            <p class="text-sm text-gray-400">ホワイトボードがありません。</p>
            @endforelse
        </div>
    </div>

    {{-- 作成モーダル --}}
    <div id="create-modal" style="display:none;position:fixed;inset:0;z-index:99999;
         background:rgba(0,0,0,0.4);align-items:center;justify-content:center;">
        <div style="background:white;border-radius:12px;padding:24px;width:400px;">
            <p style="font-size:15px;font-weight:500;margin-bottom:16px;">ホワイトボードを作成</p>

            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:4px;">名前</label>
                <input id="wb-title" type="text" autocomplete="off"
                       style="width:100%;font-size:14px;border:1px solid #d1d5db;border-radius:6px;padding:6px 10px;">
            </div>

            <div style="margin-bottom:20px;">
                <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:4px;">参加ユーザー</label>
                <div style="max-height:200px;overflow-y:auto;border:1px solid #d1d5db;border-radius:6px;padding:8px;">
                    @foreach($users as $user)
                    <label style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13px;cursor:pointer;">
                        <input type="checkbox" name="user_nos[]" value="{{ $user->user_no }}"
                               {{ $user->user_no == auth()->user()->user_no ? 'checked disabled' : '' }}>
                        @if($user->profile_image_file_name)
                            <img src="{{ asset('storage/profile_images/'.$user->profile_image_file_name) }}"
                                 class="w-6 h-6 rounded-full object-cover">
                        @else
                            <div style="width:24px;height:24px;border-radius:50%;background:#E6F1FB;
                                        display:flex;align-items:center;justify-content:center;
                                        font-size:10px;font-weight:500;color:#185FA5;flex-shrink:0;">
                                {{ mb_substr($user->user_name, 0, 1) }}
                            </div>
                        @endif
                        {{ $user->user_name }}
                    </label>
                    @endforeach
                </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:8px;">
                <button onclick="closeCreateModal()"
                        style="font-size:13px;padding:6px 16px;border:1px solid #d1d5db;
                               border-radius:6px;cursor:pointer;background:white;">
                    キャンセル
                </button>
                <button onclick="submitCreate()"
                        style="font-size:13px;padding:6px 16px;border:none;
                               border-radius:6px;cursor:pointer;background:#374151;color:white;">
                    作成
                </button>
            </div>
        </div>
    </div>

    {{-- 参加者編集モーダル --}}
    <div id="edit-users-modal" style="display:none;position:fixed;inset:0;z-index:99999;
        background:rgba(0,0,0,0.4);align-items:center;justify-content:center;">
        <div style="background:white;border-radius:12px;padding:24px;width:400px;">
            <p style="font-size:15px;font-weight:500;margin-bottom:16px;">参加者を編集</p>

            <div style="margin-bottom:20px;">
                <div style="max-height:200px;overflow-y:auto;border:1px solid #d1d5db;border-radius:6px;padding:8px;">
                    @foreach($users as $user)
                    <label style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13px;cursor:pointer;">
                        <input type="checkbox" name="edit_user_nos[]" value="{{ $user->user_no }}"
                            id="edit_user_{{ $user->user_no }}">
                        @if($user->profile_image_file_name)
                            <img src="{{ asset('storage/profile_images/'.$user->profile_image_file_name) }}"
                                class="w-6 h-6 rounded-full object-cover">
                        @else
                            <div style="width:24px;height:24px;border-radius:50%;background:#E6F1FB;
                                        display:flex;align-items:center;justify-content:center;
                                        font-size:10px;font-weight:500;color:#185FA5;flex-shrink:0;">
                                {{ mb_substr($user->user_name, 0, 1) }}
                            </div>
                        @endif
                        {{ $user->user_name }}
                    </label>
                    @endforeach
                </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:8px;">
                <button onclick="closeEditUsers()"
                        style="font-size:13px;padding:6px 16px;border:1px solid #d1d5db;
                            border-radius:6px;cursor:pointer;background:white;">
                    キャンセル
                </button>
                <button onclick="submitEditUsers()"
                        style="font-size:13px;padding:6px 16px;border:none;
                            border-radius:6px;cursor:pointer;background:#374151;color:white;">
                    保存
                </button>
            </div>
        </div>
    </div>
</x-app-layout>
@vite([
    'resources/js/whiteboard/whiteboard/whiteboard.js',
])