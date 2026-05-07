<?php

namespace App\Services\Common;

// 列挙
use App\Enums\ImportEnum;
// 例外
use App\Exceptions\FileImportException;
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
    public function importFile($select_file, $save_file_name_prefix)
    {
        // 選択したデータの拡張子を取得（例: csv, xlsx）
        $extension = $select_file->getClientOriginalExtension();
        // ストレージに保存する際のファイル名を設定
        $save_file_name = $save_file_name_prefix.'.'.$extension;
        // ファイルを保存して保存先のパスを取得
        $save_file_path = Storage::disk('public')->putFileAs('import/', $select_file, $save_file_name);
        // パスを返す
        return Storage::disk('public')->path($save_file_path);
    }

    // インポートしたデータのヘッダーを確認
    public function checkHeader($save_file_path, $import_original_file_name, $require_header, $en_change_list, $import_type)
    {
        // 選択したデータの拡張子を取得（例: csv, xlsx）
        $extension = strtolower(pathinfo($import_original_file_name, PATHINFO_EXTENSION));
        // 全データを取得
        $all_line = (new FastExcel)->import($save_file_path);
        // インポートしたデータのヘッダーを取得
        if($extension === 'csv'){
            $import_data_header = array_keys(mb_convert_encoding($all_line[0], 'UTF-8', 'ASCII, JIS, UTF-8, SJIS-win'));
        }else{
            $import_data_header = array_keys($all_line[0]);
        }
        // システムに定義している必須ヘッダーを取得
        $require_header = $require_header;
        // ヘッダーが存在するか確認
        $result = $this->checkRequireHeader($import_data_header, $require_header);
        // Nullではない = 相違があるので、ここで処理を終了
        if(!is_null($result)){
            throw new FileImportException($result, ImportEnum::IMPORT_PROCESS_EMPLOYEE, $import_type, null, $import_original_file_name);
        }
        // 1行のデータを格納する配列をセット
        $param = [];
        // 追加先テーブルのカラム名に合わせて配列を整理
        foreach($import_data_header as $header){
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
    public function checkRequireHeader($import_data_header, $require_header)
    {
        // ヘッダーの分だけループ処理
        foreach($require_header as $header){
            // ヘッダーが存在するか確認
            $result = $this->checkValueExists($import_data_header, $header);
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