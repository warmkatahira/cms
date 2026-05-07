<?php

namespace App\Services\Admin\Employee;

// モデル
use App\Models\User;
// その他
use Symfony\Component\HttpFoundation\StreamedResponse;
use Carbon\CarbonImmutable;
// 列挙
use App\Enums\SystemEnum;

class EmployeeDownloadService
{
    // ダウンロードするデータを取得
    public function getDownloadData($employees)
    {
        // チャンクサイズを指定
        $chunk_size = 1000;
        $response = new StreamedResponse(function () use ($employees, $chunk_size){
            // ハンドルを取得
            $handle = fopen('php://output', 'wb');
            // BOMを書き込む
            fwrite($handle, "\xEF\xBB\xBF");
            // システムに定義してあるヘッダーを取得し、書き込む
            $header = User::downloadHeader();
            fputcsv($handle, $header);
            // レコードをチャンクごとに書き込む
            $employees->chunk($chunk_size, function ($employees) use ($handle){
                // 従業員の分だけループ処理
                foreach($employees as $employee){
                    // 変数に情報を格納
                    $row = [
                        $employee->is_active_text,
                        $employee->base?->base_name,
                        $employee->employee_no,
                        $employee->user_name,
                        CarbonImmutable::parse($employee->hire_date)->isoFormat('YYYY年MM月DD日'),
                        $employee->service_years,
                        $employee->next_grant_year_month ? CarbonImmutable::createFromFormat('Ym', $employee->next_grant_year_month)->isoFormat('YYYY年MM月') : '',
                        $employee->used_days_reset_year_month ? CarbonImmutable::createFromFormat('Ym', $employee->used_days_reset_year_month)->isoFormat('YYYY年MM月') : '',
                        $employee->grant_type->label(),
                        $employee->work_days_per_week,
                        number_format($employee->carried_over_days, 1),
                        number_format($employee->granted_days, 1),
                        number_format($employee->total_days, 1),
                        number_format($employee->used_days, 1),
                        number_format($employee->remaining_days, 1),
                        number_format($employee->carried_over_required_days, 1),
                        number_format($employee->granted_required_days, 1),
                        number_format($employee->total_required_days, 1),
                        number_format($employee->remaining_required_days, 1),
                        $employee->required_deadline ? CarbonImmutable::parse($employee->required_deadline)->isoFormat('YYYY年MM月DD日') : '',
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
}