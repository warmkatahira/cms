<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    // 主キーカラムを変更
    protected $primaryKey = 'client_id';
    // 操作可能なカラムを定義
    protected $fillable = [
        'client_code',
        'client_name',
        'client_postal_code',
        'client_address',
        'client_tel',
        'client_image_file_name',
        'sort_order',
        'is_active',
        'updated_by',
    ];
    // usersテーブルとのリレーション
    public function user()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_no');
    }
    // client_aliasesテーブルとのリレーション
    public function clientAliases()
    {
        return $this->hasMany(ClientAlias::class, 'client_id', 'client_id');
    }
    // 「is_active」に基づいて、有効 or 無効を返すアクセサ
    public function getIsActiveTextAttribute(): string
    {
        return $this->is_active ? '有効' : '無効';
    }
    // 顧客単位のダウンロード時のヘッダーを定義
    public static function downloadHeaderByClient()
    {
        return [
            'ステータス',
            '顧客名',
            '顧客郵便番号',
            '顧客住所',
            '顧客電話番号',
            '担当営業所/エイリアス名/担当従業員',
            '最終更新者',
            '最終更新日時',
        ];
    }
    // エイリアス単位のダウンロード時のヘッダーを定義
    public static function downloadHeaderByAlias()
    {
        return [
            'ステータス',
            '顧客名',
            '顧客郵便番号',
            '顧客住所',
            '顧客電話番号',
            '担当営業所',
            'エイリアス名',
            '担当従業員',
            '最終更新者',
            '最終更新日時',
        ];
    }
}
