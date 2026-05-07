<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// サービス
use App\Services\Profile\ProfileUpdateService;
// リクエスト
use App\Http\Requests\Profile\ProfileUpdateRequest;

class ProfileUpdateController extends Controller
{
    public function update(ProfileUpdateRequest $request)
    {
        try{
            // インスタンス化
            $ProfileUpdateService = new ProfileUpdateService;
            // プロフィールを更新
            $ProfileUpdateService->updateProfile($request);
        }catch (\Exception $e){
            return redirect()->back()->with([
                'alert_type' => 'error',
                'alert_message' => 'プロフィールの更新に失敗しました。',
            ]);
        }
        return redirect()->back()->with([
            'alert_type' => 'success',
            'alert_message' => 'プロフィールを更新しました。',
        ]);
    }
}