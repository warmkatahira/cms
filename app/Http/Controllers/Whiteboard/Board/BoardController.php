<?php

namespace App\Http\Controllers\Whiteboard\Board;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Whiteboard;
use App\Models\Staff;
// イベント
use App\Events\WhiteboardUpdated;

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

        // zone の座標
        $zoneItems = $whiteboard->items()
                            ->where('item_type', 'zone')
                            ->get()
                            ->keyBy('item_id');

        // text の座標
        $textItems = $whiteboard->items()
                        ->where('item_type', 'text')
                        ->get();

        $shapeItems = $whiteboard->items()
                ->where('item_type', 'shape')
                ->get();

        return view('whiteboard.board.index', compact(
            'whiteboard', 'staffList', 'staffItems', 'zoneItems', 'textItems', 'shapeItems'
        ));
    }

    public function clear(Request $request)
    {
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
        ]);

        $whiteboardId = $validated['whiteboard_id'];

        // スタッフ削除
        \App\Models\Staff::where('whiteboard_id', $whiteboardId)->delete();

        // アイテム全削除（ゾーン・テキスト・図形）
        \App\Models\WhiteboardItem::where('whiteboard_id', $whiteboardId)->delete();

        return response()->json(['status' => 'ok']);
    }
}