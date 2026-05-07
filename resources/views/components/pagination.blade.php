@props([
    'pages',
    'mlAutoInvalid' => false,
])

<!-- ページネーション -->
<div class="@if(!$mlAutoInvalid) ml-auto @endif">
    @if($pages)
        <div>
            {{ $pages->appends(request()->input())->links() }}
        </div>
    @endif
</div>