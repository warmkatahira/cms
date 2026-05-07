<form method="POST"
      action="{{ route('working_hour_create.create') }}"
      id="working_hour_form">
    @csrf
    <div class="flex flex-col border border-gray-400 divide-y divide-gray-400">
        <x-form.select-array label="勤務区分" id="working_type" name="working_type" :items="$working_types" :value="null" required="true" />
        <x-form.input type="tel" label="勤務時間数" id="working_hour" name="working_hour" :value="null" required="true" />
    </div>
    <button type="button" id="working_hour_create_enter" class="btn bg-btn-enter p-3 text-white w-56 ml-auto mt-3"><i class="las la-check la-lg mr-1"></i>追加</button>
</form>