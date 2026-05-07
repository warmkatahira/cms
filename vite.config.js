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
                'resources/sass/dropdown.scss',
                'resources/sass/height_adjustment.scss',
                'resources/sass/welcome.scss',
                'resources/sass/common.scss',
                // 認証
                'resources/js/auth/register.js',
                // 管理
                'resources/js/admin/employee/employee.js',
                'resources/js/admin/file_import/file_import.js',
                // システム管理
                'resources/js/system_admin/base/base.js',
                'resources/js/system_admin/user/user.js',
                'resources/js/system_admin/working_hour/working_hour.js',
                // プロフィール
                'resources/js/profile/profile.js',
                'resources/sass/profile/profile.scss',
                'resources/sass/profile/profile_image.scss',
            ],
            refresh: true,
        }),
    ],
});