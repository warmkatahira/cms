// モーダルオーバーレイクリックで閉じる（共通）
$(document).on('click', '.modal_overlay', function (e) {
    if ($(e.target).is('.modal_overlay')) {
        $(this).hide();
    }
});

// 開く（共通）
$(document).on('click', '[data-modal-open]', function () {
    $($(this).data('modal-open')).show();
});

// 閉じる（共通）
$(document).on('click', '[data-modal-close]', function () {
    $(this).closest('.modal_overlay').hide();
});

$(function () {
    // モーダルをbody直下に移動
    $('body').append($('.modal_overlay'));
});