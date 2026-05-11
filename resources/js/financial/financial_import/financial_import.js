import start_loading from '../../loading';

$(function () {
    setupFileInput('financial_file', 'financial_file_label_1', 'financial_file_area_1');
    function setupFileInput(inputId, labelId, dropAreaId) {
        const input = document.getElementById(inputId);
        const label = document.getElementById(labelId);
        const dropArea = document.getElementById(dropAreaId);
        // ドロップエリアクリックでファイル選択ダイアログを開く
        dropArea.addEventListener('click', function () {
            input.click();
        });
        // ファイル選択時にファイル名をラベルに反映
        input.addEventListener('change', function () {
            updateLabel(this.files[0]);
        });
        // ファイル名表示・スタイル更新
        function updateLabel(file) {
            if (file) {
                label.textContent = file.name;
                label.classList.add('text-blue-600');
                dropArea.classList.add('border-blue-400', 'bg-blue-50');
                dropArea.classList.remove('border-gray-200');
            }
        }
        // ドラッグ中にエリアをハイライト
        dropArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('border-blue-400', 'bg-blue-50');
            this.classList.remove('border-gray-200');
        });
        // エリア外に出たらハイライトを解除（ファイル未選択時のみ）
        dropArea.addEventListener('dragleave', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!input.files || !input.files[0]) {
                this.classList.remove('border-blue-400', 'bg-blue-50');
                this.classList.add('border-gray-200');
            }
        });
        // ドロップ時にファイルをinputにセットしてラベルを更新
        dropArea.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const file = e.dataTransfer.files[0];
            if (!file) return;
            // 大文字小文字を区別せずcsvのみ許可
            if (!file.name.toLowerCase().endsWith('.csv')) {
                alert('.csvファイルのみ対応しています');
                return;
            }
            const dt = new DataTransfer();
            dt.items.add(file);
            input.files = dt.files;
            updateLabel(file);
        });
    }
});

// 取り込みボタンを押下した場合
$('#financial_import_enter').on("click",function(){
    // ファイルを取得
    const file = document.getElementById('financial_file').files[0];
    // ファイルが存在しない場合
    if(!file){
        alert('ファイルを選択してください');
        return;
    }
    // 処理を実行するか確認
    const result = window.confirm("収支データ取込を実行しますか？");
    // 「はい」が押下されたらsubmit、「いいえ」が押下されたら処理キャンセル
    if(result === true){
        start_loading();
        $("#file_import_form").submit();
    }
});