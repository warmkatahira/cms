<?php

namespace App\Services\Admin\FileImport;

// モデル
use App\Models\User;
use App\Models\FileImport;
// 列挙
use App\Enums\GrantRequiredDaysEnum;
use App\Enums\GrantTypeEnum;
// その他
use Carbon\CarbonImmutable;

class PaidLeaveUpdateService
{
    // 付与月ではない従業員の使用日数をカウントアップ
    public function incrementUsedDays()
    {
        // 付与月ではない従業員を取得(次回付与年月が現状と一致=付与月ではないという判断)
        $non_grant_employees = User::join('file_imports', 'users.employee_no', '=', 'file_imports.employee_no')
                                    ->whereColumn('users.next_grant_year_month', '=', 'file_imports.next_grant_year_month')
                                    ->select('users.employee_no', 'file_imports.used_days')
                                    ->get();
        // 従業員をループ処理
        foreach($non_grant_employees as $employee){
            // 使用日数をカウントアップ
            User::where('employee_no', $employee->employee_no)
                    ->increment('used_days', (float) $employee->used_days);
        }
    }

    // 付与月の従業員の処理
    public function processGrantMonth()
    {
        // 付与月の従業員を取得(次回付与年月が現状と一致しない=付与月という判断)
        $grant_employees = User::join('file_imports', 'users.employee_no', '=', 'file_imports.employee_no')
                                    ->whereColumn('users.next_grant_year_month', '!=', 'file_imports.next_grant_year_month')
                                    ->select('file_imports.*')
                                    ->get();
        // 従業員をループ処理
        foreach($grant_employees as $employee){
            // 対象の従業員を取得
            $user = User::where('employee_no', $employee->employee_no)->lockForUpdate()->first();
            // 次回付与年月の更新
            $this->updateNextGrantYearMonth($user, $employee);
            // 使用日数リセット日の更新と使用日数のリセット
            $this->updateUsedDaysInfo($user, $employee);
            // 週所定労働日数の更新
            $this->updateWorkDaysPerWeek($user, $employee);
            // 繰越と当年の保有日数を更新
            $this->updatePaidLeaveDays($user, $employee);
            // 義務日数関連の更新（現在のgrant_typeで分岐）
            $this->updateRequiredDays($user, $employee);
            // 付与区分の更新
            $this->updateGrantType($user);

            // 

            // 更新値を保存
            $user->save();
        }
    }

    // 次回付与年月の更新
    public function updateNextGrantYearMonth($user, $employee)
    {
        // 次回付与年月の更新
        $user->next_grant_year_month = $employee->next_grant_year_month;
    }

    // 使用日数リセット日の更新と使用日数のリセット
    public function updateUsedDaysInfo($user, $employee)
    {
        // target_year_monthの翌月を算出
        $next_year_month = CarbonImmutable::createFromFormat('Ym', $employee->target_year_month)
                                ->addMonth()
                                ->format('Ym');
        // target_year_monthの翌月が使用日数リセット年月と一致する場合
        if($next_year_month === $user->used_days_reset_year_month){
            // 使用日数リセット日を更新(次回付与年月で更新)
            $user->used_days_reset_year_month = $employee->next_grant_year_month;
            // 使用日数を0にリセット
            $user->used_days = 0;
        }
    }

    // 週所定労働日数の更新
    public function updateWorkDaysPerWeek($user, $employee)
    {
        // 週所定労働日数の更新
        $user->work_days_per_week = $employee->work_days_per_week;
    }

    // 繰越と当年の保有日数を更新
    public function updatePaidLeaveDays($user, $employee)
    {
        // 繰越保有日数を更新
        $user->carried_over_days = $employee->carried_over_remaining_days;
        // 当年保有日数を更新
        $user->granted_days = $employee->granted_remaining_days;
    }

    // 義務日数関連の更新（現在のgrant_typeで分岐）
    public function updateRequiredDays($user, $employee)
    {
        // 義務期限を算出(次回付与年月の1ヶ月前の月末)
        $required_deadline = CarbonImmutable::createFromFormat('Ym', $employee->next_grant_year_month)
                                    ->subMonth()
                                    ->endOfMonth()
                                    ->toDateString();
        // 今回で10日以上付与される人（義務あり）
        if($employee->granted_remaining_days >= 10){
            match ($user->grant_type) {
                // 1回目：按分義務日数-5を当年義務日数に設定
                GrantTypeEnum::NONE => (function() use ($user, $employee, $required_deadline) {
                    // 入社日から入社月だけを抽出
                    $hire_month = CarbonImmutable::parse($user->hire_date)->month;
                    // 義務期限を更新
                    $user->required_deadline = $required_deadline;
                    // 按分義務日数を取得
                    $prorated_days = GrantRequiredDaysEnum::fromMonth($hire_month)->days();
                    // 按分義務日数が0の場合（10月入社）はここで終了
                    if ($prorated_days === 0) return;
                    // 按分義務日数から-5する（-5した分は次の付与で義務となる5日分）
                    $user->granted_required_days = $prorated_days - 5;
                })(),
                // 2回目：当年義務日数を繰越義務日数に移動、当年義務日数を5に
                GrantTypeEnum::FIRST => (function() use ($user, $required_deadline) {
                    // 移動前の値を保持（=1回目の義務日数）
                    $carried = $user->granted_required_days;
                    // 当年義務日数を繰越義務日数に更新
                    $user->carried_over_required_days = $carried;
                    // 当年義務日数を5に更新
                    $user->granted_required_days = 5;
                    // 1回目が義務あり（carried > 0）なら使用日数で義務達成チェック
                    if($carried){
                        // 義務残日数を取得
                        $remaining_required = $carried - $user->used_days;
                        // 義務残日数がない場合
                        if($remaining_required <= 0){
                            $user->carried_over_required_days = 0;
                        // 義務未達 → 繰越義務日数を残日数に更新
                        }else{
                            $user->carried_over_required_days = $remaining_required;
                        }
                        $user->used_days = 0;
                        $user->required_deadline = $required_deadline;
                    // 1回目が義務なし（carried = 0）なら使用日数をリセット
                    }else{
                        $user->used_days = 0;
                        $user->required_deadline = $required_deadline;
                    }
                })(),
                // 3回目以上：繰越義務日数をリセット、当年を5に
                GrantTypeEnum::SECOND,
                GrantTypeEnum::THIRDORMORE => (function() use ($user, $required_deadline) {
                    // 繰越義務日数をリセット
                    $user->carried_over_required_days = 0;
                    // 当年義務日数を5に更新
                    $user->granted_required_days = 5;
                    // 義務期限を更新
                    $user->required_deadline = $required_deadline;
                })(),
            };
        // 9日以下付与される人（義務なし）
        } else {
            match ($user->grant_type) {
                // 1回目：何もしない
                GrantTypeEnum::NONE => null,
                // 2回目：当年義務日数を繰越義務日数に移動、義務期限をリセット
                GrantTypeEnum::FIRST => (function() use ($user, $required_deadline) {
                    // 移動前の値を保持
                    $carried = $user->granted_required_days;
                    // 当年義務日数を繰越義務日数に更新
                    $user->carried_over_required_days = $carried;
                    // 当年義務日数をリセット
                    $user->granted_required_days = 0;
                    // 1回目が義務あり（carried > 0）なら使用日数で義務達成チェック
                    if($carried){
                        // 義務残日数を取得
                        $remaining_required = $carried - $user->used_days;
                        // 義務達成 → 使用日数と期限をリセット
                        if($remaining_required <= 0){
                            $user->used_days = 0;
                            $user->carried_over_required_days = 0;
                            $user->required_deadline = null;
                        // 義務未達 → 使用日数をリセット、繰越義務日数を減らす
                        }else{
                            $user->carried_over_required_days = $remaining_required;
                            $user->used_days = 0;
                        }
                    }
                })(),
                // 3回目以上：繰越・当年義務日数・義務期限をリセット
                GrantTypeEnum::SECOND,
                GrantTypeEnum::THIRDORMORE => (function() use ($user) {
                    // 繰越・当年義務日数・義務期限をリセット
                    $user->carried_over_required_days = 0;
                    $user->granted_required_days = 0;
                    $user->required_deadline = null;
                })(),
            };
        }
    }

    // 付与区分の更新
    public function updateGrantType($user)
    {
        // 付与区分の更新
        $user->grant_type = min($user->grant_type->value + 1, GrantTypeEnum::THIRDORMORE->value);
    }
}