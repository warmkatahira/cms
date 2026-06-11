<x-app-layout>
    <div class="p-4">

        {{-- ヘッダー --}}
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-medium text-gray-700">参加中のホワイトボード</h2>
            <button onclick="openCreateModal()"
                    class="text-sm border rounded px-3 py-1 bg-white hover:bg-gray-50">
                ＋ 新規作成
            </button>
        </div>

        {{-- 一覧 --}}
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            @forelse($whiteboards as $wb)
            <div class="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
                <div class="flex items-start justify-between">
                    <a href="{{ route('org_chart.index', ['whiteboard_id' => $wb->whiteboard_id]) }}"
                       class="text-sm font-medium text-gray-800 hover:underline">
                        {{ $wb->title }}
                    </a>
                    <button onclick="deleteWhiteboard({{ $wb->whiteboard_id }})"
                            class="text-xs text-red-400 hover:text-red-600 ml-2 shrink-0">
                        削除
                    </button>
                </div>
                <div class="text-xs text-gray-400">
                    作成者：{{ $wb->createdBy?->user_name ?? '不明' }}
                </div>
                <div class="text-xs text-gray-400">
                    参加者：{{ $wb->users->count() }}人（{{ $wb->users->pluck('user_name')->join('、') }}）
                </div>
                <div class="text-xs text-gray-400">
                    作成日時：{{ $wb->created_at->format('Y/m/d H:i:s') }}
                </div>
                <div class="text-xs text-gray-400">
                    更新日時：{{ $wb->last_activity_at }}
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
</x-app-layout>
@vite([
    'resources/js/whiteboard/whiteboard/whiteboard.js',
])