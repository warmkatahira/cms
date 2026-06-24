<?php

function staffChip(string $name, ?string $role, int $color, string $shape = 'rect', ?string $width = null, ?string $height = null): string
{
    $colors = [
        ['bg'=>'#E6F1FB','border'=>'#378ADD','text'=>'#0C447C'],
        ['bg'=>'#EAF3DE','border'=>'#639922','text'=>'#27500A'],
        ['bg'=>'#FAEEDA','border'=>'#BA7517','text'=>'#633806'],
        ['bg'=>'#FBEAF0','border'=>'#D4537E','text'=>'#72243E'],
        ['bg'=>'#E1F5EE','border'=>'#1D9E75','text'=>'#085041'],
        ['bg'=>'#EEEDFE','border'=>'#7F77DD','text'=>'#3C3489'],
        ['bg'=>'#FAECE7','border'=>'#D85A30','text'=>'#711B13'],
    ];
    $c = $colors[$color % count($colors)];
    $w = $width ?? '90px';
    $h = $height ? 'height:' . $height . ';' : '';

    $shapeStyles = [
        'rect'           => 'border-radius:8px;',
        'circle'         => 'border-radius:50%;',
        'sharp'          => 'border-radius:0;',
        'rounded_bottom' => 'border-radius:0 0 50% 50%;',
        'tab'            => 'border-radius:0 0 8px 8px;border-top:4px solid '.$c['border'].';',
    ];
    $shapeStyle = $shapeStyles[$shape] ?? $shapeStyles['rect'];

    return '
        <div class="staff-chip-wrap" style="position:relative;display:inline-block;">
            <div style="
                width:'.$w.';'.$h.'padding:6px;
                border:2px solid '.$c['border'].';background:'.$c['bg'].';
                text-align:center;'.$shapeStyle.'
            ">
                <div data-field="name" style="font-size:12px;font-weight:500;color:'.$c['text'].';">'.$name.'</div>
                <div data-field="role" style="font-size:10px;color:'.$c['text'].';opacity:.7;">'.($role ?? '').'</div>
            </div>
            <div class="chip-edit-btn" data-tippy-content="編集" style="
                display:none;position:absolute;top:-7px;right:-7px;
                width:18px;height:18px;border-radius:50%;
                background:#374151;color:white;font-size:10px;
                align-items:center;justify-content:center;
                cursor:pointer;z-index:10;
            ">✏</div>
            <div class="chip-copy-btn" data-tippy-content="複製" style="
                display:none;position:absolute;top:-7px;right:14px;
                width:18px;height:18px;border-radius:50%;
                background:#374151;color:white;font-size:10px;
                align-items:center;justify-content:center;
                cursor:pointer;z-index:10;
            ">📋</div>
            <div class="chip-resize-handle" data-tippy-content="サイズ変更" style="
                display:none;position:absolute;bottom:-4px;right:-4px;
                width:14px;height:14px;border-radius:2px;
                color:#374151;font-size:18px;line-height:14px;text-align:center;
                cursor:se-resize;z-index:10;user-select:none;
            ">⤡</div>
        </div>';
}

function zoneColor(int $i, string $key): string
{
    $colors = [
        ['border'=>'#378ADD','bg'=>'rgba(56,138,221,0.06)','text'=>'#0C447C'],
        ['border'=>'#639922','bg'=>'rgba(99,153,34,0.06)', 'text'=>'#27500A'],
        ['border'=>'#D4537E','bg'=>'rgba(212,83,126,0.06)','text'=>'#72243E'],
        ['border'=>'#BA7517','bg'=>'rgba(186,117,23,0.06)','text'=>'#633806'],
        ['border'=>'#7F77DD','bg'=>'rgba(127,119,221,0.06)','text'=>'#3C3489'],
    ];
    return $colors[$i % count($colors)][$key];
}