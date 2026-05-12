<?php

namespace App\Services\Financial\FinancialImport;

// モデル
use App\Models\FinancialImport;
// サービス
use App\Services\Common\ImportErrorCreateService;
use App\Services\Common\CsvConvertService;
// 例外
use App\Exceptions\FinancialImportException;
// その他
use Carbon\CarbonImmutable;
use Rap2hpoutre\FastExcel\FastExcel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FinancialImportService
{
    // 選択したファイルをストレージにインポート
    public function importFile($file, $save_file_name_prefix)
    {
        // 現在の日時を取得
        $nowDate = CarbonImmutable::now();
        // 選択したデータのファイル名を取得
        $original_file_name = $file->getClientOriginalName();
        // ストレージに保存する際のファイル名を設定
        $save_file_name = $save_file_name_prefix.'_'.$nowDate->format('Y-m-d H-i-s').'.csv';
        // ファイルを保存して保存先のパスを取得
        $save_file_path = Storage::disk('public')->putFileAs('import', $file, $save_file_name);
        // フルパスに調整する
        return [
            'original_file_name'    => $original_file_name,
            'save_file_path'        => Storage::disk('public')->path($save_file_path),
        ];
    }

    // インポートしたデータのヘッダーを確認
    public function checkHeader($file_info, $nowDate)
    {
        // 全データを取得
        $all_line = (new FastExcel)->import($file_info['save_file_path']);
        // 全行をSJIS-winからUTF-8に変換
        $converted = CsvConvertService::convertToUtf8($all_line);
        // インポートしたデータのヘッダーを取得
        $import_data_header = array_keys($converted[0]);
        // システムに定義している必須ヘッダーを取得
        $require_headers = FinancialImport::requiredHeaders();
        // ヘッダーの分だけループ処理
        foreach($require_headers as $require_header){
            // ヘッダーが存在するか確認
            $result = $this->checkValueExists($import_data_header, $require_header);
            // nullではない場合
            if(!is_null($result)){
                // インスタンス化
                $ImportErrorCreateService = new ImportErrorCreateService;
                // エラーファイルを作成
                $error_file_name = $ImportErrorCreateService->createImportError('ファイル取込エラー', [['ヘッダー行', $result]], $nowDate, 'ヘッダー不正', null);
                throw new FinancialImportException("ファイルが正しくない為、取り込みできませんでした。", $file_info['original_file_name'], $error_file_name);
            }
        }
    }

    // 配列の値が存在しているか確認
    public function checkValueExists($array, $value){
        // 存在したら「true」、存在しなかったら「false」
        $result = in_array($value, $array);
        // 存在しなかったら、エラーを返す
        return !$result ? 'カラムに「'.$value.'」がありません。' : null;
    }

    // 追加する受注データを配列に格納（同時にバリデーションも実施）
    public function setArrayImport($file_info, $nowDate)
    {
        // データの情報を取得
        $all_line = (new FastExcel)->import($file_info['save_file_path']);
        // 全行をSJIS-winからUTF-8に変換
        $converted = CsvConvertService::convertToUtf8($all_line);
        // 追加用の配列をセット
        $create_data = [];
        $validation_error = [];
        // バリデーションエラー出力ファイルのヘッダーを定義
        $validation_error_export_header = array('エラー行数', 'エラー内容');
        // 取得したレコードの分だけループ
        foreach ($converted as $key => $line){
            // 追加先テーブルのカラム名に合わせて配列を整理
            $param = [
                'base_name'         => $line['営業所名'],
                'client_alias_name' => $line['荷主名'],
                'year_month'        => $line['年月'],
                'sales_storage'     => $line['保管売上'],
                'sales_handling'    => $line['荷役売上'],
                'sales_freight'     => $line['運賃売上'],
                'sales_other'       => $line['その他売上'],
                'cost_storage'      => $line['保管経費'],
                'cost_employee'     => $line['社員人件費'],
                'cost_part'         => $line['パート人件費'],
                'cost_temp'         => $line['派遣人件費・内職'],
                'cost_freight'      => $line['運賃経費'],
                'cost_other'        => $line['その他経費'],
                'cost_hq'           => $line['本社管理費'],
            ];
            // 値が空であればnull、先頭の「'」を除去
            $param = array_map(function ($value) {
                if($value === "") return null;
                return is_string($value) ? ltrim($value, "'") : $value;
            }, $param);
            // インポートデータのバリデーション処理
            $message = $this->validation($param, $key + 2);
            // エラーメッセージがある場合
            if(!is_null($message)){
                // バリデーションエラーを配列に格納
                $validation_error[] = array_combine($validation_error_export_header, $message);
            }
            // 追加用の配列に整理した情報を格納
            $create_data[] = $param;
        }
        // バリデーションエラー配列の中にnull以外があれば、エラー情報を出力
        if(count(array_filter($validation_error)) != 0){
            // インスタンス化
            $ImportErrorCreateService = new ImportErrorCreateService;
            // インポートエラー情報のファイルを作成
            $error_file_name = $ImportErrorCreateService->createImportError('ファイル取込エラー', $validation_error, $nowDate, 'データ不正', null);
            throw new FinancialImportException("データが正しくない為、取り込みできませんでした。", $file_info['original_file_name'], $error_file_name);
        }
        return $create_data;
    }

    // インポートデータのバリデーション処理
    public function validation($param, $record_num)
    {
        // バリデーションルールを定義
        $rules = [
            'base_name'         => 'required|string|max:20',
            'client_alias_name' => 'required|string|max:100',
            'year_month'        => 'required|date',
            'sales_storage'     => 'required|integer',
            'sales_handling'    => 'required|integer',
            'sales_freight'     => 'required|integer',
            'sales_other'       => 'required|integer',
            'cost_storage'      => 'required|integer',
            'cost_employee'     => 'required|integer',
            'cost_part'         => 'required|integer',
            'cost_temp'         => 'required|integer',
            'cost_freight'      => 'required|integer',
            'cost_other'        => 'required|integer',
            'cost_hq'           => 'required|integer',
        ];
        // バリデーションエラーメッセージを定義
        $messages = [
            'required'  => ':attributeは必須です',
            'date'      => ':attribute（:input）が日付ではありません',
            'max'       => ':attribute（:input）は:max文字以内にして下さい',
            'string'    => ':attribute（:input）は文字列で入力して下さい',
            'integer'   => ':attribute（:input）は数値で入力して下さい',
        ];
        // バリデーションエラー項目を定義
        $attributes = [
            'base_name'         => '営業所名',
            'client_alias_name' => '荷主名',
            'year_month'        => '年月',
            'sales_storage'     => '保管売上',
            'sales_handling'    => '荷役売上',
            'sales_freight'     => '運賃売上',
            'sales_other'       => 'その他売上',
            'cost_storage'      => '保管経費',
            'cost_employee'     => '社員人件費',
            'cost_part'         => 'パート人件費',
            'cost_temp'         => '派遣人件費・内職',
            'cost_freight'      => '運賃経費',
            'cost_other'        => 'その他経費',
            'cost_hq'           => '本社管理費',
        ];
        // バリデーション実施
        $validator = Validator::make($param, $rules, $messages, $attributes);
        // バリデーションエラーメッセージを格納する変数をセット
        $message = '';
        // バリデーションエラーの分だけループ
        foreach($validator->errors()->toArray() as $errors){
            // メッセージを格納
            $message = empty($message) ? array_shift($errors) : $message . ' / ' . array_shift($errors);
        }
        return empty($message) ? null : array($record_num.'行目', $message);
    }

    // importsへデータを追加
    public function createArrayImportData($financial_create_data)
    {
        // テーブルをロック
        FinancialImport::select()->lockForUpdate()->get();
        // 追加先のテーブルをクリア
        FinancialImport::query()->delete();
        // 200件ごとにデータを分けてインサート
        foreach(collect($financial_create_data)->chunk(200) as $chunk){
            FinancialImport::insert($chunk->values()->toArray());
        }
    }
}