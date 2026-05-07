<?php

use Illuminate\Foundation\Console\ClosureCommand;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
// その他
use Illuminate\Support\Facades\Schedule;

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-   Daily   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// DBバックアップの削除を毎日「03:00」に実行
Schedule::command('backup_db_delete')->dailyAt('03:00');
// DBバックアップを毎日「03:30」に実行
Schedule::command('backup:run --disable-notifications --only-db --only-to-disk=db_backup_normal')->dailyAt('03:30');
