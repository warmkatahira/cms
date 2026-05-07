import start_loading from './loading';

// 検索ボタンを押下した場合
$('#search_enter').on("click",function(){
    start_loading();
    // 検索タイプを設定
    $('#search_type').val('search');
    // フォームを送信
    $("#search_form").submit();
});

// クリアボタンを押下した場合
$('#search_clear').on("click",function(){
    start_loading();
    // 「disabled」を設定（送信されないようにしている）
    $('#search_type').prop('disabled', true);
    // 検索条件の値をnullに変更
    $('.search_element').each(function(){
        $(this).val(null);
    });
    // フォームを送信
    $("#search_form").submit();
});

// datalistタグの検索値候補を常に全件表示する処理
$(".datalist_element").on("mousedown", function() {
    // 検索候補値を取得
    let select_items = $(this).val();
    // 入力を一時的に削除
    $(this).val("");
    // 少し待ってから値を戻す
    setTimeout(() => {
        $(this).val(select_items);
    }, 100);
});