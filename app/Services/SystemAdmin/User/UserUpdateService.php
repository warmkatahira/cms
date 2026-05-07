<?php

namespace App\Services\SystemAdmin\User;

// モデル
use App\Models\User;

class UserUpdateService
{
    // ユーザーを更新
    public function updateUser($request)
    {
        // ユーザーを取得
        $user = User::where('user_no', $request->user_no)->lockForUpdate()->first();
        // 更新
        $user->update([
            'status'                                        => $request->status,
            'base_id'                                       => $request->base_id,
            'employee_no'                                   => $request->employee_no,
            'user_name'                                     => $request->user_name,
            'is_auto_update_statutory_leave_remaining_days' => $request->is_auto_update_statutory_leave_remaining_days,
            'role_id'                                       => $request->role_id,
        ]);
    }
}