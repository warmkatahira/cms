<?php

namespace App\Http\Controllers\Whiteboard\Board;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Whiteboard;
use App\Models\WhiteboardItem;
// イベント
use App\Events\WhiteboardUpdated;
// その他
use Illuminate\Support\Facades\Storage;

class BoardController extends Controller
{
    public function index(Request $request)
    {
        session(['page_header' => 'ホワイトボード編集']);

        $userNo = auth()->user()->user_no;

        // whiteboard_idが指定されている場合はそのボードを開く
        $whiteboardId = $request->get('whiteboard_id');

        if (!$whiteboardId) {
            return redirect()->route('whiteboard.index');
        }

        // 参加者のみアクセス可能
        $whiteboard = Whiteboard::whereHas('users', function ($q) use ($userNo) {
                            $q->where('user_whiteboard.user_no', $userNo);
                        })
                        ->findOrFail($whiteboardId);

        // スタッフの座標
        $staffItems = $whiteboard->items()->where('item_type', 'staff')->get();

        // zone の座標
        $zoneItems = $whiteboard->items()
                            ->where('item_type', 'zone')
                            ->get()
                            ->keyBy('item_id');

        // text の座標
        $textItems = $whiteboard->items()
                        ->where('item_type', 'text')
                        ->get();

        // hape の座標
        $shapeItems = $whiteboard->items()
                ->where('item_type', 'shape')
                ->get();

        // image の座標
        $imageItems = $whiteboard->items()
                ->where('item_type', 'image')
                ->get();

        return view('whiteboard.board.index', compact(
            'whiteboard', 'staffItems', 'zoneItems', 'textItems', 'shapeItems', 'imageItems'
        ));
    }

    public function clear(Request $request)
    {
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
        ]);

        $whiteboardId = $validated['whiteboard_id'];

        // 画像ファイル削除
        $imageItems = \App\Models\WhiteboardItem::where('whiteboard_id', $whiteboardId)
            ->where('item_type', 'image')
            ->get();
        foreach ($imageItems as $img) {
            $src = $img->meta['src'] ?? '';
            $disk = str_replace('/storage/', '', $src);
            Storage::disk('public')->delete($disk);
        }

        WhiteboardItem::where('whiteboard_id', $whiteboardId)->delete();

        return response()->json(['status' => 'ok']);
    }
}