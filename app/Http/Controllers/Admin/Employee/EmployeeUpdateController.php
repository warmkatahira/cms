<?php

namespace App\Http\Controllers\Admin\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\Base;
use App\Models\User;
use App\Models\WorkingHour;
// サービス
use App\Services\Admin\Employee\EmployeeUpdateService;
// リクエスト
use App\Http\Requests\Admin\Employee\EmployeeUpdateRequest;
// その他
use Illuminate\Support\Facades\DB;

class EmployeeUpdateController extends Controller
{
    public function index(Request $request)
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => '従業員更新']);
        // 従業員を取得
        $employee = User::with('base')->findOrFail($request->user_no);
        return view('admin.employee.update')->with([
            'employee' => $employee,
        ]);
    }

    public function update(EmployeeUpdateRequest $request)
    {
        try {
            DB::transaction(function () use ($request){
                // インスタンス化
                $EmployeeUpdateService = new EmployeeUpdateService;
                // 従業員を更新
                $EmployeeUpdateService->updateEmployee($request);
            });
        } catch (\Exception $e){
            return redirect()->back()->with([
                'alert_type' => 'error',
                'alert_message' => $e->getMessage(),
            ]);
        }
        return redirect()->route('employee.index')->with([
            'alert_type' => 'success',
            'alert_message' => '従業員更新が完了しました。',
        ]);
    }
}