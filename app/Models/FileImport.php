<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileImport extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'file_import_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'employee_no',
        'user_name',
        'base_info',
        'work_days_per_week',
        'hire_date',
        'next_grant_year_month',
        'carried_over_remaining_days',
        'granted_remaining_days',
        'target_year_month',
        'used_days',
    ];
    // インポートに必要なヘッダーを定義(従業員データ)
    public static function requiredEmployeeHeaders(): array
    {
        return ['社員番号', '氏名', '部課', '有休付与パターン', '有休付与起算日', '次回付与月', '当月月初有休残日数繰越分', '当月月初有休残日数当年分'];
    }
    // インポートに必要なヘッダーを定義(有給データ)
    public static function requiredPaidLeaveHeaders(): array
    {
        return ['対象月', '社員番号', '有給休暇(日数)'];
    }
}
