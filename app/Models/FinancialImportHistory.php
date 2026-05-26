<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialImportHistory extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'financial_import_history_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'importOriginalFileName',
        'errorFileName',
        'message',
        'imported_by',
    ];
    // usersテーブルとのリレーション
    public function user()
    {
        return $this->belongsTo(User::class, 'imported_by', 'user_no');
    }
}
