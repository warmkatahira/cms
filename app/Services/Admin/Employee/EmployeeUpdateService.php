<?php

namespace App\Services\Admin\Employee;

// モデル
use App\Models\User;

class EmployeeUpdateService
{
    // 従業員を更新
    public function updateEmployee($request)
    {
        // 従業員を更新
        User::where('user_no', $request->user_no)->update([
            'is_active' => $request->is_active,
        ]);
    }
}