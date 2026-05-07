<?php

namespace App\Services\Admin\FileImport;

// モデル
use App\Models\User;
use App\Models\FileImport;

class UserUpdateService
{
    // usersテーブルに存在していて今回の取り込みに存在していない従業員のis_activeを無効に更新
    public function deactivateMissingEmployees()
    {
        // Userに存在するemployee_noを取得
        $existing_employee_nos = User::pluck('employee_no')->toArray();
        // FileImportに存在するemployee_noを取得
        $import_employee_nos = FileImport::pluck('employee_no')->toArray();
        // Userに存在してFileImportに存在しないemployee_noを抽出
        $missing_employee_nos = array_diff($existing_employee_nos, $import_employee_nos);
        // 該当する従業員がいなければ終了
        if (empty($missing_employee_nos)) return;
        // 該当する従業員の情報を取得
        $missing_employees = User::whereIn('employee_no', $missing_employee_nos)
                                ->get(['employee_no', 'user_name']);
        // is_activeを無効に更新
        User::whereIn('employee_no', $missing_employee_nos)->update(['is_active' => false]);
        // 従業員番号と氏名をメッセージ用に整形して返す
        return $missing_employees->map(fn($e) => "{$e->employee_no}：{$e->user_name}")->implode("\n");
    }
}