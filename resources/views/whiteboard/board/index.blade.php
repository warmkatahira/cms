<x-app-layout>
    <div class="p-0 flex flex-col" style="height:calc(100vh - 80px);">
        {{-- ボードタイトル + 参加者 --}}
        <div class="mb-2 border border-gray-200" x-data="{ open: false }">
            <div class="flex items-center justify-between px-4 py-1.5 cursor-pointer bg-theme-main select-none"
                :class="open ? 'rounded-t-xl' : 'rounded-xl'"
                @click="open = !open">
                <span class="text-sm font-medium text-white">{{ $whiteboard->title }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white transition-transform"
                    :class="open && 'rotate-180'"
                    fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                </svg>
            </div>
            <div x-show="open" class="bg-white border-t border-gray-100 px-4 py-2 flex flex-col gap-1">
                <div class="text-xs text-gray-400 flex items-center gap-1">
                    <span class="shrink-0">作成者：</span>
                    <img src="{{ asset('storage/profile_images/'.$whiteboard->createdBy->profile_image_file_name) }}"
                        class="w-4 h-4 rounded-full object-cover">
                    <span class="text-gray-500">{{ $whiteboard->createdBy->user_name }}</span>
                </div>
                <div class="text-xs flex items-center gap-1 flex-wrap">
                    <span class="text-gray-400 shrink-0">参加者（{{ $whiteboard->users->count() }}人）：</span>
                    @foreach($whiteboard->users as $u)
                        <div class="flex items-center gap-1 px-1 py-0 rounded-md hover:bg-gray-100" title="{{ $u->user_name }}">
                            <img src="{{ asset('storage/profile_images/'.$u->profile_image_file_name) }}"
                                class="w-4 h-4 rounded-full object-cover"
                                alt="{{ $u->user_name }}">
                            <span class="text-xs text-gray-500">{{ $u->user_name }}</span>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
        {{-- ツールバー --}}
        <div class="flex items-center gap-1.5 p-2 mb-2 bg-white border border-gray-200 rounded-xl">

            {{-- 一覧に戻る --}}
            <a href="{{ route('whiteboard.index') }}" data-tippy-content="一覧へ戻る"
                class="flex items-center justify-center p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
            </a>

            <div class="w-px h-5 bg-gray-200 mx-0.5"></div>

            {{-- スタッフ追加 --}}
            <div class="relative" x-data="{ open: false }">
                <button @click="open = !open" data-tippy-content="スタッフ追加"
                        class="flex items-center gap-1 p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                </button>
                <div x-show="open" @click.away="open = false"
                    class="absolute top-10 left-0 flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-3 py-2 whitespace-nowrap">
                    <span class="text-xs text-gray-500 shrink-0 bg-gray-200 px-1.5 py-0.5 rounded">氏名</span>
                    <input id="newName" type="text" placeholder="入力..."
                        class="text-sm outline-none w-36 bg-transparent text-gray-800 placeholder-gray-400 border-gray-300 rounded">
                    <span class="text-xs text-gray-500 shrink-0 bg-gray-200 px-1.5 py-0.5 rounded">役割</span>
                    <input id="newRole" type="text" placeholder="入力..."
                        class="text-sm outline-none w-20 bg-transparent text-gray-800 placeholder-gray-400 border-gray-300 rounded">
                    <button onclick="addStaff()"
                            class="text-sm px-2.5 py-0.5 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 shrink-0">追加</button>
                </div>
            </div>

            {{-- グループ追加 --}}
            <div class="relative" x-data="{ open: false }">
                <button @click="open = !open" data-tippy-content="グループ追加"
                        class="flex items-center gap-1 p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                </button>
                <div x-show="open" @click.away="open = false"
                    class="absolute top-10 left-0 flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-3 py-2 whitespace-nowrap">
                    <span class="text-xs text-gray-500 shrink-0 bg-gray-200 px-1.5 py-0.5 rounded">名称</span>
                    <input id="newZoneLabel" type="text" placeholder="入力..."
                        class="text-sm outline-none w-32 bg-transparent text-gray-800 placeholder-gray-400 border-gray-300 rounded">
                    <button onclick="addZone()"
                            class="text-sm px-2.5 py-0.5 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 shrink-0">追加</button>
                </div>
            </div>

            <div class="w-px h-5 bg-gray-200 mx-0.5"></div>

            {{-- テキスト追加 --}}
            <button onclick="addText()" data-tippy-content="テキスト追加"
                    class="flex items-center justify-center p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/></svg>
            </button>

            {{-- 図形追加 --}}
            <div class="relative" x-data="{ open: false }">
                <button @click="open = !open" data-tippy-content="図形追加"
                        class="flex items-center justify-center p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"/></svg>
                </button>
                <div x-show="open" @click.away="open = false"
                    class="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1"
                    style="min-width:110px;">
                    <button onclick="addShape('rect')"     class="block w-full text-left text-sm px-3 py-1.5 hover:bg-gray-50">■ 四角</button>
                    <button onclick="addShape('circle')"   class="block w-full text-left text-sm px-3 py-1.5 hover:bg-gray-50">● 丸</button>
                    <button onclick="addShape('triangle')" class="block w-full text-left text-sm px-3 py-1.5 hover:bg-gray-50">▲ 三角</button>
                    <button onclick="addShape('line')"     class="block w-full text-left text-sm px-3 py-1.5 hover:bg-gray-50">― 線</button>
                    <button onclick="addShape('arrow')"    class="block w-full text-left text-sm px-3 py-1.5 hover:bg-gray-50">→ 矢印</button>
                </div>
            </div>

            {{-- 画像追加 --}}
            <button onclick="addImage()" data-tippy-content="画像追加"
                    class="flex items-center justify-center p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z"/></svg>
            </button>

            <div class="w-px h-5 bg-gray-200 mx-0.5"></div>

            {{-- ボードクリア --}}
            <button onclick="clearBoard()" data-tippy-content="全てクリア"
                    class="flex items-center justify-center p-1.5 border border-red-200 rounded-lg hover:bg-red-50 text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
            </button>

        </div>

        {{-- ボードエリア --}}
        <div class="flex gap-3 flex-1 min-h-0">
        <div class="relative flex-1 rounded-xl border border-gray-300 overflow-hidden" style="height:100%;">
            {{-- ルーラー左上の角 --}}
            <div style="position:absolute;top:0;left:0;width:24px;height:20px;background:#eae9e3;border-bottom:1px solid #d1d5db;border-right:1px solid #d1d5db;z-index:3;"></div>
            {{-- ルーラー上 --}}
            <div id="ruler-top" style="position:absolute;top:0;left:24px;right:0;height:20px;background:#eae9e3;border-bottom:1px solid #d1d5db;z-index:2;overflow:hidden;">
                <div id="ruler-top-inner" style="position:relative;height:100%;"></div>
            </div>
            {{-- ルーラー左 --}}
            <div id="ruler-left" style="position:absolute;top:20px;left:0;bottom:0;width:24px;background:#eae9e3;border-right:1px solid #d1d5db;z-index:2;overflow:hidden;">
                <div id="ruler-left-inner" style="position:relative;width:100%;"></div>
            </div>
            {{-- ボード本体 --}}
            <div id="board"
                class="relative"
                style="position:absolute;top:20px;left:24px;right:0;bottom:0;background:#f7f6f0;overflow:auto;cursor:default;"
                data-whiteboard-id="{{ $whiteboard->whiteboard_id }}"
                data-canvas-w="{{ $whiteboard->canvas_w }}"
                data-canvas-h="{{ $whiteboard->canvas_h }}">
                <div id="board-canvas"
                    style="
                        position:relative;
                        width:{{ $whiteboard->canvas_w }}px;
                        height:{{ $whiteboard->canvas_h }}px;
                        background-image:
                            linear-gradient(to right, rgba(200,198,190,0.3) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(200,198,190,0.3) 1px, transparent 1px);
                        background-size: 120px 120px;
                    ">
                    {{-- 細かいグリッド線（24px刻み） --}}
                    <div style="position:absolute;inset:0;pointer-events:none;
                        background-image:
                            linear-gradient(to right, rgba(200,198,190,0.12) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(200,198,190,0.12) 1px, transparent 1px);
                        background-size: 24px 24px;
                    "></div>
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
                            <div class="text-box-inner" data-bg-color="{{ $meta['bg_color'] ?? 'transparent' }}" style="
                                width:100%;min-height:100%;padding:8px;
                                font-size:{{ $meta['font_size'] ?? 14 }}px;
                                color:{{ $meta['color'] ?? '#374151' }};
                                font-weight:{{ $meta['font_weight'] ?? '400' }};
                                font-family:{{ $meta['font_family'] ?? "'Kosugi Maru', sans-serif" }};
                                text-align:{{ $meta['text_align'] ?? 'left' }};
                                border:1.5px dashed transparent;border-radius:6px;
                                background-color:{{ $meta['bg_color'] ?? 'transparent' }};word-break:break-all;
                                box-sizing:border-box;
                            ">{!! nl2br(e($meta['text'] ?? '')) !!}</div>
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
                                width:18px;height:18px;border-radius:50%;background:#374151;color:white;
                                font-size:12px;line-height:18px;text-align:center;
                                cursor:crosshair;z-index:10;user-select:none;">↻</div>
                        </div>
                    @endforeach

                    {{-- 画像 --}}
                    @foreach($imageItems as $image)
                        @php $meta = $image->meta ?? []; @endphp
                        <div class="image-box absolute cursor-grab select-none"
                            data-image-id="{{ $image->whiteboard_item_id }}"
                            style="
                                left:{{ $image->pos_x }}px;
                                top:{{ $image->pos_y }}px;
                                width:{{ $meta['width'] ?? 200 }}px;
                                height:{{ $meta['height'] ?? 200 }}px;
                                position:absolute;
                            ">
                            <img src="{{ $meta['src'] ?? '' }}" draggable="false" style="
                                width:100%;height:100%;object-fit:contain;
                                border-radius:4px;pointer-events:none;
                            ">
                            <div class="image-delete-btn" style="display:none;position:absolute;top:-7px;left:-7px;
                                width:18px;height:18px;border-radius:50%;background:#ef4444;color:white;font-size:12px;
                                line-height:18px;text-align:center;cursor:pointer;z-index:10;">×</div>
                            <div class="image-copy-btn" style="display:none;position:absolute;top:-7px;right:-7px;
                                width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
                                line-height:18px;text-align:center;cursor:pointer;z-index:10;">📋</div>
                            <div class="image-resize-handle" style="display:none;position:absolute;bottom:-4px;right:-4px;
                                width:14px;height:14px;border-radius:2px;color:#374151;font-size:18px;line-height:14px;
                                text-align:center;cursor:se-resize;z-index:10;user-select:none;">⤡</div>
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