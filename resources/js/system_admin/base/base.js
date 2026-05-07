import start_loading from '../../loading';

// 追加ボタンを押下した場合
$('#base_create_enter').on("click",function(){
    // 処理を実行するか確認
    const result = window.confirm("営業所追加を実行しますか？");
    // 「はい」が押下されたらsubmit、「いいえ」が押下されたら処理キャンセル
    if(result === true){
        start_loading();
        $("#base_form").submit();
    }
});

// 更新ボタンを押下した場合
$('#base_update_enter').on("click",function(){
    // 処理を実行するか確認
    const result = window.confirm("営業所更新を実行しますか？");
    // 「はい」が押下されたらsubmit、「いいえ」が押下されたら処理キャンセル
    if(result === true){
        start_loading();
        $("#base_form").submit();
    }
});