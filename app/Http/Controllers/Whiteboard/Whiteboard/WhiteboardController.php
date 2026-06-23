<?php

namespace App\Http\Controllers\Whiteboard\Whiteboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\User;
use App\Models\Whiteboard;

class WhiteboardController extends Controller
{
    // 一覧
    public function index()
    {
        session(['page_header' => 'ホワイトボード']);
        // 自分のユーザーNoを取得
        $userNo = auth()->user()->user_no;
        // 自分が参加者になっているホワイトボードを取得
        $whiteboards = Whiteboard::whereHas('users', function ($q) use ($userNo) {
                                $q->where('user_whiteboard.user_no', $userNo);
                            })
                            ->with(['users', 'createdBy'])
                            ->latest()
                            ->get();
        // 有効なユーザーを取得
        $users = User::where('is_active', true)->ordered()->get();
        return view('whiteboard.whiteboard.index', compact('whiteboards', 'users'));
    }

    // 作成
    public function store(Request $request)
    {
        // バリデーションを実施
        $validated = $request->validate([
            'title'      => 'required|string|max:100',
            'user_nos'   => 'required|array|min:1',
            'user_nos.*' => 'exists:users,user_no',
        ]);
        // 作成
        $whiteboard = Whiteboard::create([
            'title'      => $validated['title'],
            'canvas_w'   => config('whiteboard.canvas_w'),
            'canvas_h'   => config('whiteboard.canvas_h'),
            'created_by' => auth()->user()->user_no,
        ]);
        // 参加者のユーザーNoを取得
        $userNos = collect($validated['user_nos']);
        // 作成者が含まれていない場合
        if(!$userNos->contains(auth()->user()->user_no)){
            // 作成者を追加
            $userNos->push(auth()->user()->user_no);
        }
        // 参加者テーブルを追加
        $whiteboard->users()->attach($userNos->toArray());
        return response()->json(['status' => 'ok', 'whiteboard_id' => $whiteboard->whiteboard_id]);
    }

    // 削除
    public function destroy(Whiteboard $whiteboard)
    {
        // 自分のユーザーNoを取得
        $userNo = auth()->user()->user_no;
        // 自分が作成していないボードの場合
        if ($whiteboard->created_by !== $userNo) {
            // 例外を投げる
            abort(403);
        }
        // ボードを削除
        $whiteboard->delete();
        return response()->json(['status' => 'ok']);
    }

    // タイトル更新
    public function updateTitle(Request $request, Whiteboard $whiteboard)
    {
        // 自分のユーザーNoを取得
        $userNo = auth()->user()->user_no;
        // 自分が参加者ではないボードの場合
        if (!$whiteboard->users()->where('user_whiteboard.user_no', $userNo)->exists()) {
            // 例外を投げる
            abort(403);
        }
        // バリデーションを実施
        $validated = $request->validate([
            'title' => 'required|string|max:50',
        ]);
        // 更新
        $whiteboard->update($validated);
        return response()->json(['status' => 'ok']);
    }

    // 参加者更新
    public function updateUsers(Request $request, Whiteboard $whiteboard)
    {
        // 自分のユーザーNoを取得
        $userNo = auth()->user()->user_no;
        // 自分が参加者ではないボードの場合
        if (!$whiteboard->users()->where('user_whiteboard.user_no', $userNo)->exists()) {
            // 例外を投げる
            abort(403);
        }
        // バリデーションを実施
        $validated = $request->validate([
            'user_nos'   => 'required|array|min:1',
            'user_nos.*' => 'exists:users,user_no',
        ]);
        // 参加者のユーザーNoを取得
        $userNos = collect($validated['user_nos']);
        // 作成者が含まれていない場合
        if ($whiteboard->created_by && !$userNos->contains($whiteboard->created_by)) {
            // 作成者を追加
            $userNos->push($whiteboard->created_by);
        }
        // 同期
        $whiteboard->users()->sync(
            $userNos->mapWithKeys(fn($no) => [$no => []])->toArray()
        );
        return response()->json(['status' => 'ok']);
    }
}