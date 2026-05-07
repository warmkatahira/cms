<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ErrorFileDownloadController extends Controller
{
    public function download(Request $request)
    {
        // ファイル名とフルパスを変数に格納
        $filename = $request->filename;
        $path = storage_path('app/public/export/error/'.$filename);
        // ファイルが存在しない場合はエラーを返す
        if(!file_exists($path)){
            return redirect()->back()->with([
                'alert_type' => 'error',
                'alert_message' => 'ファイルが存在しません。',
            ]);
        }
        // ダウンロード処理
        $headers = [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8',
            'Content-Disposition' => 'attachment; filename=' . $filename,
        ];
        return response()->download($path, $filename, $headers);
    }
}