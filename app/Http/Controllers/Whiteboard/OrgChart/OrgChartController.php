<?php

namespace App\Http\Controllers\Whiteboard\OrgChart;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Staff;
use App\Models\Whiteboard;
use App\Models\WhiteboardItem;

class OrgChartController extends Controller
{
    public function index(Request $request)
    {
        session(['page_header' => '組織図']);

        $userNo = auth()->user()->user_no;

        // whiteboard_idが指定されている場合はそのボードを開く
        $whiteboardId = $request->get('whiteboard_id');

        if (!$whiteboardId) {
            return redirect()->route('whiteboard.index');
        }

        // 参加者のみアクセス可能
        $whiteboard = Whiteboard::whereHas('users', function ($q) use ($userNo) {
                            $q->where('whiteboard_users.user_no', $userNo);
                        })
                        ->findOrFail($whiteboardId);

        $staffList = Staff::where('whiteboard_id', $whiteboard->whiteboard_id)
                        ->where('is_active', true)
                        ->get();

        // staff の座標
        $staffItems = $whiteboard->items()
                                ->where('item_type', 'staff')
                                ->get()
                                ->keyBy('item_id');

        // client_zone の座標
        $zoneItems = $whiteboard->items()
                                ->where('item_type', 'client_zone')
                                ->get()
                                ->keyBy('item_id');

        return view('whiteboard.org_chart.index', compact(
            'whiteboard', 'staffList', 'staffItems', 'zoneItems'
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
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
            'staff_name'    => 'required|string|max:50',
            'role_name'     => 'nullable|string|max:50',
            'color'         => 'nullable|integer|min:0|max:6',
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

    // グループ追加
    public function storeZone(Request $request)
    {
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
            'label'         => 'required|string|max:50',
            'color_index'   => 'nullable|integer|min:0|max:4',
        ]);

        $item = WhiteboardItem::create([
            'whiteboard_id' => $validated['whiteboard_id'],
            'item_type'     => 'client_zone',
            'item_id'       => 0, // 仮のID（後で更新）
            'pos_x'         => 40,
            'pos_y'         => 40,
            'on_board'      => true,
            'meta'          => [
                'color_index' => $validated['color_index'] ?? 0,
                'label'       => $validated['label'],
                'width'       => 180,
                'height'      => 280,
            ],
        ]);

        // item_idをwhiteboard_item_idと同じにする
        $item->update(['item_id' => $item->whiteboard_item_id]);

        return response()->json(['status' => 'ok', 'item' => $item]);
    }

    // グループ削除
    public function deleteZone(Request $request, WhiteboardItem $item)
    {
        $item->delete();
        return response()->json(['status' => 'ok']);
    }
}