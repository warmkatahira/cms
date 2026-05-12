<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialImportHistory extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'financial_import_history_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'import_original_file_name',
        'error_file_name',
        'message',
    ];
}
