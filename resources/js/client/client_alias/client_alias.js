import start_loading from '../../loading';

$(function () {
    $('.select2').select2({
        placeholder: '顧客名を入力して検索',
        allowClear: true,
        width: '100%',
        language: {
            noResults: function () {
                return '該当する顧客が見つかりません';
            },
            searching: function () {
                return '検索中...';
            },
        },
    });
});

// 取り込みボタンを押下した場合
$('#client_alias_create_enter').on("click",function(){
    // 処理を実行するか確認
    const result = window.confirm("登録を実行しますか？");
    // 「はい」が押下されたらsubmit、「いいえ」が押下されたら処理キャンセル
    if(result === true){
        start_loading();
        $("#client_alias_create_form").submit();
    }
});