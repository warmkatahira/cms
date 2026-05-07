<?php

namespace App\Enums;

enum SystemEnum
{
    // 顧客名
    const CUSTOMER_NAME_JP          = '株式会社ワーム';
    const CUSTOMER_NAME_EN          = 'warm';
    // システム名
    const SYSTEM_NAME_JP            = '有給管理システム';
    // ページネーションの値を定義
    const PAGINATE_DEFAULT          = 50;
    const PAGINATE_OPERATION_LOG    = 200;
    // 初期画像のファイル名を定義
    const DEFAULT_IMAGE_FILE_NAME   = 'no_image.png';
    // 顧客名とシステム名を結合して返す
    public static function getSystemTitle()
    {
        return self::CUSTOMER_NAME_JP . ' ' . self::SYSTEM_NAME_JP;
    }
}