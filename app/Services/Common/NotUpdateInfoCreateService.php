<?php

namespace App\Services\Common;

// 列挙
use App\Enums\SystemEnum;
// その他
use Carbon\CarbonImmutable;

class NotUpdateInfoCreateService
{
    // 更新しなかった従業員情報を出力
    public function createNotUpdateInfo($not_update_employees)
    {
        // チャンクサイズを設定
        $chunk_size = 500;
        // チャンクサイズ毎に分割
        $chunks = array_chunk($not_update_employees, $chunk_size);
        // ファイル名を設定
        $csvFileName = '【'.SystemEnum::getSystemTitle().'】更新対象外情報_'.CarbonImmutable::now()->format('Y-m-d H-i-s').'.csv';
        // 保存場所を設定
        $csvFilePath = storage_path('app/public/export/error/'.$csvFileName);
        // ヘッダーを書き込む
        $csvContent = "\xEF\xBB\xBF" . implode(',', ['社員CD', '社員名']) . "\n";
        // チャンク毎のループ処理
        foreach($chunks as $chunk){
            // レコード毎のループ処理
            foreach($chunk as $item){
                // $itemの全要素を結合してCSV行にする
                $csvContent .= implode(',', $item) . "\n";
            }
        }
        // ファイルに出力
        file_put_contents($csvFilePath, $csvContent);
        return $csvFileName;
    }
}