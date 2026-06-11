<x-app-layout>
    <div class="p-4">
        {{-- ツールバー --}}
        <div class="flex items-center gap-3 mb-4 p-3 bg-white border border-gray-200 rounded-lg flex-wrap">

            {{-- 営業所切り替え --}}
            <span class="text-sm font-medium text-gray-700">営業所</span>
            <select id="baseSel" class="text-sm border rounded px-2 py-1"
                    onchange="location.href='?base_id='+this.value">
            @foreach($bases as $base)
                <option value="{{ $base->base_id }}" {{ $base->base_id == $baseId ? 'selected' : '' }}>
                {{ $base->base_name }}
                </option>
            @endforeach
            </select>

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
        </div>

        {{-- ボードエリア --}}
        <div class="flex gap-3">

            {{-- トレイ（未配置） --}}
            <div id="tray"
                class="w-36 min-h-[560px] bg-gray-50 border border-gray-200 rounded-xl p-2 flex flex-col gap-2 shrink-0">
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
                    {!! staffChip($s->staff_name, $s->role_name, $s->color, $s->size ?? 'M', $s->shape ?? 'rect') !!}
                </div>
                @endif
            @endforeach
            </div>

            {{-- ホワイトボード --}}
            <div id="board"
                class="relative flex-1 min-h-[560px] rounded-xl border border-gray-300"
                style="background:#f7f6f0; overflow:auto; cursor:default;"
                data-whiteboard-id="{{ $whiteboard->whiteboard_id }}"
                data-canvas-w="{{ $whiteboard->canvas_w }}"
                data-canvas-h="{{ $whiteboard->canvas_h }}"
                data-base-id="{{ $baseId }}">

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

                    {{-- 顧客ゾーン --}}
                    @foreach($clients as $i => $client)
                        @php $zone = $zoneItems[$client->client_alias_id] ?? null; @endphp
                        <div class="client-zone magnet-zone cursor-grab select-none absolute border-2 rounded-xl"
                            data-zone-id="{{ $client->client_alias_id }}"
                            style="
                                left:{{ $zone ? $zone->pos_x . 'px' : (40 + $i * 200) . 'px' }};
                                top:{{ $zone ? $zone->pos_y . 'px' : '40px' }};
                                width:180px;
                                height:280px;
                                border-color:{{ zoneColor($i, 'border') }};
                                background:{{ zoneColor($i, 'bg') }};
                            ">
                            <span class="absolute -top-3 left-2 text-xs font-medium px-1 rounded pointer-events-none select-none"
                                style="color:{{ zoneColor($i, 'text') }};background:#f7f6f0;">
                                {{ $client->client_alias_name }}
                            </span>
                        </div>
                    @endforeach

                    {{-- ボード上の磁石 --}}
                    @foreach($staffList as $s)
                        @if(isset($staffItems[$s->staff_id]) && $staffItems[$s->staff_id]->on_board)
                        @php $item = $staffItems[$s->staff_id]; @endphp
                        <div class="magnet absolute cursor-grab select-none"
                            data-id="{{ $s->staff_id }}"
                            data-color="{{ $s->color }}"
                            data-size="{{ $s->size ?? 'M' }}"
                            data-shape="{{ $s->shape ?? 'rect' }}"
                            data-name="{{ $s->staff_name }}"
                            data-role="{{ $s->role_name }}"
                            style="
                                left:{{ $item->pos_x / $whiteboard->canvas_w * 100 }}%;
                                top:{{ $item->pos_y / $whiteboard->canvas_h * 100 }}%;
                            ">
                            {!! staffChip($s->staff_name, $s->role_name, $s->color, $s->size ?? 'M', $s->shape ?? 'rect') !!}
                        </div>
                        @endif
                    @endforeach

                </div>
                {{-- 仮想キャンバスここまで --}}

            </div>
        </div>
    </div>
</x-app-layout>
@vite([
    'resources/js/whiteboard/org_chart/org_chart.js',
])