<?php

namespace App\Services\Profile;

// モデル
use App\Models\User;
// その他
use Illuminate\Support\Facades\Auth;

class ProfileUpdateService
{
    // プロフィールを更新
    public function updateProfile($request)
    {
        User::where('user_no', $request->user_no)->update([
            'last_name'     => $request->last_name,
            'first_name'    => $request->first_name,
            'email'         => $request->email,
            'per_page'      => $request->per_page,
        ]);
    }
}