<?php

namespace App\Http\Controllers\Whiteboard\Board;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\WhiteboardItem;
// イベント
use App\Events\WhiteboardUpdated;

class ShapeController extends Controller
{
    public function store(Request $request)
    {
        // バリデーションを実施
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
            'shape_type'    => 'required|string|in:rect,circle,triangle,line,arrow,star,double-arrow',
        ]);
        // アイテムを追加
        $item = WhiteboardItem::create([
            'whiteboard_id' => $validated['whiteboard_id'],
            'item_type'     => 'shape',
            'item_id'       => 0,
            'pos_x'         => 40,
            'pos_y'         => 40,
            'meta' => [
                'shape_type'   => $validated['shape_type'],
                'fill_color'   => '#93c5fd',
                'stroke_color' => '#2563eb',
                'width'        => 120,
                'height'       => 120,
                'rotation'     => 0,
            ],
        ]);
        // item_idを採番（whiteboard_item_idと同値にする）
        $item->update(['item_id' => $item->whiteboard_item_id]);
        // 他の参加者にリアルタイム通知
        broadcast(new WhiteboardUpdated(
            whiteboardId: $validated['whiteboard_id'],
            action:       'shape.added',
            payload:      $item->toArray(),
        ))->toOthers();
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
            action:       'shape.deleted',
            payload:      ['itemId' => $itemId],
        ));
        return response()->json(['status' => 'ok']);
    }
}