<form method="POST"
      action="{{ $form_mode === 'create'
                    ? route('user_create.create')
                    : route('user_update.update') }}"
      id="user_form">
    @csrf
    <div class="flex flex-col border border-gray-400 divide-y divide-gray-400">
        <x-form.switch-boolean label="ステータス" id="status" name="status" label0="無効" label1="有効" :value="$form_mode === 'update' ? $user->status : null" required="true" />
        <x-form.select label="営業所名" id="base_id" name="base_id" :value="$form_mode === 'update' ? $user->base_id : null" :items="$bases" optionValue="base_id" optionText="base_name" required="true" />
        <x-form.input type="text" label="従業員番号" id="employee_no" name="employee_no" :value="$form_mode === 'update' ? $user->employee_no : null" required="true" />
        <x-form.input type="text" label="氏名" id="user_name" name="user_name" :value="$form_mode === 'update' ? $user->user_name : null" required="true" />
        @if($form_mode === 'create')
            <x-form.input type="text" label="ユーザーID" id="user_id" name="user_id" :value="$form_mode === 'update' ? $user->user_id : null" required="true" />
        @else
            <x-form.p label="ユーザーID" :value="$user->user_id" grayedOut="true" />
        @endif
        <x-form.switch-boolean label="義務残日数自動更新" id="is_auto_update_statutory_leave_remaining_days" name="is_auto_update_statutory_leave_remaining_days"  label1="有効" label0="無効" :value="$form_mode === 'update' ? $user->is_auto_update_statutory_leave_remaining_days : null" required="true" />
        <x-form.select label="権限" id="role_id" name="role_id" :value="$form_mode === 'update' ? $user->role_id : null" :items="$roles" optionValue="role_id" optionText="role_name" required="true" />
    </div>
    @if($form_mode === 'update')
        <input type="hidden" name="user_no" value="{{ $user->user_no }}">
    @endif
    <button type="button" id="user_{{ $form_mode }}_enter" class="btn bg-btn-enter p-3 text-white w-56 ml-auto mt-3"><i class="las la-check la-lg mr-1"></i>{{ $form_mode === 'create' ? '追加' : '更新' }}</button>
</form>