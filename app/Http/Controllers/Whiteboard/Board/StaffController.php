<?php

namespace App\Http\Controllers\Whiteboard\Board;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\WhiteboardItem;
// イベント
use App\Events\WhiteboardUpdated;

class StaffController extends Controller
{
    // スタッフ追加
    public function store(Request $request)
    {
        // バリデーションを実施
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
            'staff_name'    => 'required|string|max:50',
            'role_name'     => 'nullable|string|max:50',
            'color'         => 'nullable|integer|min:0|max:9',
        ]);
        // アイテムを追加
        $item = WhiteboardItem::create([
            'whiteboard_id' => $validated['whiteboard_id'],
            'item_type'     => 'staff',
            'item_id'       => 0,
            'pos_x'         => 40,
            'pos_y'         => 40,
            'meta'          => [
                'staff_name' => $validated['staff_name'],
                'role_name'  => $validated['role_name'] ?? '',
                'color'      => $validated['color'] ?? 0,
                'shape'      => 'rect',
                'width'      => 90,
                'height'     => 40,
            ],
        ]);
        // item_idを採番（whiteboard_item_idと同値にする）
        $item->update(['item_id' => $item->whiteboard_item_id]);
        // 他の参加者にリアルタイム通知
        broadcast(new WhiteboardUpdated(
            whiteboardId: $validated['whiteboard_id'],
            action:       'staff.added',
            payload:      $item->toArray(),
        ));
        return response()->json(['status' => 'ok', 'item' => $item]);
    }

    public function destroy(WhiteboardItem $item)
    {
        // 削除対象の情報を取得
        $whiteboardId = $item->whiteboard_id;
        $itemId       = $item->whiteboard_item_id;
        // 削除
        $item->delete();
        // 他の参加者にリアルタイム通知
        broadcast(new WhiteboardUpdated(
            whiteboardId: $whiteboardId,
            action:       'staff.deleted',
            payload:      ['staffId' => $itemId],
        ));
        return response()->json(['status' => 'ok']);
    }
}