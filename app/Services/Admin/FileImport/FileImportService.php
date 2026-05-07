<?php

namespace App\Services\Admin\FileImport;

// モデル
use App\Models\FileImport;
// サービス
use App\Services\Common\ImportErrorCreateService;
// 列挙
use App\Enums\FileImportEnum;
// 例外
use App\Exceptions\FileImportException;
// その他
use Carbon\CarbonImmutable;
use Rap2hpoutre\FastExcel\FastExcel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FileImportService
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
        return with([
            'original_file_name'    => $original_file_name,
            'save_file_path'        => Storage::disk('public')->path($save_file_path),
        ]);
    }

    // インポートしたデータのヘッダーを確認
    public function checkHeader($file_info, $file_import_type, $nowDate)
    {
        // 全データを取得
        $all_line = (new FastExcel)->import($file_info['save_file_path']);
        // 全行をUTF-8に変換してマッピング
        $converted = $all_line->map(function ($row) {
            $result = [];
            // 1行分のキーと値をそれぞれUTF-8に変換
            foreach ($row as $key => $value) {
                // ヘッダー（キー）をSJIS-win → UTF-8に変換
                $new_key = mb_convert_encoding($key, 'UTF-8', 'SJIS-win');
                // セルの値をSJIS-win → UTF-8に変換
                $new_value = mb_convert_encoding($value, 'UTF-8', 'SJIS-win');
                $result[$new_key] = $new_value;
            }
            return $result;
        });
        // インポートしたデータのヘッダーを取得
        $import_data_header = array_keys($converted[0]);
        // システムに定義している必須ヘッダーを取得
        // 従業員データの場合
        if(FileImportEnum::FILE_IMPORT_TYPE_EMPLOYEE === $file_import_type){
            $require_headers = FileImport::requiredEmployeeHeaders();
        }
        // 有給データの場合
        if(FileImportEnum::FILE_IMPORT_TYPE_PAID_LEAVE === $file_import_type){
            $require_headers = FileImport::requiredPaidLeaveHeaders();
        }
        // ヘッダーの分だけループ処理
        foreach($require_headers as $require_header){
            // ヘッダーが存在するか確認
            $result = $this->checkValueExists($import_data_header, $require_header);
            // nullではない場合
            if(!is_null($result)){
                // ファイル取込区分の表示名を取得
                $file_import_type_label = FileImportEnum::getFileImportTypeLabel($file_import_type);
                // インスタンス化
                $ImportErrorCreateService = new ImportErrorCreateService;
                // エラーファイルを作成
                $error_file_name = $ImportErrorCreateService->createImportError('ファイル取込エラー', [['ヘッダー行', $result]], $nowDate, 'ヘッダー不正', null);
                throw new FileImportException("ファイルが正しくない為、取り込みできませんでした。(".$file_import_type_label.")", $file_info['original_file_name'], null, $error_file_name);
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
    public function setArrayImport($file_info, $file_import_type, $nowDate)
    {
        // データの情報を取得
        $all_line = (new FastExcel)->import($file_info['save_file_path']);
        // 全行をUTF-8に変換してマッピング
        $converted = $all_line->map(function ($row) {
            $result = [];
            // 1行分のキーと値をそれぞれUTF-8に変換
            foreach ($row as $key => $value) {
                // ヘッダー（キー）をSJIS-win → UTF-8に変換
                $new_key = mb_convert_encoding($key, 'UTF-8', 'SJIS-win');
                // セルの値をSJIS-win → UTF-8に変換
                $new_value = mb_convert_encoding($value, 'UTF-8', 'SJIS-win');
                $result[$new_key] = $new_value;
            }
            return $result;
        });
        // 追加用の配列をセット
        $create_data = [];
        $validation_error = [];
        // バリデーションエラー出力ファイルのヘッダーを定義
        $validation_error_export_header = array('エラー行数', 'エラー内容');
        // 取得したレコードの分だけループ
        foreach ($converted as $key => $line){
            // 従業員データの場合
            if(FileImportEnum::FILE_IMPORT_TYPE_EMPLOYEE === $file_import_type){
                // 追加先テーブルのカラム名に合わせて配列を整理
                $param = [
                    'employee_no'                   => $line['社員番号'],
                    'user_name'                     => $line['氏名'],
                    'base_info'                     => $line['部課'],
                    'work_days_per_week'            => $line['有休付与パターン'],
                    'hire_date'                     => $line['有休付与起算日'],
                    'next_grant_year_month'         => $line['次回付与月'],
                    'carried_over_remaining_days'   => $line['当月月初有休残日数繰越分'],
                    'granted_remaining_days'        => $line['当月月初有休残日数当年分'],
                ];
            }
            // 有給データの場合
            if(FileImportEnum::FILE_IMPORT_TYPE_PAID_LEAVE === $file_import_type){
                // 追加先テーブルのカラム名に合わせて配列を整理
                $param = [
                    'target_year_month' => $line['対象月'],
                    'employee_no'       => $line['社員番号'],
                    'user_name'         => $line['社員氏名'],
                    'used_days'         => $line['有給休暇(日数)'],
                ];
            }
            // 値が空であればnull、先頭の「'」を除去
            $param = array_map(function ($value) {
                if($value === "") return null;
                return is_string($value) ? ltrim($value, "'") : $value;
            }, $param);
            // 従業員データの場合
            if(FileImportEnum::FILE_IMPORT_TYPE_EMPLOYEE === $file_import_type){
                // 次回付与月を「令和 9年 4月」→「202504」形式に変換
                $param['next_grant_year_month'] = $this->convertJapaneseEraToYearMonth($param['next_grant_year_month']);
                // 有休付与起算日を「平成29年9月1日」→「2017-09-01」形式に変換
                $param['hire_date'] = $this->convertJapaneseEraToYearMonthDay($param['hire_date']);
            }
            // 有給データの場合
            if(FileImportEnum::FILE_IMPORT_TYPE_PAID_LEAVE === $file_import_type){
                // 対象月を「令和8年 3月」→「202603」形式に変換
                $param['target_year_month'] = $this->convertJapaneseEraToYearMonth($param['target_year_month']);
            }
            // インポートデータのバリデーション処理
            $message = $this->validation($param, $key + 2, $file_import_type);
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
            // ファイル取込区分の表示名を取得
            $file_import_type_label = FileImportEnum::getFileImportTypeLabel($file_import_type);
            // インスタンス化
            $ImportErrorCreateService = new ImportErrorCreateService;
            // インポートエラー情報のファイルを作成
            $error_file_name = $ImportErrorCreateService->createImportError('ファイル取込エラー', $validation_error, $nowDate, 'データ不正', null);
            throw new FileImportException("データが正しくない為、取り込みできませんでした。(".$file_import_type_label.")", $file_info['original_file_name'], null, $error_file_name);
        }
        return $create_data;
    }

    // 和暦（例：令和 9年 4月）をyyyymm形式に変換
    public function convertJapaneseEraToYearMonth($value)
    {
        if (is_null($value)) return null;
        // 元号と年月を抽出（例：「令和 9年 4月」→ 令和, 9, 4）
        if (!preg_match('/^(令和)\s*(\d+)年\s*(\d+)月$/', $value, $matches)) {
            // マッチしない場合はそのまま返す（バリデーションで弾く）
            return $value;
        }
        $era = $matches[1];
        $year = (int) $matches[2];
        $month = (int) $matches[3];
        // 元号ごとの開始西暦を定義
        $era_start = [
            '令和' => 2019,
        ];
        // 西暦に変換（元号の開始年 + 和暦年 - 1）
        $western_year = $era_start[$era] + $year - 1;
        // yyyymm形式にフォーマット
        return sprintf('%04d%02d', $western_year, $month);
    }

    // 和暦（例：平成29年9月1日）をyyyymmdd形式に変換
    public function convertJapaneseEraToYearMonthDay($value)
    {
        if (is_null($value)) return null;
        // 元号と年月日を抽出
        if (!preg_match('/^(平成|令和)\s*(\d+)年\s*(\d+)月\s*(\d+)日$/', $value, $matches)) {
            // マッチしない場合はそのまま返す（バリデーションで弾く）
            return $value;
        }
        $era   = $matches[1];
        $year  = (int) $matches[2];
        $month = (int) $matches[3];
        $day   = (int) $matches[4];
        // 元号ごとの開始西暦を定義
        $era_start = [
            '平成' => 1989,
            '令和' => 2019,
        ];
        // 西暦に変換
        $western_year = $era_start[$era] + $year - 1;
        // yyyymmdd形式にフォーマット
        return sprintf('%04d-%02d-%02d', $western_year, $month, $day);
    }

    // インポートデータのバリデーション処理
    public function validation($param, $record_num, $file_import_type)
    {
        // 従業員データの場合
        if(FileImportEnum::FILE_IMPORT_TYPE_EMPLOYEE === $file_import_type){
            // バリデーションルールを定義
            $rules = [
                'employee_no'                   => 'required|max:4',
                'user_name'                     => 'required|max:30',
                'base_info'                     => 'required|max:20',
                'work_days_per_week'            => 'required|max:20',
                'hire_date'                     => 'required|date',
                'next_grant_year_month'         => 'required|max:6',
                'carried_over_remaining_days'   => 'nullable|decimal:0,1',
                'granted_remaining_days'        => 'nullable|decimal:0,1',
            ];
        }
        // 有給データの場合
        if(FileImportEnum::FILE_IMPORT_TYPE_PAID_LEAVE === $file_import_type){
            // バリデーションルールを定義
            $rules = [
                'employee_no'   => 'required|max:4',
                'user_name'     => 'required|max:30',
                'used_days'     => 'nullable|decimal:0,1',
            ];
        }
        // バリデーションエラーメッセージを定義
        $messages = [
            'required'  => ':attributeは必須です',
            'date'      => ':attribute（:input）が日付ではありません',
            'max'       => ':attribute（:input）は:max文字以内にして下さい',
            'decimal'   => ':attribute（:input）は数値で入力して下さい',
        ];
        // バリデーションエラー項目を定義
        $attributes = [
            'employee_no'                   => '社員番号',
            'user_name'                     => '氏名',
            'base_info'                     => '部課',
            'work_days_per_week'            => '有休付与パターン',
            'hire_date'                     => '有休付与起算日',
            'next_grant_year_month'         => '次回付与月',
            'carried_over_remaining_days'   => '当月月初有休残日数繰越分',
            'granted_remaining_days'        => '当月月初有休残日数当年分',
            'used_days'                     => '有給休暇(日数)',
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

    // 2ファイル間の従業員番号の差分チェック
    public function checkEmployeeNoDiff($employee_data, $paid_leave_data, $nowDate)
    {
        $employee_nos   = collect($employee_data)->pluck('employee_no');
        $paid_leave_nos = collect($paid_leave_data)->pluck('employee_no');
        // 従業員データにあって有給データにない
        $only_in_employee   = $employee_nos->diff($paid_leave_nos);
        // 有給データにあって従業員データにない
        $only_in_paid_leave = $paid_leave_nos->diff($employee_nos);
        if($only_in_employee->isNotEmpty() || $only_in_paid_leave->isNotEmpty()){
            // エラー内容を配列に格納
            $errors = [];
            foreach($only_in_employee as $employee_no){
                $errors[] = ['従業員ファイルのみ存在', '従業員番号：'.$employee_no];
            }
            foreach($only_in_paid_leave as $employee_no){
                $errors[] = ['有給ファイルのみ存在', '従業員番号：'.$employee_no];
            }
            // インスタンス化
            $ImportErrorCreateService = new ImportErrorCreateService;
            // エラーファイルを作成
            $error_file_name = $ImportErrorCreateService->createImportError('ファイル取込エラー', $errors, $nowDate, '従業員番号不一致', null);
            throw new FileImportException('2ファイル間で従業員番号が一致しない為、取り込みできませんでした。', null, null, $error_file_name);
        }
    }

    // importsへデータを追加
    public function createArrayImportData($employee_create_data, $paid_leave_create_data)
    {
        // テーブルをロック
        FileImport::select()->lockForUpdate()->get();
        // 追加先のテーブルをクリア
        FileImport::query()->delete();
        // 社員番号をキーに有給データをマッピング
        $paid_leave_map = collect($paid_leave_create_data)->keyBy('employee_no');
        // 従業員データに有給データをマージ
        $merged = collect($employee_create_data)->map(function ($row) use ($paid_leave_map) {
            // 社員番号が一致する有給データを取得
            $paid_leave = $paid_leave_map->get($row['employee_no'], []);
            return array_merge($row, [
                'target_year_month' => $paid_leave['target_year_month'] ?? null,
                'used_days'         => $paid_leave['used_days'] ?? null,
            ]);
        });
        // 200件ごとにデータを分けてインサート
        foreach($merged->chunk(200) as $chunk){
            FileImport::insert($chunk->values()->toArray());
        }
    }
}