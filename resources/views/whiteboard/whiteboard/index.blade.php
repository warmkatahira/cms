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
                    @if($wb->created_by === auth()->user()->user_no)
                        <button onclick="event.stopPropagation(); deleteWhiteboard({{ $wb->whiteboard_id }})"
                                class="text-xs text-red-400 hover:text-red-600 shrink-0 px-1">
                            削除
                        </button>
                    @endif
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
    <div id="create-modal" class="hidden fixed inset-0 z-[99999] bg-black/40 items-center justify-center">
        <div class="bg-white rounded-2xl p-6 w-[400px]" style="animation:modalIn .15s ease;">

            {{-- ヘッダー --}}
            <div class="flex items-center justify-between mb-5">
                <p class="text-[15px] font-medium text-gray-800">ホワイトボードを作成</p>
                <button onclick="closeCreateModal()"
                        class="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
                    <i class="ti ti-x text-sm" aria-hidden="true"></i>
                </button>
            </div>

            {{-- 名前 --}}
            <label class="text-xs text-gray-500 block mb-1">名前</label>
            <input id="wb-title" type="text" autocomplete="off"
                   class="w-full h-9 text-sm border border-gray-200 rounded-lg px-3 mb-4 focus:outline-none focus:border-gray-400">

            {{-- 参加ユーザーラベル＋バッジ --}}
            <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs text-gray-500">参加ユーザー</label>
                <span id="create-selected-count"
                      class="text-[11px] font-medium bg-gray-700 text-white rounded-full px-2 py-0.5">0人</span>
            </div>

            {{-- 検索 --}}
            <div class="relative mb-2">
                <i class="ti ti-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true"></i>
                <input id="create-user-search" type="text" placeholder="名前で絞り込み..." autocomplete="off"
                       class="w-full h-[34px] border border-gray-200 rounded-lg pl-8 pr-3 text-sm focus:outline-none focus:border-gray-400">
            </div>

            {{-- ユーザーリスト --}}
            <div id="create-user-list" class="max-h-60 overflow-y-auto rounded-lg border border-gray-100 p-1">
                @foreach($users as $user)
                <label class="user-item flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-50"
                       data-name="{{ $user->user_name }}">
                    <input type="checkbox" name="user_nos[]" value="{{ $user->user_no }}"
                           class="hidden"
                           {{ $user->user_no == auth()->user()->user_no ? 'checked disabled' : '' }}>
                    @if($user->profile_image_file_name)
                        <img src="{{ asset('storage/profile_images/'.$user->profile_image_file_name) }}"
                             class="w-7 h-7 rounded-full object-cover shrink-0">
                    @else
                        <div class="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-[11px] font-medium text-blue-700">
                            {{ mb_substr($user->user_name, 0, 1) }}
                        </div>
                    @endif
                    <span class="text-sm text-gray-700 flex-1">{{ $user->user_name }}</span>
                    <span class="check-icon w-4 h-4 rounded border border-gray-300 flex items-center justify-center shrink-0"></span>
                </label>
                @endforeach
            </div>

            {{-- フッター --}}
            <div class="flex justify-end gap-2 mt-5">
                <button onclick="closeCreateModal()"
                        class="text-sm px-4 py-1.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                    キャンセル
                </button>
                <button onclick="submitCreate()"
                        class="text-sm px-4 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
                    作成
                </button>
            </div>
        </div>
    </div>

    {{-- 参加者編集モーダル --}}
    <div id="edit-users-modal" class="hidden fixed inset-0 z-[99999] bg-black/40 items-center justify-center">
        <div class="bg-white rounded-2xl p-6 w-[400px]" style="animation:modalIn .15s ease;">

            {{-- ヘッダー --}}
            <div class="flex items-center justify-between mb-5">
                <p class="text-[15px] font-medium text-gray-800">参加者を編集</p>
                <button onclick="closeEditUsers()"
                        class="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
                    <i class="ti ti-x text-sm" aria-hidden="true"></i>
                </button>
            </div>

            {{-- 参加ユーザーラベル＋バッジ --}}
            <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs text-gray-500">参加ユーザー</label>
                <span id="edit-selected-count"
                      class="text-[11px] font-medium bg-gray-700 text-white rounded-full px-2 py-0.5">0人</span>
            </div>

            {{-- 検索 --}}
            <div class="relative mb-2">
                <i class="ti ti-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true"></i>
                <input id="edit-user-search" type="text" placeholder="名前で絞り込み..." autocomplete="off"
                       class="w-full h-[34px] border border-gray-200 rounded-lg pl-8 pr-3 text-sm focus:outline-none focus:border-gray-400">
            </div>

            {{-- ユーザーリスト --}}
            <div id="edit-user-list" class="max-h-60 overflow-y-auto rounded-lg border border-gray-100 p-1">
                @foreach($users as $user)
                <label class="user-item flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-50"
                       data-name="{{ $user->user_name }}">
                    <input type="checkbox" name="edit_user_nos[]" value="{{ $user->user_no }}"
                           id="edit_user_{{ $user->user_no }}" class="hidden">
                    @if($user->profile_image_file_name)
                        <img src="{{ asset('storage/profile_images/'.$user->profile_image_file_name) }}"
                             class="w-7 h-7 rounded-full object-cover shrink-0">
                    @else
                        <div class="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-[11px] font-medium text-blue-700">
                            {{ mb_substr($user->user_name, 0, 1) }}
                        </div>
                    @endif
                    <span class="text-sm text-gray-700 flex-1">{{ $user->user_name }}</span>
                    <span class="check-icon w-4 h-4 rounded border border-gray-300 flex items-center justify-center shrink-0"></span>
                </label>
                @endforeach
            </div>

            {{-- フッター --}}
            <div class="flex justify-end gap-2 mt-5">
                <button onclick="closeEditUsers()"
                        class="text-sm px-4 py-1.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                    キャンセル
                </button>
                <button onclick="submitEditUsers()"
                        class="text-sm px-4 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
                    保存
                </button>
            </div>
        </div>
    </div>

    {{-- フェードインアニメーション --}}
    <style>
        @keyframes modalIn {
            from { opacity: 0; transform: translateY(6px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }
    </style>
</x-app-layout>
@vite([
    'resources/js/whiteboard/whiteboard/whiteboard.js',
])