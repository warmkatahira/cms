<?php

namespace App\Http\Requests\SystemAdmin\User;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\BaseRequest;

class UserUpdateRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        // 送信されていない = 無効なので、0をパラメータにマージする
        $this->merge([
            'status' => $this->has('status') ? $this->input('status') : 0,
            'is_auto_update_statutory_leave_remaining_days' => $this->has('is_auto_update_statutory_leave_remaining_days') ? $this->input('is_auto_update_statutory_leave_remaining_days') : 0,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_no'                                       => 'required|exists:users,user_no',
            'status'                                        => 'required|boolean',
            'base_id'                                       => 'required|exists:bases,base_id',
            'employee_no'                                   => 'required|string|max:4',
            'user_name'                                     => 'required|string|max:20',
            'is_auto_update_statutory_leave_remaining_days' => 'required|boolean',
            'role_id'                                       => 'required|exists:roles,role_id',
        ];
    }

    public function messages()
    {
        return parent::messages();
    }

    public function attributes()
    {
        return parent::attributes();
    }
}