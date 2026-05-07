<?php

namespace App\Enums;

enum FileImportEnum
{
    // ファイル取込区分
    const FILE_IMPORT_TYPE_EMPLOYEE         = 'employee_file';
    const FILE_IMPORT_TYPE_PAID_LEAVE       = 'paid_leave_file';

    // ファイル取込区分の表示名を返す
    public static function getFileImportTypeLabel(string $type): string
    {
        return match($type) {
            self::FILE_IMPORT_TYPE_EMPLOYEE     => '従業員データ',
            self::FILE_IMPORT_TYPE_PAID_LEAVE   => '有給データ',
            default                             => '不明データ',
        };
    }
}