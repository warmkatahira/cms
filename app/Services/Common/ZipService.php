<?php

namespace App\Services\Common;

// その他
use ZipArchive;
use Illuminate\Support\Facades\Storage;

class ZipService
{
    // Zipファイルを作成
    public function createZip($directory_name, $directory_path)
    {
        // Zipファイルの名前
        $zip_file_name = $directory_name.'.zip';
        // ZipArchiveクラスのインスタンス作成
        $zip = new ZipArchive;
        // Zipファイルの保存パス(storageディレクトリ内)
        $zip_file_path = storage_path('app/public/export/'.$zip_file_name);
        // Zipファイルを作成
        if($zip->open($zip_file_path, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE){
            // 対象ディレクトリ内のファイルを取得
            $files = Storage::disk('public')->files('export/' . $directory_name);
            // 各ファイルをZipに追加
            foreach($files as $file){
                // フルパスを取得
                $full_path = Storage::disk('public')->path($file);
                // 日本語ファイル名の場合、Shift-JISに変換してZipに追加
                $zip->addFile($full_path, mb_convert_encoding(basename($file), 'SJIS-win', 'UTF-8'));
            }
            // Zipファイルを閉じる
            $zip->close();
        }
        // 元のディレクトリを削除
        Storage::disk('public')->deleteDirectory($directory_path);
        return $zip_file_path;
    }
}