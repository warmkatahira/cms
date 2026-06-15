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

            <span class="text-gray-300 mx-1">|</span>

            {{-- テキスト追加 --}}
            <button onclick="addText()"
                    class="text-sm border rounded px-3 py-1 bg-white hover:bg-gray-50">
                テキスト追加
            </button>

            <span class="text-gray-300 mx-1">|</span>

            {{-- 図形追加 --}}
            <div class="relative" x-data="{ open: false }">
                <button @click="open = !open"
                        class="text-sm border rounded px-3 py-1 bg-white hover:bg-gray-50">
                    図形追加 ▾
                </button>
                <div x-show="open" @click.away="open = false"
                    class="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2"
                    style="min-width:140px;">
                    <button onclick="addShape('rect')"     class="block w-full text-left text-sm px-3 py-1.5 hover:bg-gray-50 rounded">■ 四角</button>
                    <button onclick="addShape('circle')"   class="block w-full text-left text-sm px-3 py-1.5 hover:bg-gray-50 rounded">● 丸</button>
                    <button onclick="addShape('triangle')" class="block w-full text-left text-sm px-3 py-1.5 hover:bg-gray-50 rounded">▲ 三角</button>
                    <button onclick="addShape('line')"     class="block w-full text-left text-sm px-3 py-1.5 hover:bg-gray-50 rounded">― 線</button>
                    <button onclick="addShape('arrow')"    class="block w-full text-left text-sm px-3 py-1.5 hover:bg-gray-50 rounded">→ 矢印</button>
                </div>
            </div>
        </div>

        {{-- ボードエリア --}}
        <div class="flex gap-3">

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
                            <div class="zone-copy-btn" style="
                                display:none;position:absolute;top:-7px;right:14px;
                                width:18px;height:18px;border-radius:50%;
                                background:#374151;color:white;font-size:10px;
                                align-items:center;justify-content:center;
                                cursor:pointer;z-index:10;
                            ">📋</div>
                            <div class="zone-resize-handle" style="
                                display:none;position:absolute;bottom:-4px;right:-4px;
                                width:14px;height:14px;border-radius:2px;
                                color:#374151;font-size:18px;line-height:14px;text-align:center;
                                cursor:se-resize;z-index:10;user-select:none;
                            ">⤡</div>
                        </div>
                    @endforeach

                    {{-- テキストボックス --}}
                    @foreach($textItems as $text)
                        @php $meta = $text->meta ?? []; @endphp
                        <div class="text-box absolute cursor-grab select-none"
                            data-text-id="{{ $text->whiteboard_item_id }}"
                            style="
                                left:{{ $text->pos_x }}px;
                                top:{{ $text->pos_y }}px;
                                width:{{ $meta['width'] ?? 200 }}px;
                                height:{{ $meta['height'] ?? 100 }}px;
                                position:absolute;
                            ">
                            <div class="text-box-inner" style="
                                width:100%;min-height:100%;padding:8px;
                                font-size:{{ $meta['font_size'] ?? 14 }}px;
                                color:{{ $meta['color'] ?? '#374151' }};
                                font-weight:{{ $meta['font_weight'] ?? '400' }};
                                border:1.5px dashed #d1d5db;border-radius:6px;
                                background:{{ $meta['bg_color'] ?? 'white' }};word-break:break-all;
                                box-sizing:border-box;
                            ">{{ $meta['text'] ?? '' }}</div>
                            <div class="text-edit-btn" style="display:none;position:absolute;top:-7px;right:-7px;
                                width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
                                align-items:center;justify-content:center;cursor:pointer;z-index:10;">✏</div>
                            <div class="text-copy-btn" style="display:none;position:absolute;top:-7px;right:14px;
                                width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
                                line-height:18px;text-align:center;cursor:pointer;z-index:10;">📋</div>
                            <div class="text-delete-btn" style="display:none;position:absolute;top:-7px;left:-7px;
                                width:18px;height:18px;border-radius:50%;background:#ef4444;color:white;font-size:12px;
                                line-height:18px;text-align:center;cursor:pointer;z-index:10;">×</div>
                            <div class="text-resize-handle" style="display:none;position:absolute;bottom:-4px;right:-4px;
                                width:14px;height:14px;border-radius:2px;color:#374151;font-size:18px;line-height:14px;
                                text-align:center;cursor:se-resize;z-index:10;user-select:none;">⤡</div>
                        </div>
                    @endforeach

                    {{-- 図形 --}}
                    @foreach($shapeItems as $shape)
                        @php $meta = $shape->meta ?? []; @endphp
                        <div class="shape-box absolute cursor-grab select-none"
                            data-shape-id="{{ $shape->whiteboard_item_id }}"
                            data-shape-type="{{ $meta['shape_type'] ?? 'rect' }}"
                            data-fill-color="{{ $meta['fill_color'] ?? '#93c5fd' }}"
                            data-stroke-color="{{ $meta['stroke_color'] ?? '#2563eb' }}"
                            data-rotation="{{ $meta['rotation'] ?? 0 }}"
                            style="
                                left:{{ $shape->pos_x }}px;
                                top:{{ $shape->pos_y }}px;
                                width:{{ $meta['width'] ?? 120 }}px;
                                height:{{ $meta['height'] ?? 120 }}px;
                                position:absolute;
                                transform:rotate({{ $meta['rotation'] ?? 0 }}deg);
                            ">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="overflow:visible;">
                                @switch($meta['shape_type'] ?? 'rect')
                                    @case('rect')
                                        <rect x="2" y="2" width="96" height="96"
                                            fill="{{ $meta['fill_color'] ?? '#93c5fd' }}"
                                            stroke="{{ $meta['stroke_color'] ?? '#2563eb' }}"
                                            stroke-width="2" rx="4" vector-effect="non-scaling-stroke"/>
                                        @break
                                    @case('circle')
                                        <ellipse cx="50" cy="50" rx="48" ry="48"
                                            fill="{{ $meta['fill_color'] ?? '#93c5fd' }}"
                                            stroke="{{ $meta['stroke_color'] ?? '#2563eb' }}"
                                            stroke-width="2" vector-effect="non-scaling-stroke"/>
                                        @break
                                    @case('triangle')
                                        <polygon points="50,2 98,98 2,98"
                                            fill="{{ $meta['fill_color'] ?? '#93c5fd' }}"
                                            stroke="{{ $meta['stroke_color'] ?? '#2563eb' }}"
                                            stroke-width="2" vector-effect="non-scaling-stroke"/>
                                        @break
                                    @case('line')
                                        <line x1="0" y1="50" x2="100" y2="50"
                                            stroke="{{ $meta['stroke_color'] ?? '#2563eb' }}"
                                            stroke-width="3" vector-effect="non-scaling-stroke"/>
                                        @break
                                    @case('arrow')
                                        <defs>
                                            <marker id="arrow-{{ $shape->whiteboard_item_id }}" markerWidth="10" markerHeight="7"
                                                    refX="10" refY="3.5" orient="auto">
                                                <polygon points="0 0, 10 3.5, 0 7"
                                                    fill="{{ $meta['stroke_color'] ?? '#2563eb' }}"/>
                                            </marker>
                                        </defs>
                                        <line x1="0" y1="50" x2="90" y2="50"
                                            stroke="{{ $meta['stroke_color'] ?? '#2563eb' }}"
                                            stroke-width="3" vector-effect="non-scaling-stroke"
                                            marker-end="url(#arrow-{{ $shape->whiteboard_item_id }})"/>
                                        @break
                                @endswitch
                            </svg>
                            <div class="shape-delete-btn" style="display:none;position:absolute;top:-7px;left:-7px;
                                width:18px;height:18px;border-radius:50%;background:#ef4444;color:white;font-size:12px;
                                line-height:18px;text-align:center;cursor:pointer;z-index:10;">×</div>
                            <div class="shape-copy-btn" style="display:none;position:absolute;top:-7px;right:14px;
                                width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
                                line-height:18px;text-align:center;cursor:pointer;z-index:10;">📋</div>
                            <div class="shape-resize-handle" style="display:none;position:absolute;bottom:-4px;right:-4px;
                                width:14px;height:14px;border-radius:2px;color:#374151;font-size:18px;line-height:14px;
                                text-align:center;cursor:se-resize;z-index:10;user-select:none;">⤡</div>
                            <div class="shape-color-btn" style="display:none;position:absolute;top:-7px;right:-7px;
                                width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
                                line-height:18px;text-align:center;cursor:pointer;z-index:10;">🎨</div>
                            <div class="shape-rotate-handle" style="display:none;position:absolute;top:-7px;right:35px;
                                width:14px;height:14px;border-radius:50%;background:#374151;
                                cursor:grab;z-index:10;user-select:none;">↻</div>
                        </div>
                    @endforeach

                    {{-- ボード上の磁石（全スタッフ） --}}
                    @foreach($staffList as $s)
                        @php
                            $item     = $staffItems[$s->staff_id] ?? null;
                            $chipMeta = $item ? ($item->meta ?? []) : [];
                            $chipW    = isset($chipMeta['width'])  ? $chipMeta['width']  . 'px' : null;
                            $chipH    = isset($chipMeta['height']) ? $chipMeta['height'] . 'px' : null;
                            $posX     = $item ? $item->pos_x : 40;
                            $posY     = $item ? $item->pos_y : 40;
                        @endphp
                        <div class="magnet absolute cursor-grab select-none"
                            data-id="{{ $s->staff_id }}"
                            data-color="{{ $s->color }}"
                            data-size="{{ $s->size ?? 'M' }}"
                            data-shape="{{ $s->shape ?? 'rect' }}"
                            data-name="{{ $s->staff_name }}"
                            data-role="{{ $s->role_name }}"
                            style="
                                left:{{ $posX }}px;
                                top:{{ $posY }}px;
                            ">
                            {!! staffChip($s->staff_name, $s->role_name, $s->color, $s->shape ?? 'rect', $chipW, $chipH) !!}
                        </div>
                    @endforeach

                </div>
            </div>
        </div>
    </div>
</x-app-layout>
@vite([
    'resources/js/whiteboard/board/board.js',
])