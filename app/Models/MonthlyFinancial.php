<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlyFinancial extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'monthly_financial_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'client_alias_id',
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
}
