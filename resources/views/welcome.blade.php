<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- jQuery -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

        <!-- favicon -->
        <link rel="shortcut icon" href="{{ asset('image/favicon.svg') }}">

        <!-- Styles -->
        @vite([
            'resources/css/app.css',
            'resources/sass/theme.scss',
            'resources/sass/common.scss',
            'resources/sass/welcome.scss',
        ])

        <!-- Scripts -->
        @vite([
            'resources/js/app.js',
        ])

        <!-- LINE AWESOME -->
        <link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">

        <!-- Google Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&family=Oleo+Script:wght@400;700&family=Zen+Maru+Gothic:wght@900&display=swap" rel="stylesheet">

        <!-- Lordicon -->
        <script src="https://cdn.lordicon.com/pzdvqjsp.js"></script>

        <!-- toastr.js -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>

        <!-- Tippy.js -->
        <script src="https://unpkg.com/@popperjs/core@2"></script>
        <script src="https://unpkg.com/tippy.js@6"></script>
    </head>
    <body>
        <!-- アラート表示 -->
        <x-alert/>
        <div class="flex flex-col md:flex-row md:items-start md:justify-between md:mx-10">
            <!-- ロゴ -->
            <div class="text-center md:text-left">
                <img src="{{ asset('image/plms_logo.svg') }}" class="welcome_logo mx-auto md:mx-0">
            </div>
            <!-- ログインボタン -->
            <div class="flex flex-col md:mt-5">
                @guest
                    <a href="{{ route('login') }}" class="btn md:ml-auto rounded-md bg-theme-main text-center md:py-5 py-10 mx-5 md:mx-0 md:w-48 mt-5 md:mt-0 text-2xl md:text-sm">ログイン</a>
                @endguest
            </div>
        </div>
    </body>
</html>