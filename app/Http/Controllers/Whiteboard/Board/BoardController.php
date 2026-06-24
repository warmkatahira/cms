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
        // 自分のユーザーNoを取得
        $userNo = auth()->user()->user_no;
        // whiteboard_idを取得
        $whiteboardId = $request->get('whiteboard_id');
        // whiteboard_idが取得できない場合
        if (!$whiteboardId) {
            // 一覧へリダイレクト
            return redirect()->route('whiteboard.index');
        }
        // 自分が参加者として登録されているホワイトボードのみ取得
        $whiteboard = Whiteboard::whereHas('users', function ($q) use ($userNo) {
                            $q->where('user_whiteboard.user_no', $userNo);
                        })
                        ->findOrFail($whiteboardId);
        // ホワイトボードに存在するアイテム区分を取得
        $itemsByType = $whiteboard->items()->get()->groupBy('item_type');
        // アイテム区分毎のデータを各変数に格納（存在しない場合は空を格納）
        $staffItems = $itemsByType->get('staff', collect());
        $zoneItems  = $itemsByType->get('zone',  collect());
        $textItems  = $itemsByType->get('text',  collect());
        $shapeItems = $itemsByType->get('shape', collect());
        $imageItems = $itemsByType->get('image', collect());
        return view('whiteboard.board.index', compact(
            'whiteboard', 'staffItems', 'zoneItems', 'textItems', 'shapeItems', 'imageItems'
        ));
    }

    public function clear(Request $request)
    {
        // バリデーションを実施
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
        ]);
        // whiteboard_idを取得
        $whiteboardId = $validated['whiteboard_id'];
        // 画像ファイルを取得
        $imageItems = WhiteboardItem::where('whiteboard_id', $whiteboardId)
                        ->where('item_type', 'image')
                        ->get();
        // 画像ファイルの分だけループ処理
        foreach ($imageItems as $img) {
            // 画像パスを取得
            $src = $img->meta['src'] ?? '';
            // パスから文字列を削除
            $disk = str_replace('/storage/', '', $src);
            // 画像ファイルを削除
            Storage::disk('public')->delete($disk);
        }
        // ホワイトボードを削除
        WhiteboardItem::where('whiteboard_id', $whiteboardId)->delete();
        return response()->json(['status' => 'ok']);
    }
}