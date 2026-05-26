<?php

namespace App\Http\Controllers\Client\ClientAlias;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Client;
use App\Models\Base;
// リクエスト
use App\Http\Requests\Client\ClientAlias\ClientAliasCreateRequest;
// サービス
use App\Services\Client\ClientAlias\ClientAliasCreateService;
// その他
use Illuminate\Support\Facades\DB;

class ClientAliasCreateController extends Controller
{
    public function index()
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => '荷主名⇔顧客紐付け登録']);
        // セッションから未登録エイリアスを取得
        $unregisteredAliases = session('unregisteredAliases', []);
        // clientsを全件取得
        $clients = Client::where('is_active', true)->orderBy('client_name')->get();
        // basesをbase_id => base_nameのマップで取得
        $baseMap = Base::pluck('base_name', 'base_id')->toArray();
        return view('client.client_alias.create')->with([
            'clients' => $clients,
            'unregisteredAliases' => $unregisteredAliases,
            'baseMap' => $baseMap,
        ]);
    }

    public function create(ClientAliasCreateRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {
                // インスタンス化
                $ClientAliasCreateService = new ClientAliasCreateService;
                // エイリアスを登録
                $ClientAliasCreateService->createClientAliases($request->aliases);
            });
        } catch (\Exception $e) {
            return redirect()->route('financial_import_history.index')->with([
                'alert_type'    => 'error',
                'alert_message' => $e->getMessage(),
            ]);
        }
        // セッションをクリア
        session()->forget('unregisteredAliases');
        return redirect()->route('financial_import.index')->with([
            'alert_type'    => 'success',
            'alert_message' => '紐付け登録が完了しました。再度収支データを取り込んでください。',
        ]);
    }
}