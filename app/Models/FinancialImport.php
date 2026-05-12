<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialImport extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'financial_import_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'base_id',
        'base_name',
        'client_alias_name',
        'year_month',
        'sales_storage',
        'sales_handling',
        'sales_freight',
        'sales_other',
        'cost_storage',
        'cost_employee',
        'cost_part',
        'cost_temp',
        'cost_freight',
        'cost_other',
        'cost_hq',
    ];
    // インポートに必要なヘッダーを定義
    public static function requiredHeaders(): array
    {
        return [
            '営業所名',
            '荷主名',
            '年月',
            '保管売上',
            '荷役売上',
            '運賃売上',
            'その他売上',
            '保管経費',
            '社員人件費',
            'パート人件費',
            '派遣人件費・内職',
            '運賃経費',
            'その他経費',
            '本社管理費',
        ];
    }
}
