<?php

namespace App\Services\Admin\FileImport;

// モデル
use App\Models\User;
use App\Models\FileImport;
// 列挙
use App\Enums\RoleEnum;
use App\Enums\GrantTypeEnum;
// その他
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Carbon\CarbonImmutable;

class UserCreateService
{
    // usersテーブルに存在しない従業員番号が取り込まれていれば、追加する
    public function createUser()
    {
        // Userに存在するemployee_noを取得
        $existing_employee_nos = User::pluck('employee_no')->toArray();
        // FileImportに存在するemployee_noを取得
        $import_employee_nos = FileImport::pluck('employee_no')->toArray();
        // Userに存在しないemployee_noを抽出
        $new_employee_nos = array_diff($import_employee_nos, $existing_employee_nos);
        // 新しいemployee_noがなければ終了
        if (empty($new_employee_nos)) return;
        // 新しいemployee_noの分だけループ
        foreach ($new_employee_nos as $employee_no) {
            // FileImportから該当レコードを取得
            $employee = FileImport::where('employee_no', $employee_no)->first();
            // 使用日数リセット年月を取得
            $used_days_reset_year_month = $this->getUsedDaysResetYearMonth($employee);
            // ランダムなログインパスワードを取得（英数字12桁）
            $password = Str::random(12);
            // Userに追加
            User::create([
                'employee_no'                   => $employee->employee_no,
                'user_name'                     => $employee->user_name,
                'work_days_per_week'            => $employee->work_days_per_week,
                'hire_date'                     => $employee->hire_date,
                'next_grant_year_month'         => $employee->next_grant_year_month,
                'used_days_reset_year_month'    => $used_days_reset_year_month,
                'grant_type'                    => GrantTypeEnum::NONE,
                'role_id'                       => RoleEnum::USER,
                'user_id'                       => $employee->employee_no,
                'password'                      => Hash::make('warm'.$employee->employee_no),
                'is_active'                     => true,
            ]);
        }
    }

    // 使用日数リセット年月を取得
    public function getUsedDaysResetYearMonth($employee)
    {
        // 入社日から半年後（1回目付与年月）を算出
        $first_grant = CarbonImmutable::parse($employee->hire_date)->addMonths(6)->startOfMonth();
        // 次の4月（2回目付与年月）を算出 ※1回目付与が4月以降なら翌年4月
        if($first_grant->month < 4){
            $second_grant = $first_grant->setMonth(4);
        }else{
            $second_grant = $first_grant->addYear()->setMonth(4);
        }
        // さらに次の4月（3回目付与＝リセット年月）
        return $second_grant->addYear()->format('Ym');
    }
}