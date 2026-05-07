<?php

namespace App\Http\Requests\Admin\FileImport;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\BaseRequest;

class FileImportRequest extends BaseRequest
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
            'employee_file'     => 'required|file|mimes:csv,txt|max:10240',
            'paid_leave_file'   => 'required|file|mimes:csv,txt|max:10240',
        ];
    }

    public function messages()
    {
        return array_merge(parent::messages(), [
            'employee_file.max'     => ":attributeは10MB以下のファイルをアップロードしてください。",
            'paid_leave_file.max'   => ":attributeは10MB以下のファイルをアップロードしてください。",
        ]);
    }

    public function attributes()
    {
        return parent::attributes();
    }
}