<?php

namespace App\Services\Financial\FinancialImport;

// モデル
use App\Models\FinancialImport;
use App\Models\ClientAlias;
use App\Models\MonthlyFinancial;
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
use Illuminate\Support\Facades\DB;

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

    // financial_importsへデータを追加
    public function createFinancialImport($financial_create_data)
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

    // base_idをbase_nameから更新
    public function updateBaseId($original_file_name)
    {
        // base_idをbase_nameから更新
        DB::statement('
            UPDATE financial_imports fi
            INNER JOIN bases b ON b.base_name = fi.base_name
            SET fi.base_id = b.base_id
        ');
        // base_idがnullのレコードを取得
        $unresolved = FinancialImport::whereNull('base_id')->pluck('base_name')->unique();
        // 存在する場合
        if($unresolved->isNotEmpty()){
            // 情報を改行で区切る
            $names = $unresolved->implode("\n");
            throw new FinancialImportException(
                "営業所名が正しくないレコードが存在します\n{$names}",
                $original_file_name,
                null
            );
        }
    }

    // 既に取り込まれている営業所×年月でないか確認
    public function checkDuplicateMonthlyFinancials($original_file_name)
    {
        // financial_importsから営業所IDと年月を重複を除いて取得
        $importRows = FinancialImport::select('base_id', 'base_name', 'year_month')
                            ->distinct()
                            ->get();
        // client_aliasesとmonthly_financialsをjoinして事前取得
        // "base_id:year_month" のセットを作成
        $existingSet = MonthlyFinancial::join('client_aliases', 'monthly_financials.client_alias_id', '=', 'client_aliases.client_alias_id')
                        ->select('client_aliases.base_id', 'monthly_financials.year_month')
                        ->distinct()
                        ->get()
                        ->map(fn($row) => "{$row->base_id}:{$row->year_month}")
                        ->toArray();
        // 重複していた情報を格納する配列を初期化
        $duplicates = [];
        // 営業所IDと年月の組み合わせの分だけループ処理
        foreach($importRows as $import){
            // キーを作成
            $key = "{$import->base_id}:{$import->year_month}";
            // キーが既にmonthly_financialsテーブルに存在する場合
            if(in_array($key, $existingSet)){
                // 配列に情報を格納
                $duplicates[] = "{$import->base_name} / " . CarbonImmutable::parse($import->year_month)->isoFormat('YYYY年MM月');
            }
        }
        // 重複情報が存在する場合
        if(!empty($duplicates)){
            $names = implode("\n", $duplicates);
            throw new FinancialImportException(
                "既に取り込まれているデータが存在します\n{$names}",
                $original_file_name,
                null
            );
        }
    }

    // client_alias_nameが登録されているか確認
    public function checkClientAliases($original_file_name)
    {
        // client_aliasesテーブルに存在しているエイリアスを取得
        $existing_aliases = ClientAlias::all()
                                ->groupBy('base_id')
                                ->map(fn($aliases) => $aliases->pluck('client_alias_name')->toArray())
                                ->toArray();
        // financial_importsから「base_id」と「client_alias_name」を取得
        $imported_rows = FinancialImport::select('base_id', 'client_alias_name')
                            ->distinct()
                            ->get();
        // エイリアスが未登録の情報を格納する配列を初期化
        $unregistered = [];
        // 取り込んだ収支データの分だけループ処理
        foreach ($imported_rows as $row) {
            // そのbase_idに紐づく登録済みのclient_alias_nameを取得（なければ空配列）
            $registered = $existing_aliases[$row->base_id] ?? [];
            // 登録済みの中に該当のclient_alias_nameが存在しない場合
            if(!in_array($row->client_alias_name, $registered)){
                // base_idとclient_alias_nameの組み合わせをキーとして重複を防ぐ
                $key = "{$row->base_id}:{$row->client_alias_name}";
                // 同じ組み合わせがまだ未登録配列に存在しない場合のみ追加
                if(!isset($unregistered[$key])){
                    $unregistered[$key] = [
                        'base_id'           => $row->base_id,
                        'client_alias_name' => $row->client_alias_name,
                    ];
                }
            }
        }
        return array_values($unregistered);
    }

    // monthly_financialsテーブルへ追加
    public function createMonthlyFinancials()
    {
        // financial_importsを全件取得
        $financial_imports = FinancialImport::all();
        // client_aliasesを事前取得（N+1防止）
        // "base_id:client_alias_name" => client_alias_id のマップを作成
        $aliasMap = ClientAlias::all()
                        ->mapWithKeys(fn($alias) => [
                            "{$alias->base_id}:{$alias->client_alias_name}" => $alias->client_alias_id
                        ])
                        ->toArray();
        // monthly_financialsに追加するデータを格納する配列を初期化
        $monthly_financials = [];
        // 取り込んだ収支データの分だけループ処理
        foreach($financial_imports as $import){
            // base_idとclient_alias_nameの組み合わせをキーにclient_alias_idを取得
            $key           = "{$import->base_id}:{$import->client_alias_name}";
            $client_alias_id = $aliasMap[$key] ?? null;
            // client_alias_idが解決できない場合はスキップ
            if (!$client_alias_id) continue;
            // monthly_financialsに追加するデータを配列に格納
            $monthly_financials[] = [
                'client_alias_id' => $client_alias_id,
                'year_month'      => $import->year_month,
                'sales_storage'   => $import->sales_storage,
                'sales_handling'  => $import->sales_handling,
                'sales_freight'   => $import->sales_freight,
                'sales_other'     => $import->sales_other,
                'cost_storage'    => $import->cost_storage,
                'cost_employee'   => $import->cost_employee,
                'cost_part'       => $import->cost_part,
                'cost_temp'       => $import->cost_temp,
                'cost_freight'    => $import->cost_freight,
                'cost_other'      => $import->cost_other,
                'cost_hq'         => $import->cost_hq,
            ];
        }
        // 200件ごとにupsert（client_alias_id + year_monthがユニーク制約のため既存データは上書き）
        foreach(collect($monthly_financials)->chunk(200) as $chunk){
            MonthlyFinancial::upsert(
                $chunk->values()->toArray(),
                ['client_alias_id', 'year_month'],
                [
                    'sales_storage', 'sales_handling', 'sales_freight', 'sales_other',
                    'cost_storage', 'cost_employee', 'cost_part', 'cost_temp',
                    'cost_freight', 'cost_other', 'cost_hq',
                ]
            );
        }
    }
}