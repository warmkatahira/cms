<?php

namespace App\Http\Requests\Admin\Employee;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\BaseRequest;
// その他
use Illuminate\Validation\Rule;
// 列挙
use App\Enums\WorkingHourEnum;

class EmployeeUpdateRequest extends BaseRequest
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
            'is_active' => $this->has('is_active') ? $this->input('is_active') : 0,
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
            'is_active'                                     => 'required|boolean',
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