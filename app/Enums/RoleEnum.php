<?php

namespace App\Enums;

enum RoleEnum
{
    // 権限
    const SYSTEM_ADMIN  = 'system_admin';
    const ADMIN         = 'admin';
    const BASE_ADMIN    = 'base_admin';
    const USER          = 'user';
}