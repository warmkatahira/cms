<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NavigationRouteCheckMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // ルート名の先頭部分を格納する変数を初期化
        $route_prefix = '';
        // 現在のルート名を取得
        $route_name = $request->route()->getName();
        // ルート名に「update」か「create」が含まれている場合
        if(strpos($route_name, 'update') !== false || strpos($route_name, 'create') !== false){
            // 「_update」と「_create」を置換して削除
            $route_prefix = str_replace(['_update', '_create'], '', $route_name);
        }else{
            // 現在のルート名を変数に格納
            $route_prefix = $route_name;
        }
        // セッションに格納
        session(['route_prefix' => $route_prefix]);
        return $next($request);
    }
}