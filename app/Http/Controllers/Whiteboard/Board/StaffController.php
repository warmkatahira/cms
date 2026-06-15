<?php

namespace App\Http\Controllers\Whiteboard\Board;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Staff;
// イベント
use App\Events\WhiteboardUpdated;

class StaffController extends Controller
{
    // スタッフ追加
    public function store(Request $request)
    {
        $validated = $request->validate([
            'whiteboard_id' => 'required|exists:whiteboards,whiteboard_id',
            'staff_name'    => 'required|string|max:50',
            'role_name'     => 'nullable|string|max:50',
            'color'         => 'nullable|integer|min:0|max:6',
        ]);

        $staff = Staff::create($validated);

        broadcast(new WhiteboardUpdated(
            whiteboardId: $staff->whiteboard_id,
            action:       'staff.added',
            payload:      $staff->toArray(),
        ));

        return response()->json(['status' => 'ok', 'staff' => $staff]);
    }

    // スタッフ削除
    public function destroy(Request $request, Staff $staff)
    {
        // staffテーブルのwhiteboard_idから直接取得
        $whiteboardId = $staff->whiteboard_id;

        $staff->delete();

        broadcast(new WhiteboardUpdated(
            whiteboardId: $whiteboardId,
            action:       'staff.deleted',
            payload:      ['staffId' => $staff->staff_id],
        ));

        return response()->json(['status' => 'ok']);
    }

    public function update(Request $request, Staff $staff)
    {
        $validated = $request->validate([
            'staff_name' => 'required|string|max:50',
            'role_name'  => 'nullable|string|max:50',
            'color'      => 'nullable|integer|min:0|max:6',
            'size'       => 'nullable|in:XS,S,M,L,XL',
            'shape'      => 'nullable|in:rect,circle,sharp,rounded_bottom,tab',
        ]);

        $staff->update($validated);

        // staffのwhiteboard_idから取得
        broadcast(new WhiteboardUpdated(
            whiteboardId: $staff->whiteboard_id,  // ← request→staffから取得
            action:       'staff.updated',
            payload:      $staff->fresh()->toArray(),
        ));

        return response()->json(['status' => 'ok']);
    }
}