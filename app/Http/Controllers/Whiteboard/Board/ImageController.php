<?php

namespace App\Http\Controllers\Whiteboard\Board;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\WhiteboardItem;
// イベント
use App\Events\WhiteboardUpdated;
// その他
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function store(Request $request)
    {
        // バリデーションを実施
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
            'image'         => 'required|image|max:5120',
        ]);
        // 画像をストレージに保存
        $path = $request->file('image')->store('whiteboard_images', 'public');
        // アイテムを追加
        $item = WhiteboardItem::create([
            'whiteboard_id' => $validated['whiteboard_id'],
            'item_type'     => 'image',
            'item_id'       => 0,
            'pos_x'         => 40,
            'pos_y'         => 40,
            'meta'          => [
                'src'    => '/storage/' . $path,
                'width'  => 200,
                'height' => 200,
            ],
        ]);
        // item_idを採番（whiteboard_item_idと同値にする）
        $item->update(['item_id' => $item->whiteboard_item_id]);
        // 他の参加者にリアルタイム通知
        broadcast(new WhiteboardUpdated(
            whiteboardId: $validated['whiteboard_id'],
            action:       'image.added',
            payload:      $item->toArray(),
        ))->toOthers();
        return response()->json(['status' => 'ok', 'item' => $item]);
    }

    public function destroy(WhiteboardItem $item)
    {
        // 削除対象の情報を取得
        $whiteboardId = $item->whiteboard_id;
        $itemId       = $item->whiteboard_item_id;
        $src          = $item->meta['src'] ?? '';
        // アイテムを削除
        $item->delete();
        // 同じ画像を参照する他のアイテムがなければファイル削除
        $otherExists = WhiteboardItem::where('item_type', 'image')
                            ->where('meta->src', $src)
                            ->exists();
        // 同じ画像を参照する他アイテムがなく、画像パスが取得できている場合
        if (!$otherExists && $src) {
            // ファイル削除
            $disk = str_replace('/storage/', '', $src);
            Storage::disk('public')->delete($disk);
        }
        // 他の参加者にリアルタイム通知
        broadcast(new WhiteboardUpdated(
            whiteboardId: $whiteboardId,
            action:       'image.deleted',
            payload:      ['itemId' => $itemId],
        ));
        return response()->json(['status' => 'ok']);
    }

    public function copy(Request $request)
    {
        // バリデーションを実施
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
            'src'           => 'required|string',
            'width'         => 'nullable|numeric',
            'height'        => 'nullable|numeric',
        ]);
        // 同じ画像を参照する新規アイテムを登録（ファイルはコピーしない）
        $item = WhiteboardItem::create([
            'whiteboard_id' => $validated['whiteboard_id'],
            'item_type'     => 'image',
            'item_id'       => 0,
            'pos_x'         => 40,
            'pos_y'         => 40,
            'meta'          => [
                'src'    => $validated['src'],
                'width'  => $validated['width'] ?? 200,
                'height' => $validated['height'] ?? 200,
            ],
        ]);
        // item_idを採番（whiteboard_item_idと同値にする）
        $item->update(['item_id' => $item->whiteboard_item_id]);
        return response()->json(['status' => 'ok', 'item' => $item]);
    }
}