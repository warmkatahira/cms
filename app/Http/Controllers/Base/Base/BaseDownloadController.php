<?php

namespace App\Http\Controllers\Base\Base;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// サービス
use App\Services\Base\Base\BaseSearchService;
use App\Services\Base\Base\BaseDownloadService;
// その他
use Carbon\CarbonImmutable;
// 列挙
use App\Enums\SystemEnum;

class BaseDownloadController extends Controller
{
    public function downloadByBase()
    {
        // インスタンス化
        $BaseSearchService = new BaseSearchService;
        $BaseDownloadService = new BaseDownloadService;
        // 検索結果を取得
        $result = $BaseSearchService->getSearchResult();
        // 顧客単位でダウンロードするデータを取得
        $response = $BaseDownloadService->getDownloadDataByBase($result);
        // ダウンロード処理
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename=【'.SystemEnum::getSystemTitle().'】顧客データ（顧客単位）_' . CarbonImmutable::now()->isoFormat('Y年MM月DD日HH時mm分ss秒') . '.csv');
        return $response;
    }

    public function downloadByAlias()
    {
        // インスタンス化
        $BaseSearchService = new BaseSearchService;
        $BaseDownloadService = new BaseDownloadService;
        // 検索結果を取得
        $result = $BaseSearchService->getSearchResult();
        // エイリアス単位でダウンロードするデータを取得
        $response = $BaseDownloadService->getDownloadDataByAlias($result);
        // ダウンロード処理
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename=【'.SystemEnum::getSystemTitle().'】顧客データ（エイリアス単位）_' . CarbonImmutable::now()->isoFormat('Y年MM月DD日HH時mm分ss秒') . '.csv');
        return $response;
    }
}
