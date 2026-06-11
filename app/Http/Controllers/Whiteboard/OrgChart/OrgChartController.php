<?php

namespace App\Http\Controllers\Whiteboard\OrgChart;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Base;
use App\Models\ClientAlias;
use App\Models\Staff;
use App\Models\Whiteboard;
use App\Models\WhiteboardItem;

class OrgChartController extends Controller
{
    public function index(Request $request)
    {
        session(['page_header' => '組織図']);
        $bases  = Base::ordered()->get();
        $baseId = $request->get('base_id', $bases->first()?->base_id);

        $whiteboard = Whiteboard::firstOrCreate(
            ['base_id' => $baseId, 'board_type' => 'staff_map'],
            [
                'title'    => (Base::find($baseId)?->base_name ?? '未設定') . ' 組織図',
                'canvas_w' => config('whiteboard.canvas_w'),
                'canvas_h' => config('whiteboard.canvas_h'),
            ]
        );

        $staffList = Staff::where('base_id', $baseId)
                        ->where('is_active', true)
                        ->get();

        $clients = ClientAlias::where('base_id', $baseId)->get();

        // staff の座標
        $staffItems = $whiteboard->items()
                                ->where('item_type', 'staff')
                                ->get()
                                ->keyBy('item_id');

        // client_zone の座標（なければ初期位置を自動生成）
        $zoneItems = $whiteboard->items()
                                ->where('item_type', 'client_zone')
                                ->get()
                                ->keyBy('item_id');

        $zoneColors = [
            ['border'=>'#378ADD','bg'=>'rgba(56,138,221,0.06)','text'=>'#0C447C'],
            ['border'=>'#639922','bg'=>'rgba(99,153,34,0.06)', 'text'=>'#27500A'],
            ['border'=>'#D4537E','bg'=>'rgba(212,83,126,0.06)','text'=>'#72243E'],
            ['border'=>'#BA7517','bg'=>'rgba(186,117,23,0.06)','text'=>'#633806'],
            ['border'=>'#7F77DD','bg'=>'rgba(127,119,221,0.06)','text'=>'#3C3489'],
        ];

        foreach ($clients as $i => $client) {
            if (!isset($zoneItems[$client->client_alias_id])) {
                $item = WhiteboardItem::create([
                    'whiteboard_id' => $whiteboard->whiteboard_id,
                    'item_type'     => 'client_zone',
                    'item_id'       => $client->client_alias_id,
                    'pos_x'         => 40 + ($i % 4) * 200,
                    'pos_y'         => 40 + intdiv($i, 4) * 320,
                    'on_board'      => true,
                    'meta'          => [
                        'color_index' => $i % count($zoneColors),
                        'label'       => $client->client_alias_name,
                    ],
                ]);
                $zoneItems[$client->client_alias_id] = $item;
            } else {
                // metaがない場合はデフォルト値を補完
                $item = $zoneItems[$client->client_alias_id];
                if (empty($item->meta)) {
                    $item->update([
                        'meta' => [
                            'color_index' => $i % count($zoneColors),
                            'label'       => $client->client_alias_name,
                        ],
                    ]);
                    $zoneItems[$client->client_alias_id] = $item->fresh();
                }
            }
        }

        return view('whiteboard.org_chart.index', compact(
            'bases', 'whiteboard', 'staffList', 'clients', 'staffItems', 'zoneItems', 'baseId'
        ));
    }

    // ドラッグ完了時・座標保存
    public function updateItem(Request $request)
    {
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
            'item_type'     => 'nullable|string|in:staff,client_zone',  // 追加
            'item_id'       => 'required|integer',
            'pos_x'         => 'required|numeric',
            'pos_y'         => 'required|numeric',
            'on_board'      => 'required|boolean',
            'meta'          => 'nullable|array',
        ]);

        WhiteboardItem::updateOrCreate(
            [
                'whiteboard_id' => $validated['whiteboard_id'],
                'item_type'     => $validated['item_type'] ?? 'staff',  // 追加
                'item_id'       => $validated['item_id'],
            ],
            [
                'pos_x'    => $validated['pos_x'],
                'pos_y'    => $validated['pos_y'],
                'on_board' => $validated['on_board'],
                'meta'     => $validated['meta'] ?? null,
            ]
        );

        return response()->json(['status' => 'ok']);
    }

    // スタッフ追加
    public function storeStaff(Request $request)
    {
        $validated = $request->validate([
            'base_id' => 'required|string|exists:bases,base_id',
            'staff_name'    => 'required|string|max:50',
            'role_name'    => 'nullable|string|max:50',
            'color'   => 'nullable|integer|min:0|max:6',
        ]);

        $staff = Staff::create($validated);

        return response()->json(['status' => 'ok', 'staff' => $staff]);
    }

    // スタッフ削除
    public function deleteStaff(Request $request, Staff $staff)
    {
        $staff->delete();
        return response()->json(['status' => 'ok']);
    }

    public function updateStaff(Request $request, Staff $staff)
    {
        $validated = $request->validate([
            'staff_name'    => 'required|string|max:50',
            'role_name'     => 'nullable|string|max:50',
            'color'         => 'nullable|integer|min:0|max:6',
            'size'          => 'nullable|in:XS,S,M,L,XL',
            'shape'         => 'nullable|in:rect,circle,sharp,rounded_bottom,tab',
        ]);
        $staff->update($validated);
        return response()->json(['status' => 'ok']);
    }
}