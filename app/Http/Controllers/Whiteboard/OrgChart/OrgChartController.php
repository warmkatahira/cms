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
        // ページヘッダーをセッションに格納
        session(['page_header' => '組織図']);
        $bases  = Base::ordered()->get();
        $baseId = $request->get('base_id', $bases->first()?->base_id);

        // 営業所ごとにボードを1枚自動生成
        $whiteboard = Whiteboard::firstOrCreate(
            ['base_id' => $baseId, 'board_type' => 'staff_map'],
            [
                'title'    => (Base::find($baseId)?->base_name ?? '未設定') . ' 組織図',
                'canvas_w' => 1200,
                'canvas_h' => 800,
            ]
        );

        $staffList = Staff::where('base_id', $baseId)
                          ->where('is_active', true)
                          ->get();

        $clients = ClientAlias::where('base_id', $baseId)->get();

        // staff.id をキーにしたアイテム一覧
        $items = $whiteboard->items()
                            ->where('item_type', 'staff')
                            ->get()
                            ->keyBy('item_id');

        return view('whiteboard.org_chart.index', compact(
            'bases', 'whiteboard', 'staffList', 'clients', 'items', 'baseId'
        ));
    }

    // ドラッグ完了時・座標保存
    public function updateItem(Request $request)
    {
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
            'item_id'       => 'required|integer',
            'pos_x'         => 'required|numeric',
            'pos_y'         => 'required|numeric',
            'on_board'      => 'required|boolean',
            'meta'          => 'nullable|array',
        ]);

        WhiteboardItem::updateOrCreate(
            [
                'whiteboard_id' => $validated['whiteboard_id'],
                'item_type'     => 'staff',
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