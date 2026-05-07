<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImportHistory extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'import_history_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'import_employee_original_file_name',
        'import_paid_leave_original_file_name',
        'error_file_name',
        'message',
    ];
}
