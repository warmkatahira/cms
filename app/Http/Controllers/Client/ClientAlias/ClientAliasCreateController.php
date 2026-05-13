<?php

namespace App\Http\Controllers\Client\ClientAlias;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Client;
use App\Models\Base;

class ClientAliasCreateController extends Controller
{
    public function index()
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => '荷主名⇔顧客紐付け登録']);
        // セッションから未登録エイリアスを取得
        $unregistered_aliases = session('unregistered_aliases', []);
        // clientsを全件取得
        $clients = Client::where('is_active', true)->orderBy('client_name')->get();
        // basesをbase_id => base_nameのマップで取得
        $baseMap = Base::pluck('base_name', 'base_id')->toArray();
        return view('client.client_alias.create')->with([
            'clients' => $clients,
            'unregistered_aliases' => $unregistered_aliases,
            'baseMap' => $baseMap,
        ]);
    }

    public function create(Request $request)
    {

    }
}