<?php

namespace App\Services\SystemAdmin\User;

// モデル
use App\Models\User;
// 列挙
use App\Enums\SystemEnum;
// その他
use App\Mail\UserCreateNotificationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserCreateService
{
    // ユーザーを追加
    public function createUser($request)
    {
        // 初期ログインパスワードを取得（英数字12桁）
        $password = Str::random(12);
        // ユーザーを追加
        $user = User::create([
            'status'                                        => $request->status,
            'base_id'                                       => $request->base_id,
            'employee_no'                                   => $request->employee_no,
            'user_name'                                     => $request->user_name,
            'user_id'                                       => $request->user_id,
            'is_auto_update_statutory_leave_remaining_days' => $request->is_auto_update_statutory_leave_remaining_days,
            'role_id'                                       => $request->role_id,
            'password'                                      => Hash::make($password),
        ]);
        // アカウント発行通知メールを送信
        $this->sendMail($user, $password);
    }

    // アカウント発行通知メールを送信
    public function sendMail($user, $password)
    {
        // +-+-+-+-+-+-+-+-+-+-   アカウント発行通知メール   +-+-+-+-+-+-+-+-+-+-
        // インスタンス化
        $mail = new UserCreateNotificationMail($user, $password);
        // Toを設定
        $mail->to(Auth::user()->email);
        // 件名を設定
        $mail->subject('【'.SystemEnum::getSystemTitle().'】ユーザー追加通知');
        // メールを送信
        Mail::send($mail);
        // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    }
}