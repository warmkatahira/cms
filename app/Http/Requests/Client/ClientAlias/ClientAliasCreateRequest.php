<?php

namespace App\Http\Requests\Client\ClientAlias;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\BaseRequest;

class ClientAliasCreateRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'aliases.*.client_id' => 'nullable|exists:clients,client_id',
        ];
    }

    public function messages()
    {
        return array_merge(parent::messages(), [
            'aliases.*.client_id.required' => '顧客を選択してください',
            'aliases.*.client_id.exists'   => '選択された顧客が存在しません',
        ]);
    }

    public function attributes()
    {
        return array_merge(parent::attributes(), [
            'aliases.*.client_id' => '紐付ける顧客',
        ]);
    }
}