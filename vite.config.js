import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                // 共通
                'resources/js/app.js',
                'resources/css/app.css',
                'resources/sass/theme.scss',
                'resources/js/common.js',
                'resources/js/loading.js',
                'resources/js/search.js',
                'resources/js/file_select.js',
                'resources/js/search_date.js',
                'resources/js/filter.js',
                'resources/sass/loading.scss',
                'resources/sass/navigation.scss',
                'resources/js/dropdown.js',
                'resources/js/image_fade_in.js',
                'resources/js/modal.js',
                'resources/js/tippy.js',
                'resources/sass/dropdown.scss',
                'resources/sass/height_adjustment.scss',
                'resources/sass/welcome.scss',
                'resources/sass/common.scss',
                'resources/sass/image.scss',
                // 認証
                'resources/js/auth/register.js',
                // 顧客
                'resources/js/client/client/client.js',
                'resources/js/client/client_detail/client_detail.js',
                'resources/js/client/client_detail/chart.js',
                'resources/js/client/client_alias/client_alias.js',
                // 収支データ
                'resources/js/financial/financial_import/financial_import.js',
                // 管理
                'resources/js/admin/employee/employee.js',
                // システム管理
                'resources/js/system_admin/user/user.js',
                // プロフィール
                'resources/js/profile/profile.js',
                'resources/sass/profile/profile.scss',
            ],
            refresh: true,
        }),
    ],
});