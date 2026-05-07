export default function playNumberSound(number) {
    // 数字を音声ファイル配列に変換
    const files = convertNumberToSoundFiles(number);
    // 最後に「点です」を追加
    files.push('点です');
    // 順番に再生する（Promiseで制御）
    playSequentially(files);
}

/**
 * 数字を音声ファイル配列に変換
 * 例: 14 → ["10", "4"], 234 → ["200", "30", "4"]
 */
function convertNumberToSoundFiles(number) {
    // 送られてきた数字を数値型に変換
    const num = Number(number);
    // 配列を初期化
    const files = [];
    // 数字が1000以上の場合
    if(num >= 1000){
        const thousands = Math.floor(num / 1000) * 1000;
        files.push(String(thousands));
    }
    // 1000で割った余りが100〜999の範囲の場合
    if(num % 1000 >= 100){
        const hundreds = Math.floor((num % 1000) / 100) * 100;
        if (hundreds > 0) files.push(String(hundreds));
    }
    // 100で割った余りが10〜99の範囲の場合
    if(num % 100 >= 10){
        const tens = Math.floor((num % 100) / 10) * 10;
        if (tens > 0) files.push(String(tens));
    }
    // 一の位を取得
    const ones = num % 10;
    if(ones > 0) files.push(String(ones));
    // 0 の場合
    if(files.length === 0){
        files.push('0');
    }
    return files;
}

/**
 * 与えられたファイル配列を順番に再生する
 */
function playSequentially(files) {
    // ファイルがない場合
    if (files.length === 0) return;
    // 再生すべき最初のファイルを取得し、残りを rest に分割
    const [first, ...rest] = files;
    // 最初の音声ファイルを生成・再生
    const audio = new Audio(`/audio/number/${first}.mp3`);
    audio.play();
    // 再生が終わったら、残りのファイルを順番に再生
    audio.addEventListener('ended', () => {
        playSequentially(rest);
    });
}