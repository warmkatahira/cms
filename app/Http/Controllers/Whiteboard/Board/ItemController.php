<?php

namespace App\Http\Controllers\Whiteboard\Board;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\WhiteboardItem;
// イベント
use App\Events\WhiteboardUpdated;

class ItemController extends Controller
{
    // ドラッグ完了時・座標保存
    public function updateItem(Request $request)
    {
        // バリデーションを実施
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
            'item_type'     => 'nullable|string|in:staff,zone,text,shape,image',
            'item_id'       => 'required|integer',
            'pos_x'         => 'required|numeric',
            'pos_y'         => 'required|numeric',
            'meta'          => 'nullable|array',
        ]);
        // 追加または更新
        WhiteboardItem::updateOrCreate(
            [
                'whiteboard_id' => $validated['whiteboard_id'],
                'item_type'     => $validated['item_type'] ?? 'staff',
                'item_id'       => $validated['item_id'],
            ],
            [
                'pos_x'    => $validated['pos_x'],
                'pos_y'    => $validated['pos_y'],
                'meta'     => $validated['meta'] ?? null,
            ]
        );
        // 他の参加者にリアルタイム通知
        broadcast(new WhiteboardUpdated(
            whiteboardId: $validated['whiteboard_id'],
            action:       'item.updated',
            payload:      [
                'itemType' => $validated['item_type'] ?? 'staff',
                'itemId'   => $validated['item_id'],
                'posX'     => $validated['pos_x'],
                'posY'     => $validated['pos_y'],
                'meta'     => $validated['meta'] ?? null,
            ],
        ));
        return response()->json(['status' => 'ok']);
    }
}