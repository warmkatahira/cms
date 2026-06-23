<?php

namespace App\Http\Controllers\Whiteboard\Board;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\WhiteboardItem;
// イベント
use App\Events\WhiteboardUpdated;

class ZoneController extends Controller
{
    // グループ追加
    public function store(Request $request)
    {
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
            'label'         => 'required|string|max:50',
            'color_index'   => 'nullable|integer|min:0|max:4',
        ]);

        $item = WhiteboardItem::create([
            'whiteboard_id' => $validated['whiteboard_id'],
            'item_type'     => 'zone',
            'item_id'       => 0,
            'pos_x'         => 40,
            'pos_y'         => 40,
            'meta'          => [
                'color_index' => $validated['color_index'] ?? 0,
                'label'       => $validated['label'],
                'width'       => 180,
                'height'      => 280,
            ],
        ]);

        // item_idをwhiteboard_item_idと同じにする
        $item->update(['item_id' => $item->whiteboard_item_id]);

        broadcast(new WhiteboardUpdated(
            whiteboardId: $validated['whiteboard_id'],
            action:       'zone.added',
            payload:      $item->toArray(),
        ));

        return response()->json(['status' => 'ok', 'item' => $item]);
    }

    // グループ削除
    public function destroy(Request $request, WhiteboardItem $item)
    {
        $whiteboardId = $item->whiteboard_id;
        $zoneId       = $item->whiteboard_item_id;
        $item->delete();
        broadcast(new WhiteboardUpdated(
            whiteboardId: $whiteboardId,
            action:       'zone.deleted',
            payload:      ['zoneId' => $zoneId],
        ));
        return response()->json(['status' => 'ok']);
    }
}