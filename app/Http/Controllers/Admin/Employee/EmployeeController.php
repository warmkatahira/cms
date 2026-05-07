<?php

namespace App\Http\Controllers\Admin\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// モデル
use App\Models\User;
use App\Models\Base;
use App\Models\Role;
// サービス
use App\Services\SystemAdmin\User\UserSearchService;
// 列挙
use App\Enums\GrantTypeEnum;
// トレイト
use App\Traits\PaginatesResultsTrait;

class EmployeeController extends Controller
{
    use PaginatesResultsTrait;

    public function index(Request $request)
    {
        // ページヘッダーをセッションに格納
        session(['page_header' => '従業員一覧']);
        // インスタンス化
        $UserSearchService = new UserSearchService;
        // セッションを削除
        $UserSearchService->deleteSession();
        // セッションに検索条件を格納
        $UserSearchService->setSearchCondition($request);
        // 検索結果を取得
        $result = $UserSearchService->getSearchResult();
        // ページネーションを実施
        $employees = $this->setPagination($result);
        // 営業所を取得
        $bases = Base::getAll()->get();
        // 権限を取得
        $roles = Role::getAll()->get();
        // 付与区分を取得
        $grant_types = GrantTypeEnum::selectOptions();
        return view('admin.employee.index')->with([
            'employees' => $employees,
            'bases' => $bases,
            'roles' => $roles,
            'grant_types' => $grant_types,
        ]);
    }
}