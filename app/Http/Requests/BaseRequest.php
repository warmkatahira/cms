<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BaseRequest extends FormRequest
{
    public function messages()
    {
        return [
            'required'                          => ":attributeは必須です。",
            'required_if'                       => ":attributeは必須です。",
            'required_with'                     => ":attributeは必須です。",
            'string'                            => ":attributeは文字列で入力して下さい。",
            'unique'                            => ":attributeは既に使用されています。",
            'image'                             => ":attributeは画像ファイルでなければなりません。",
            'mimes'                             => ":attributeは:values形式のみ許可されています。",
            'boolean'                           => ":attributeが正しくありません。",
            'exists'                            => ":attributeがシステムに存在しません。",
            'integer'                           => ":attributeは数値で入力して下さい。",
            'email'                             => "有効なメールアドレスを入力して下さい。",
            'unique'                            => ":attributeは既に使用されています。",
            'confirmed'                         => ":attributeが確認用と一致しません。",
            'date'                              => ":attributeが日付ではありません。",
            'max'                               => ":attributeは:max文字以下で入力して下さい。",
            'min'                               => ":attributeは:min文字以上で入力して下さい。",
            'sort_order.max'                    => ":attributeは:max以下で入力して下さい。",
            'in'                                => ":attributeが正しくありません。",
            'numeric'                           => ":attributeは数値で入力して下さい。",
        ];
    }

    public function attributes()
    {
        return [
            // 共通
            'sort_order'            => '並び順',
            // ファイル取込
            'financial_file'        => '収支データ',
            // 営業所情報
            'base_id'               => '営業所ID',
            'base_name'             => '営業所名',
            // ユーザー情報
            'user_id'               => 'ユーザーID',
            'user_name'             => '氏名',
            'password'              => 'パスワード',
            'is_active'             => 'ステータス',
        ];
    }
}