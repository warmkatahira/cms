<?php

namespace App\Services\Client\ClientAlias;

// モデル
use App\Models\ClientAlias;

class ClientAliasCreateService
{
    // エイリアスを登録
    public function createClientAliases($aliases)
    {
        // 紐付けの分だけループ処理
        foreach($aliases as $alias){
            // client_idが空の場合はスキップ
            if (empty($alias['client_id'])) continue;
            // エイリアス追加
            ClientAlias::create([
                'base_id'           => $alias['base_id'],
                'client_id'         => $alias['client_id'],
                'client_alias_name' => $alias['client_alias_name'],
            ]);
        }
    }
}