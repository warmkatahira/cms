<form method="POST"
      action="{{ $form_mode === 'create'
                    ? route('employee_create.create')
                    : route('employee_update.update') }}"
      id="employee_form">
    @csrf
    <div class="flex flex-col border border-gray-400 divide-y divide-gray-400">
        <x-form.switch-boolean label="ステータス" id="is_active" name="is_active" label0="無効" label1="有効" :value="$form_mode === 'update' ? $employee->is_active : null" required="true" />
        <x-form.p label="営業所" :value="$employee->base->base_name" grayedOut="true" />
        <x-form.p label="従業員番号" :value="$employee->employee_no" grayedOut="true" />
        <x-form.p label="氏名" :value="$employee->user_name" grayedOut="true" />
    </div>
    @if($form_mode === 'update')
        <input type="hidden" name="user_no" value="{{ $employee->user_no }}">
    @endif
    <button type="button" id="employee_{{ $form_mode }}_enter" class="btn bg-btn-enter p-3 text-white w-56 ml-auto mt-3"><i class="las la-check la-lg mr-1"></i>{{ $form_mode === 'create' ? '追加' : '更新' }}</button>
</form>