<?php

namespace App\Services\Common;

// 列挙
use App\Enums\ImportEnum;
// 例外
use App\Exceptions\FinancialImportException;
// ヘルパー
use App\Helpers\ColumnChangeHelper;
// その他
use Illuminate\Support\Facades\Storage;
use Rap2hpoutre\FastExcel\FastExcel;

class ImportService
{
    // 選択したファイルのファイル名を取得
    public function getImportOriginalFileName($select_file)
    {
        // 選択したデータのファイル名を取得
        return $select_file->getClientOriginalName();
    }

    // 選択したファイルをストレージにインポート
    public function importFile($select_file, $saveFileName_prefix)
    {
        // 選択したデータの拡張子を取得（例: csv, xlsx）
        $extension = $select_file->getClientOriginalExtension();
        // ストレージに保存する際のファイル名を設定
        $saveFileName = $saveFileName_prefix.'.'.$extension;
        // ファイルを保存して保存先のパスを取得
        $saveFilePath = Storage::disk('public')->putFileAs('import/', $select_file, $saveFileName);
        // パスを返す
        return Storage::disk('public')->path($saveFilePath);
    }

    // インポートしたデータのヘッダーを確認
    public function checkHeader($saveFilePath, $importOriginalFileName, $requireHeader, $en_change_list, $import_type)
    {
        // 選択したデータの拡張子を取得（例: csv, xlsx）
        $extension = strtolower(pathinfo($importOriginalFileName, PATHINFO_EXTENSION));
        // 全データを取得
        $allLine = (new FastExcel)->import($saveFilePath);
        // インポートしたデータのヘッダーを取得
        if($extension === 'csv'){
            $importDataHeader = array_keys(mb_convert_encoding($allLine[0], 'UTF-8', 'ASCII, JIS, UTF-8, SJIS-win'));
        }else{
            $importDataHeader = array_keys($allLine[0]);
        }
        // システムに定義している必須ヘッダーを取得
        $requireHeader = $requireHeader;
        // ヘッダーが存在するか確認
        $result = $this->checkRequireHeader($importDataHeader, $requireHeader);
        // Nullではない = 相違があるので、ここで処理を終了
        if(!is_null($result)){
            throw new FinancialImportException($result, $importOriginalFileName, null);
        }
        // 1行のデータを格納する配列をセット
        $param = [];
        // 追加先テーブルのカラム名に合わせて配列を整理
        foreach($importDataHeader as $header){
            // 英語カラムを定義している配列から取得
            $en_column = ColumnChangeHelper::column_en_change($header, $en_change_list);
            // カラムが空ではない場合
            if($en_column != ''){
                // 配列に変換した英語カラムを格納
                $param[] = $en_column;
            }
        }
        return $param;
    }

    // ヘッダーが存在するか確認
    public function checkRequireHeader($importDataHeader, $requireHeader)
    {
        // ヘッダーの分だけループ処理
        foreach($requireHeader as $header){
            // ヘッダーが存在するか確認
            $result = $this->checkValueExists($importDataHeader, $header);
            // nullではない場合
            if(!is_null($result)){
                // NG結果を返す
                return $result;
            }
        }
        return null;
    }

    // 配列の値が存在しているか確認
    public function checkValueExists($array, $value) {
        // ヘッダーの分だけループ処理
        foreach($array as $header){
            // 改行で分割
            $lines = preg_split("/\r\n|\n|\r/", $header);
            // 必須として定義しているヘッダーが存在している場合
            if(in_array($value, $lines, true)){
                // nullを返す
                return null;
            }
        }
        // 存在しなかったら、エラーを返す
        return !$result ? 'ヘッダーに「'.$value.'」がありません。' : null;
    }
}