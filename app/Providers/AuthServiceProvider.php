<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
// モデル
use App\Models\User;
use App\Models\Order;
// 列挙
use App\Enums\OrderStatusEnum;
// その他
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as BaseServiceProvider;

class AuthServiceProvider extends BaseServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
        // 権限が「system_admin」の場合のみ許可
        Gate::define('system_admin_check', function (User $user){
            return ($user->role_id === 'system_admin');
        });
        // 権限が「system_admin」か「admin」の場合のみ許可
        Gate::define('admin_check', function (User $user){
            return in_array($user->role_id, ['system_admin', 'admin'], true);
        });
        // 権限が「system_admin」か「admin」か「base_admin」の場合のみ許可
        Gate::define('base_admin_check', function (User $user){
            return in_array($user->role_id, ['system_admin', 'admin', 'base_admin'], true);
        });
    }
}