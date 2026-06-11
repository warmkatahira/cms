<x-app-layout>
    <div class="p-0">
        {{-- ツールバー --}}
        <div class="flex items-center gap-3 mb-4 p-3 bg-white border border-gray-200 rounded-lg flex-wrap">

            {{-- 一覧に戻る --}}
            <a href="{{ route('whiteboard.index') }}"
               class="text-sm border rounded px-3 py-1 bg-white hover:bg-gray-50">
                ← 一覧
            </a>

            <span class="text-gray-300 mx-1">|</span>

            {{-- スタッフ追加 --}}
            <input id="newName" type="text" placeholder="氏名"
                class="text-sm border rounded px-2 py-1 w-28">
            <input id="newRole" type="text" placeholder="役割"
                class="text-sm border rounded px-2 py-1 w-28">
            <button onclick="addStaff()"
                    class="text-sm border rounded px-3 py-1 bg-white hover:bg-gray-50">
                追加
            </button>

            <span class="text-gray-300 mx-1">|</span>

            {{-- グループ追加 --}}
            <input id="newZoneLabel" type="text" placeholder="グループ名"
                class="text-sm border rounded px-2 py-1 w-28">
            <button onclick="addZone()"
                    class="text-sm border rounded px-3 py-1 bg-white hover:bg-gray-50">
                グループ追加
            </button>
        </div>

        {{-- ボードエリア --}}
        <div class="flex gap-3">

            {{-- トレイ --}}
            <div id="tray"
                class="w-36 bg-gray-50 overflow-y-auto border border-gray-200 rounded-xl p-2 flex flex-col gap-2 shrink-0"
                style="height:{{ config('whiteboard.board_height') }}">
                <p class="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">未配置</p>

                @foreach($staffList as $s)
                    @if(!isset($staffItems[$s->staff_id]) || !$staffItems[$s->staff_id]->on_board)
                    <div class="magnet cursor-grab select-none"
                        data-id="{{ $s->staff_id }}"
                        data-color="{{ $s->color }}"
                        data-size="{{ $s->size ?? 'M' }}"
                        data-shape="{{ $s->shape ?? 'rect' }}"
                        data-name="{{ $s->staff_name }}"
                        data-role="{{ $s->role_name }}">
                        {!! staffChip($s->staff_name, $s->role_name, $s->color, $s->shape ?? 'rect') !!}
                    </div>
                    @endif
                @endforeach
            </div>

            {{-- ホワイトボード --}}
            <div id="board"
                class="relative flex-1 rounded-xl border border-gray-300"
                style="background:#f7f6f0; overflow:auto; cursor:default; height:{{ config('whiteboard.board_height') }}"
                data-whiteboard-id="{{ $whiteboard->whiteboard_id }}"
                data-canvas-w="{{ $whiteboard->canvas_w }}"
                data-canvas-h="{{ $whiteboard->canvas_h }}">

                {{-- 仮想キャンバス --}}
                <div id="board-canvas"
                    style="
                        position:relative;
                        width:{{ $whiteboard->canvas_w }}px;
                        height:{{ $whiteboard->canvas_h }}px;
                        background-image: radial-gradient(circle, #c8c6be 1px, transparent 1px);
                        background-size: 24px 24px;
                    ">

                    {{-- ボードタイトル --}}
                    <p class="absolute top-2 left-3 text-xs text-gray-400 uppercase tracking-wide pointer-events-none select-none">
                        {{ $whiteboard->title }}
                    </p>

                    {{-- ゾーン --}}
                    @foreach($zoneItems as $i => $zone)
                        @php
                            $meta       = $zone->meta ?? [];
                            $colorIndex = $meta['color_index'] ?? 0;
                            $label      = $meta['label'] ?? '';
                        @endphp
                        <div class="zone magnet-zone cursor-grab select-none absolute border-2 rounded-xl"
                            data-zone-id="{{ $zone->whiteboard_item_id }}"
                            data-color-index="{{ $colorIndex }}"
                            data-label="{{ $label }}"
                            style="
                                left:{{ $zone->pos_x }}px;
                                top:{{ $zone->pos_y }}px;
                                width:{{ isset($meta['width']) ? $meta['width'] . 'px' : '180px' }};
                                height:{{ isset($meta['height']) ? $meta['height'] . 'px' : '280px' }};
                                border-color:{{ zoneColor($colorIndex, 'border') }};
                                background:{{ zoneColor($colorIndex, 'bg') }};
                            ">
                            <span class="zone-label-text absolute -top-3 left-2 text-xs font-medium px-1 rounded pointer-events-none select-none"
                                style="color:{{ zoneColor($colorIndex, 'text') }};background:#f7f6f0;">
                                {{ $label }}
                            </span>
                            <div class="zone-edit-btn" style="
                                display:none;position:absolute;top:-7px;right:-7px;
                                width:18px;height:18px;border-radius:50%;
                                background:#374151;color:white;font-size:10px;
                                align-items:center;justify-content:center;
                                cursor:pointer;z-index:10;
                            ">✏</div>
                            <div class="zone-resize-handle" style="
                                display:none;position:absolute;bottom:-4px;right:-4px;
                                width:14px;height:14px;border-radius:2px;
                                color:#374151;font-size:18px;line-height:14px;text-align:center;
                                cursor:se-resize;z-index:10;user-select:none;
                            ">⤡</div>
                        </div>
                    @endforeach

                    {{-- ボード上の磁石 --}}
                    @foreach($staffList as $s)
                        @if(isset($staffItems[$s->staff_id]) && $staffItems[$s->staff_id]->on_board)
                        @php
                            $item     = $staffItems[$s->staff_id];
                            $chipMeta = $item->meta ?? [];
                            $chipW    = isset($chipMeta['width'])  ? $chipMeta['width']  . 'px' : null;
                            $chipH    = isset($chipMeta['height']) ? $chipMeta['height'] . 'px' : null;
                        @endphp
                        <div class="magnet absolute cursor-grab select-none"
                            data-id="{{ $s->staff_id }}"
                            data-color="{{ $s->color }}"
                            data-size="{{ $s->size ?? 'M' }}"
                            data-shape="{{ $s->shape ?? 'rect' }}"
                            data-name="{{ $s->staff_name }}"
                            data-role="{{ $s->role_name }}"
                            style="
                                left:{{ $item->pos_x }}px;
                                top:{{ $item->pos_y }}px;
                            ">
                            {!! staffChip($s->staff_name, $s->role_name, $s->color, $s->shape ?? 'rect', $chipW, $chipH) !!}
                        </div>
                        @endif
                    @endforeach

                </div>
            </div>
        </div>
    </div>
</x-app-layout>
@vite([
    'resources/js/whiteboard/org_chart/org_chart.js',
])