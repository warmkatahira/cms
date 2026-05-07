<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\BaseRequest;
// その他
use Illuminate\Support\Facades\Auth;

class ProfileUpdateRequest extends BaseRequest
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
            'last_name'         => 'required|string|max:20',
            'first_name'        => 'required|string|max:20',
            'email'             => 'required|email|unique:users,email,'.Auth::user()->user_no.',user_no',
            'per_page'          => 'required|integer|min:1|max:1000',
        ];
    }

    public function messages()
    {
        return array_merge(parent::messages(), [
            'per_page.min'      => ':attributeは:min以上で入力して下さい。',
            'per_page.max'      => ':attributeは:max以下で入力して下さい。',
        ]);
    }

    public function attributes()
    {
        return parent::attributes();
    }
}