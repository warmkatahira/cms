<?php

namespace App\Http\Controllers\Client\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// サービス
use App\Services\Client\Client\ClientSearchService;
use App\Services\Client\Client\ClientDownloadService;
// その他
use Carbon\CarbonImmutable;
// 列挙
use App\Enums\SystemEnum;

class ClientDownloadController extends Controller
{
    public function downloadByClient()
    {
        // インスタンス化
        $ClientSearchService = new ClientSearchService;
        $ClientDownloadService = new ClientDownloadService;
        // 検索結果を取得
        $result = $ClientSearchService->getSearchResult();
        // 顧客単位でダウンロードするデータを取得
        $response = $ClientDownloadService->getDownloadDataByClient($result);
        // ダウンロード処理
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename=【'.SystemEnum::getSystemTitle().'】顧客データ（顧客単位）_' . CarbonImmutable::now()->isoFormat('Y年MM月DD日HH時mm分ss秒') . '.csv');
        return $response;
    }

    public function downloadByAlias()
    {
        // インスタンス化
        $ClientSearchService = new ClientSearchService;
        $ClientDownloadService = new ClientDownloadService;
        // 検索結果を取得
        $result = $ClientSearchService->getSearchResult();
        // エイリアス単位でダウンロードするデータを取得
        $response = $ClientDownloadService->getDownloadDataByAlias($result);
        // ダウンロード処理
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename=【'.SystemEnum::getSystemTitle().'】顧客データ（エイリアス単位）_' . CarbonImmutable::now()->isoFormat('Y年MM月DD日HH時mm分ss秒') . '.csv');
        return $response;
    }
}
