<?php

namespace App\Http\Controllers\Whiteboard\Board;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\WhiteboardItem;
// イベント
use App\Events\WhiteboardUpdated;

class TextController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
            'text'          => 'required|string|max:500',
        ]);

        $item = WhiteboardItem::create([
            'whiteboard_id' => $validated['whiteboard_id'],
            'item_type'     => 'text',
            'item_id'       => 0,
            'pos_x'         => 40,
            'pos_y'         => 40,
            'on_board'      => true,
            'meta'          => [
                'text'      => $validated['text'],
                'font_size' => 14,
                'color'     => '#374151',
                'width'     => 200,
                'height'    => 100,
            ],
        ]);

        $item->update(['item_id' => $item->whiteboard_item_id]);

        broadcast(new WhiteboardUpdated(
            whiteboardId: $validated['whiteboard_id'],
            action:       'text.added',
            payload:      $item->toArray(),
        ))->toOthers();

        return response()->json(['status' => 'ok', 'item' => $item]);
    }

    public function destroy(Request $request, WhiteboardItem $item)
    {
        $whiteboardId = $item->whiteboard_id;
        $itemId       = $item->whiteboard_item_id;
        $item->delete();

        broadcast(new WhiteboardUpdated(
            whiteboardId: $whiteboardId,
            action:       'text.deleted',
            payload:      ['itemId' => $itemId],
        ));

        return response()->json(['status' => 'ok']);
    }
}