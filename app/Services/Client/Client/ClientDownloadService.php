<?php

namespace App\Services\Client\Client;

// モデル
use App\Models\Client;
// その他
use Symfony\Component\HttpFoundation\StreamedResponse;
use Carbon\CarbonImmutable;
// 列挙
use App\Enums\SystemEnum;

class ClientDownloadService
{
    // 顧客単位でダウンロードするデータを取得
    public function getDownloadDataByClient($clients)
    {
        // チャンクサイズを指定
        $chunk_size = 1000;
        $response = new StreamedResponse(function () use ($clients, $chunk_size){
            // ハンドルを取得
            $handle = fopen('php://output', 'wb');
            // BOMを書き込む
            fwrite($handle, "\xEF\xBB\xBF");
            // システムに定義してあるヘッダーを取得し、書き込む
            $header = Client::downloadHeaderByClient();
            fputcsv($handle, $header);
            // レコードをチャンクごとに書き込む
            $clients->chunk($chunk_size, function ($clients) use ($handle){
                // 従業員の分だけループ処理
                foreach($clients as $client){
                    // 変数に情報を格納
                    $row = [
                        $client->is_active_text,
                        $client->client_name,
                        $client->client_postal_code,
                        $client->client_address,
                        $client->client_tel,
                        // 営業所+エイリアス名+担当者名を追加
                        $client->clientAliases->map(function ($alias) {
                            $baseName = $alias->base->base_name ?? '';
                            $users = $alias->users->isNotEmpty() ? ' / ' . $alias->users->map(fn($u) => $u->user_name)->join('・') : ' / 設定なし';
                            return "{$baseName} / {$alias->client_alias_name}{$users}";
                        })->join("\n"),
                        $client->user->user_name,
                        CarbonImmutable::parse($client->updated_at)->isoFormat('YYYY年MM月DD日(ddd) HH時mm分ss秒'),
                    ];
                    // 書き込む
                    fputcsv($handle, $row);
                };
            });
            // ファイルを閉じる
            fclose($handle);
        });
        return $response;
    }

    // エイリアス単位でダウンロードするデータを取得
    public function getDownloadDataByAlias($clients)
    {
        // チャンクサイズを指定
        $chunk_size = 1000;
        $response = new StreamedResponse(function () use ($clients, $chunk_size){
            // ハンドルを取得
            $handle = fopen('php://output', 'wb');
            // BOMを書き込む
            fwrite($handle, "\xEF\xBB\xBF");
            // システムに定義してあるヘッダーを取得し、書き込む
            $header = Client::downloadHeaderByAlias();
            fputcsv($handle, $header);
            // レコードをチャンクごとに書き込む
            $clients->chunk($chunk_size, function ($clients) use ($handle){
                // 従業員の分だけループ処理
                foreach($clients as $client){
                    // エイリアスの分だけループ処理
                    foreach ($client->clientAliases as $alias) {
                        // 担当営業所と担当従業員を取得
                        $baseName = $alias->base->base_name ?? '';
                        $users = $alias->users->isNotEmpty() ? $alias->users->map(fn($u) => $u->user_name)->join('・') : '設定なし';
                        // 変数に情報を格納
                        $row = [
                            $client->is_active_text,
                            $client->client_name,
                            $client->client_postal_code,
                            $client->client_address,
                            $client->client_tel,
                            $baseName,
                            $alias->client_alias_name,
                            $users,
                            $client->user->user_name,
                            CarbonImmutable::parse($client->updated_at)->isoFormat('YYYY年MM月DD日(ddd) HH時mm分ss秒'),
                        ];
                        // 書き込む
                        fputcsv($handle, $row);
                    }
                };
            });
            // ファイルを閉じる
            fclose($handle);
        });
        return $response;
    }
}