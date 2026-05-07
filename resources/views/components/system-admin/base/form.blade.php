<form method="POST"
      action="{{ $form_mode === 'create'
                    ? route('base_create.create')
                    : route('base_update.update') }}"
      id="base_form">
    @csrf
    <div class="flex flex-col border border-gray-400 divide-y divide-gray-400">
        @if($form_mode === 'create')
            <x-form.input type="text" label="営業所ID" id="base_id" name="base_id" :value="null" required="true" />
        @endif
        @if($form_mode === 'update')
            <x-form.p label="営業所ID" :value="$base->base_id" grayedOut="true" />
        @endif
        <x-form.input type="text" label="営業所名" id="base_name" name="base_name" :value="$form_mode === 'update' ? $base->base_name : null" required="true" />
        <x-form.input type="text" label="並び順" id="sort_order" name="sort_order" :value="$form_mode === 'update' ? $base->sort_order : null" required="true" />
    </div>
    @if($form_mode === 'update')
        <input type="hidden" name="base_id" value="{{ $base->base_id }}">
    @endif
    <button type="button" id="base_{{ $form_mode }}_enter" class="btn bg-btn-enter p-3 text-white w-56 ml-auto mt-3"><i class="las la-check la-lg mr-1"></i>{{ $form_mode === 'create' ? '追加' : '更新' }}</button>
</form>