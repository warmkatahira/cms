<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// 通知
use App\Notifications\UserResetPasswordNotification;
// 列挙
use App\Enums\GrantTypeEnum;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    // 主キーカラムを変更
    protected $primaryKey = 'user_no';
    // 付与区分をEnumにキャスト
    protected $casts = [
        'grant_type' => GrantTypeEnum::class,
    ];
    // 操作可能なカラムを定義
    protected $fillable = [
        'user_id',
        'employee_no',
        'user_name',
        'email',
        'password',
        'is_active',
        'role_id',
        'base_id',
        'profile_image_file_name',
        'is_password_change_required',
        'last_login_at',
        'hire_date',
        'next_grant_year_month',
        'work_days_per_week',
        'carried_over_days',
        'granted_days',
        'used_days',
        'required_deadline',
        'carried_over_required_days',
        'granted_required_days',
        'used_days_reset_year_month',
        'grant_type',
        'paid_leave_updated_at',
    ];
    // 全てのレコードを取得
    public static function getAll()
    {
        return self::orderBy('user_no', 'asc');
    }
    // rolesテーブルとのリレーション
    public function role()
    {
        return $this->belongsTo(Role::Class, 'role_id', 'role_id');
    }
    // basesテーブルとのリレーション
    public function base()
    {
        return $this->belongsTo(Base::Class, 'base_id', 'base_id');
    }
    // 「is_active」に基づいて、有効 or 無効を返すアクセサ
    public function getIsActiveTextAttribute(): string
    {
        return $this->is_active ? '有効' : '無効';
    }
    // 総保有日数を返すアクセサ
    public function getTotalDaysAttribute(): float
    {
        return ($this->carried_over_days ?? 0) + ($this->granted_days ?? 0);
    }
    // 残日数を返すアクセサ
    public function getRemainingDaysAttribute(): float
    {
        return $this->total_days - ($this->used_days ?? 0);
    }
    // 総義務日数を返すアクセサ
    public function getTotalRequiredDaysAttribute(): float
    {
        return ($this->carried_over_required_days ?? 0) + ($this->granted_required_days ?? 0);
    }
    // 義務日数残を返すアクセサ
    public function getRemainingRequiredDaysAttribute(): float
    {
        $remaining = $this->total_required_days - ($this->used_days ?? 0);
        return max(0, $remaining);
    }
    // パスワードリセットの通知をカスタマイズ
    public function sendPasswordResetNotification($token)
    {
        $url = url("reset-password/{$token}");
        $this->notify(new UserResetPasswordNotification($url));
    }
    // ダウンロード時のヘッダーを定義
    public static function downloadHeader()
    {
        return [
            'ステータス',
            '営業所',
            '従業員番号',
            '氏名',
            '入社日',
            '勤続年数',
            '次回付与',
            '使用日数リセット',
            '付与区分',
            '週所定労働日数',
            '繰越保有日数',
            '当年保有日数',
            '総保有日数',
            '使用日数',
            '残日数',
            '繰越義務日数',
            '当年義務日数',
            '総義務日数',
            '義務残日数',
            '義務期限',
        ];
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}