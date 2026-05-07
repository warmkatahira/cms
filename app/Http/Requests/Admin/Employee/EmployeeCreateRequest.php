<?php

namespace App\Http\Requests\Admin\Employee;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\BaseRequest;
// その他
use Illuminate\Validation\Rule;
// 列挙
use App\Enums\WorkingHourEnum;

class EmployeeCreateRequest extends BaseRequest
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
            'status'                                        => 'required|boolean',
            'base_id'                                       => 'required|exists:bases,base_id',
            'employee_no'                                   => 'required|string|max:4|unique:users,employee_no',
            'user_name'                                     => 'required|string|max:20',
            'user_id'                                       => 'required|string|max:20|unique:users,user_id|regex:/^[a-zA-Z0-9]+$/',
            'password'                                      => 'required|string|max:20|regex:/^[a-zA-Z0-9]+$/',
            'paid_leave_granted_days'                       => 'nullable|numeric|min:0|max:20|regex:/^\d+(\.5)?$/',
            'paid_leave_remaining_days'                     => 'nullable|numeric|min:0|max:20|regex:/^\d+(\.5)?$/',
            'paid_leave_used_days'                          => 'nullable|numeric|min:0|max:20|regex:/^\d+(\.5)?$/',
            'statutory_leave_days'                          => 'nullable|numeric|min:0|max:5|regex:/^\d+(\.5)?$/',
            'statutory_leave_remaining_days'                => 'nullable|numeric|min:0|max:5|regex:/^\d+(\.5)?$/',
            'daily_working_hours'                           => ['nullable',Rule::exists('working_hours', 'working_hour')->where('working_type', WorkingHourEnum::WORKING_TYPE_DAILY),],
            'half_day_working_hours'                        => ['nullable',Rule::exists('working_hours', 'working_hour')->where('working_type', WorkingHourEnum::WORKING_TYPE_HALF),],
            'statutory_leave_expiration_date'               => 'nullable|date_format:Y-m-d',
            'is_auto_update_statutory_leave_remaining_days' => 'nullable|boolean',
        ];
    }

    public function messages()
    {
        return array_merge(parent::messages(), [
            'password.regex'                        => ':attributeは半角英数字のみで入力して下さい。',
            'paid_leave_granted_days.regex'         => ':attributeは0.5刻みで入力して下さい。',
            'paid_leave_remaining_days.regex'       => ':attributeは0.5刻みで入力して下さい。',
            'paid_leave_used_days.regex'            => ':attributeは0.5刻みで入力して下さい。',
            'statutory_leave_days.regex'            => ':attributeは0.5刻みで入力して下さい。',
            'statutory_leave_remaining_days.regex'  => ':attributeは0.5刻みで入力して下さい。',
        ]);
    }

    public function attributes()
    {
        return parent::attributes();
    }
}