const board         = document.getElementById('board');
const tray          = document.getElementById('tray');
const WHITEBOARD_ID = parseInt(board.dataset.whiteboardId);
const CANVAS_W      = parseInt(board.dataset.canvasW);
const CANVAS_H      = parseInt(board.dataset.canvasH);
const BASE_ID       = document.getElementById('baseSel').value;
const CSRF          = document.querySelector('meta[name="csrf-token"]').content;

const COLORS = [
    { bg:'#E6F1FB', border:'#378ADD', text:'#0C447C' },
    { bg:'#EAF3DE', border:'#639922', text:'#27500A' },
    { bg:'#FAEEDA', border:'#BA7517', text:'#633806' },
    { bg:'#FBEAF0', border:'#D4537E', text:'#72243E' },
    { bg:'#E1F5EE', border:'#1D9E75', text:'#085041' },
    { bg:'#EEEDFE', border:'#7F77DD', text:'#3C3489' },
    { bg:'#FAECE7', border:'#D85A30', text:'#711B13' },
];
const SIZES = { XS: '50px', S: '70px', M: '90px', L: '110px', XL: '130px' };

let dragging = null;
let ghost    = null;
let offX = 0, offY = 0;
let pendingDrag   = null;
let pendingStartX = 0;
let pendingStartY = 0;

document.querySelectorAll('.magnet').forEach(el => initMagnet(el));

let draggingZone   = null;
let zoneGhost      = null;
let zoneOffX = 0, zoneOffY = 0;
let pendingZone    = null;
let pendingZoneCx  = 0;
let pendingZoneCy  = 0;

function startZoneDrag(e, el) {
    if (e.target.classList.contains('chip-edit-btn')) return;
    if (draggingZone) {
        draggingZone.style.opacity = '1';
        draggingZone = null;
    }
    if (zoneGhost) {
        zoneGhost.remove();
        zoneGhost = null;
    }
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    pendingZone   = el;
    pendingZoneCx = cx;
    pendingZoneCy = cy;
    document.addEventListener('mousemove', onZoneMoveCheck);
    document.addEventListener('mouseup',   onZoneCancelPending);
}

function onZoneMoveCheck(e) {
    const dx = e.clientX - pendingZoneCx;
    const dy = e.clientY - pendingZoneCy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        document.removeEventListener('mousemove', onZoneMoveCheck);
        document.removeEventListener('mouseup',   onZoneCancelPending);
        beginZoneDrag(pendingZone, pendingZoneCx, pendingZoneCy);
        pendingZone = null;
    }
}

function onZoneCancelPending() {
    document.removeEventListener('mousemove', onZoneMoveCheck);
    document.removeEventListener('mouseup',   onZoneCancelPending);
    pendingZone = null;
}

function beginZoneDrag(el, startCx, startCy) {
    draggingZone = el;
    const rect = el.getBoundingClientRect();
    zoneOffX = startCx - rect.left;
    zoneOffY = startCy - rect.top;

    zoneGhost = el.cloneNode(true);
    zoneGhost.style.cssText = `
        position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${rect.left}px;top:${rect.top}px;
        width:${rect.width}px;height:${rect.height}px;
    `;
    document.body.appendChild(zoneGhost);
    el.style.opacity = '0.3';

    document.addEventListener('mousemove', onZoneMove);
    document.addEventListener('mouseup',   onZoneUp);
    document.addEventListener('touchmove', onZoneTouchMove, { passive: false });
    document.addEventListener('touchend',  onZoneTouchEnd);
}

function onZoneMove(e)      { moveZoneGhost(e.clientX, e.clientY); }
function onZoneTouchMove(e) { e.preventDefault(); moveZoneGhost(e.touches[0].clientX, e.touches[0].clientY); }
function moveZoneGhost(cx, cy) {
    zoneGhost.style.left = (cx - zoneOffX) + 'px';
    zoneGhost.style.top  = (cy - zoneOffY) + 'px';
}

function onZoneUp(e)       { endZoneDrag(e.clientX, e.clientY); }
function onZoneTouchEnd(e) { endZoneDrag(e.changedTouches[0].clientX, e.changedTouches[0].clientY); }

function endZoneDrag(cx, cy) {
    document.removeEventListener('mousemove', onZoneMove);
    document.removeEventListener('mouseup',   onZoneUp);
    document.removeEventListener('touchmove', onZoneTouchMove);
    document.removeEventListener('touchend',  onZoneTouchEnd);
    zoneGhost.remove();
    zoneGhost = null;

    const boardRect = board.getBoundingClientRect();
    const zoneId    = draggingZone.dataset.zoneId;

    let px = cx - boardRect.left + board.scrollLeft - zoneOffX;
    let py = cy - boardRect.top  + board.scrollTop  - zoneOffY;

    // ゾーンサイズ（180x280）を考慮してキャンバス内に収める
    const zoneW = 180;
    const zoneH = 280;
    px = Math.max(0, Math.min(px, CANVAS_W - zoneW));
    py = Math.max(0, Math.min(py, CANVAS_H - zoneH));

    draggingZone.style.left    = px + 'px';
    draggingZone.style.top     = py + 'px';
    draggingZone.style.opacity = '1';
    draggingZone = null;

    fetch('/org_chart/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'client_zone',
            item_id:       parseInt(zoneId),
            on_board:      true,
            pos_x:         px,
            pos_y:         py,
        }),
    });
}

function startDrag(e, el) {
    if (dragging) {
        dragging.style.opacity = '1';
        dragging = null;
    }
    if (ghost) {
        ghost.remove();
        ghost = null;
    }
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    pendingDrag   = el;
    pendingStartX = cx;
    pendingStartY = cy;
    document.addEventListener('mousemove', onMoveCheck);
    document.addEventListener('mouseup',   onCancelPending);
}

function onMoveCheck(e) {
    const dx = e.clientX - pendingStartX;
    const dy = e.clientY - pendingStartY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        document.removeEventListener('mousemove', onMoveCheck);
        document.removeEventListener('mouseup',   onCancelPending);
        beginDrag(pendingDrag, pendingStartX, pendingStartY);
        pendingDrag = null;
    }
}

function onCancelPending() {
    document.removeEventListener('mousemove', onMoveCheck);
    document.removeEventListener('mouseup',   onCancelPending);
    pendingDrag = null;
}

function beginDrag(el, startCx, startCy) {
    dragging = el;
    const rect = el.getBoundingClientRect();
    offX = startCx - rect.left;
    offY = startCy - rect.top;
    ghost = el.cloneNode(true);
    ghost.style.cssText = `
        position:fixed;pointer-events:none;z-index:9999;opacity:0.85;
        left:${rect.left}px;top:${rect.top}px;
        transform:rotate(2deg) scale(1.05);
    `;
    document.body.appendChild(ghost);
    el.style.opacity = '0.3';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend',  onTouchEnd);
}

function onMove(e)      { moveGhost(e.clientX, e.clientY); }
function onTouchMove(e) { e.preventDefault(); moveGhost(e.touches[0].clientX, e.touches[0].clientY); }
function moveGhost(cx, cy) {
    ghost.style.left = (cx - offX) + 'px';
    ghost.style.top  = (cy - offY) + 'px';
}

function onUp(e)       { endDrag(e.clientX, e.clientY); }
function onTouchEnd(e) { endDrag(e.changedTouches[0].clientX, e.changedTouches[0].clientY); }

function endDrag(cx, cy) {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup',   onUp);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend',  onTouchEnd);
    ghost.remove();
    ghost = null;

    const boardRect   = board.getBoundingClientRect();
    const trayRect    = tray.getBoundingClientRect();
    const staffId     = dragging.dataset.id;

    const onBoard = cx >= boardRect.left && cx <= boardRect.right
                 && cy >= boardRect.top  && cy <= boardRect.bottom;
    const onTray  = cx >= trayRect.left  && cx <= trayRect.right
                 && cy >= trayRect.top   && cy <= trayRect.bottom;

    if (onBoard) {
        let px = cx - boardRect.left + board.scrollLeft - offX;
        let py = cy - boardRect.top  + board.scrollTop  - offY;

        // キャンバス内に収める
        px = Math.max(0, Math.min(px, CANVAS_W - 80));
        py = Math.max(0, Math.min(py, CANVAS_H - 50));

        saveItem(staffId, true, px, py);
        dragging.style.position = 'absolute';
        dragging.style.left = px + 'px';
        dragging.style.top  = py + 'px';
        document.getElementById('board-canvas').appendChild(dragging);
    } else if (onTray) {
        saveItem(staffId, false, 0, 0);
        dragging.style.position = '';
        dragging.style.left = '';
        dragging.style.top  = '';
        tray.appendChild(dragging);
    }

    dragging.style.opacity = '1';
    dragging = null;
}

function saveItem(staffId, onBoard, posX, posY) {
    fetch('/org_chart/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_id:       parseInt(staffId),
            on_board:      onBoard,
            pos_x:         posX,
            pos_y:         posY,
        }),
    });
}

// スタッフ追加
window.addStaff = function() {
    const name = document.getElementById('newName').value.trim();
    const role = document.getElementById('newRole').value.trim();
    if (!name) return;
    fetch('/org_chart/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({ base_id: BASE_ID, 'staff_name': name, 'role_name': role }),
    })
    .then(r => r.json())
    .then(data => {
        const s = data.staff;
        const c = COLORS[(s.color ?? 0) % COLORS.length];
        const w = SIZES[s.size ?? 'M'];
        const el = document.createElement('div');
        el.className     = 'magnet cursor-grab select-none';
        el.dataset.id    = s.staff_id;
        el.dataset.color = s.color;
        el.dataset.name = s.staff_name;
        el.dataset.role = s.role_name ?? '';
        el.dataset.size = s.size ?? 'M';
        el.dataset.shape = s.shape ?? 'rect';
        el.innerHTML = `
                <div class="staff-chip-wrap" style="position:relative;display:inline-block;">
                    <div style="
                        width:${w};padding:6px;border-radius:8px;text-align:center;
                        border:2px solid ${c.border};background:${c.bg};
                    ">
                        <div data-field="name" style="font-size:12px;font-weight:500;color:${c.text};">${s.staff_name}</div>
                        <div data-field="role" style="font-size:10px;color:${c.text};opacity:.7;">${s.role_name ?? ''}</div>
                    </div>
                    <div class="chip-edit-btn" style="
                        display:none;position:absolute;top:-7px;right:-7px;
                        width:18px;height:18px;border-radius:50%;
                        background:#374151;color:white;font-size:10px;
                        align-items:center;justify-content:center;
                        cursor:pointer;z-index:10;
                    ">✏</div>
                </div>`;
        initMagnet(el);
        tray.appendChild(el);
        document.getElementById('newName').value = '';
        document.getElementById('newRole').value = '';
    });
}

// 編集モーダル
const modal = document.createElement('div');
modal.id = 'staff-edit-modal';
modal.style.cssText = `
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;
modal.innerHTML = `
    <div style="background:white;border-radius:12px;padding:24px;width:340px;">
        <p style="font-size:15px;font-weight:500;margin-bottom:16px;">スタッフを編集</p>
        <div style="display:flex;gap:0;margin-bottom:16px;border-bottom:2px solid #e5e7eb;">
            <div class="modal-tab active-tab" data-tab="basic"
                 style="padding:6px 16px;font-size:13px;cursor:pointer;font-weight:500;
                        border-bottom:2px solid #374151;margin-bottom:-2px;color:#374151;">
                基本情報
            </div>
            <div class="modal-tab" data-tab="appearance"
                 style="padding:6px 16px;font-size:13px;cursor:pointer;font-weight:500;
                        border-bottom:2px solid transparent;margin-bottom:-2px;color:#9ca3af;">
                見た目
            </div>
        </div>
        <div id="tab-basic">
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:4px;">氏名</label>
                <input id="edit-name" type="text" autocomplete="off"
                       style="width:100%;font-size:14px;border:1px solid #d1d5db;border-radius:6px;padding:6px 10px;">
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:4px;">役割</label>
                <input id="edit-role" type="text" autocomplete="off"
                       style="width:100%;font-size:14px;border:1px solid #d1d5db;border-radius:6px;padding:6px 10px;">
            </div>
        </div>
        <div id="tab-appearance" style="display:none;">
            <div style="margin-bottom:16px;">
                <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:8px;">色</label>
                <div style="display:flex;gap:8px;">
                    ${COLORS.map((c, i) => `
                        <div class="edit-color-chip" data-color="${i}"
                             style="width:24px;height:24px;border-radius:50%;cursor:pointer;
                                    background:${c.bg};border:2px solid ${c.border};">
                        </div>
                    `).join('')}
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:8px;">サイズ</label>
                <div style="display:flex;gap:8px;">
                    ${['XS','S','M','L','XL'].map(s => `
                        <div class="edit-size-chip" data-size="${s}"
                             style="width:40px;height:32px;border-radius:6px;cursor:pointer;
                                    display:flex;align-items:center;justify-content:center;
                                    font-size:13px;font-weight:500;
                                    border:1.5px solid #d1d5db;color:#374151;background:white;">
                            ${s}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:8px;">形</label>
                <div style="display:flex;gap:8px;">
                    <div class="edit-shape-chip" data-shape="rect"
                         style="width:40px;height:40px;cursor:pointer;border:1.5px solid #d1d5db;
                                border-radius:6px;background:white;display:flex;align-items:center;justify-content:center;">
                        <div style="width:24px;height:24px;border-radius:4px;background:#d1d5db;"></div>
                    </div>
                    <div class="edit-shape-chip" data-shape="circle"
                         style="width:40px;height:40px;cursor:pointer;border:1.5px solid #d1d5db;
                                border-radius:6px;background:white;display:flex;align-items:center;justify-content:center;">
                        <div style="width:24px;height:24px;border-radius:50%;background:#d1d5db;"></div>
                    </div>
                    <div class="edit-shape-chip" data-shape="sharp"
                         style="width:40px;height:40px;cursor:pointer;border:1.5px solid #d1d5db;
                                border-radius:6px;background:white;display:flex;align-items:center;justify-content:center;">
                        <div style="width:24px;height:24px;border-radius:0;background:#d1d5db;"></div>
                    </div>
                    <div class="edit-shape-chip" data-shape="rounded_bottom"
                        style="width:40px;height:40px;cursor:pointer;border:1.5px solid #d1d5db;
                                border-radius:6px;background:white;display:flex;align-items:center;justify-content:center;">
                        <div style="width:24px;height:24px;border-radius:0 0 50% 50%;background:#d1d5db;"></div>
                    </div>
                    <div class="edit-shape-chip" data-shape="tab"
                         style="width:40px;height:40px;cursor:pointer;border:1.5px solid #d1d5db;
                                border-radius:6px;background:white;display:flex;align-items:center;justify-content:center;">
                        <div style="width:24px;height:24px;border-radius:0 0 4px 4px;background:#d1d5db;
                                    border-top:3px solid #9ca3af;"></div>
                    </div>
                </div>
            </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
            <button id="edit-delete"
                    style="font-size:13px;padding:6px 16px;border:1px solid #fca5a5;
                           border-radius:6px;cursor:pointer;background:white;color:#dc2626;">
                削除
            </button>
            <div style="display:flex;gap:8px;">
                <button id="edit-cancel"
                        style="font-size:13px;padding:6px 16px;border:1px solid #d1d5db;
                               border-radius:6px;cursor:pointer;background:white;">
                    キャンセル
                </button>
                <button id="edit-save"
                        style="font-size:13px;padding:6px 16px;border:none;
                               border-radius:6px;cursor:pointer;background:#374151;color:white;">
                    保存
                </button>
            </div>
        </div>
    </div>
`;
document.body.appendChild(modal);

// モーダルの色チップ選択
let selectedColor = 0;
let selectedSize  = 'M';
let selectedShape = 'rect';

// タブ切り替え
modal.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        modal.querySelectorAll('.modal-tab').forEach(t => {
            t.style.borderBottomColor = 'transparent';
            t.style.color = '#9ca3af';
        });
        tab.style.borderBottomColor = '#374151';
        tab.style.color = '#374151';
        document.getElementById('tab-basic').style.display      = tab.dataset.tab === 'basic'      ? 'block' : 'none';
        document.getElementById('tab-appearance').style.display = tab.dataset.tab === 'appearance' ? 'block' : 'none';
    });
});

// 色チップ
modal.querySelectorAll('.edit-color-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        selectedColor = parseInt(chip.dataset.color);
        modal.querySelectorAll('.edit-color-chip').forEach(c => {
            c.style.transform = 'scale(1)';
            c.style.outline   = 'none';
        });
        chip.style.transform     = 'scale(1.2)';
        chip.style.outline       = '2px solid #374151';
        chip.style.outlineOffset = '2px';
    });
});

// サイズチップ
modal.querySelectorAll('.edit-size-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        selectedSize = chip.dataset.size;
        modal.querySelectorAll('.edit-size-chip').forEach(c => {
            c.style.background  = 'white';
            c.style.borderColor = '#d1d5db';
            c.style.color       = '#374151';
        });
        chip.style.background  = '#374151';
        chip.style.borderColor = '#374151';
        chip.style.color       = 'white';
    });
});

// 形チップ
modal.querySelectorAll('.edit-shape-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        selectedShape = chip.dataset.shape;
        modal.querySelectorAll('.edit-shape-chip').forEach(c => {
            c.style.borderColor = '#d1d5db';
            c.style.background  = 'white';
        });
        chip.style.borderColor = '#374151';
        chip.style.background  = '#f3f4f6';
    });
});

document.getElementById('edit-cancel').addEventListener('click', () => {
    modal.style.display = 'none';
});

// 右クリックイベント
let activeStaffId  = null;
let activeMagnetEl = null;

function initMagnet(el) {
    el.addEventListener('mousedown',  e => startDrag(e, el));
    el.addEventListener('touchstart', e => startDrag(e, el), { passive: false });

    // ホバーで編集ボタン表示
    el.addEventListener('mouseenter', () => {
        const btn = el.querySelector('.chip-edit-btn');
        if (btn) btn.style.display = 'flex';
    });
    el.addEventListener('mouseleave', () => {
        const btn = el.querySelector('.chip-edit-btn');
        if (btn) btn.style.display = 'none';
    });

    // 編集ボタンクリック
    const editBtn = el.querySelector('.chip-edit-btn');
    if (editBtn) {
        editBtn.addEventListener('mousedown', e => e.stopPropagation()); // ドラッグ阻止
        editBtn.addEventListener('click', e => {
            e.stopPropagation();
            openEditModal(e, el);
        });
    }
}

function openEditModal(e, el) {
    e.preventDefault();
    activeStaffId  = el.dataset.id;
    activeMagnetEl = el;

    document.getElementById('edit-name').value = el.dataset.name ?? '';
    document.getElementById('edit-role').value = el.dataset.role ?? '';
    selectedColor = parseInt(el.dataset.color ?? 0) || 0;
    selectedSize  = el.dataset.size ?? 'M';
    selectedShape = el.dataset.shape ?? 'rect';

    // 色チップのハイライト
    modal.querySelectorAll('.edit-color-chip').forEach(c => {
        c.style.transform = 'scale(1)';
        c.style.outline   = 'none';
    });
    const activeChip = modal.querySelector(`.edit-color-chip[data-color="${selectedColor}"]`);
    if (activeChip) {
        activeChip.style.transform     = 'scale(1.2)';
        activeChip.style.outline       = '2px solid #374151';
        activeChip.style.outlineOffset = '2px';
    }
    // サイズチップのハイライト
    modal.querySelectorAll('.edit-size-chip').forEach(c => {
        const active = c.dataset.size === selectedSize;
        c.style.background  = active ? '#374151' : 'white';
        c.style.borderColor = active ? '#374151' : '#d1d5db';
        c.style.color       = active ? 'white'   : '#374151';
    });

    // 形チップのハイライト
    selectedShape = el.dataset.shape ?? 'rect';
    modal.querySelectorAll('.edit-shape-chip').forEach(c => {
        const active = c.dataset.shape === selectedShape;
        c.style.borderColor = active ? '#374151' : '#d1d5db';
        c.style.background  = active ? '#f3f4f6' : 'white';
    });

    // タブを基本情報に戻す
    document.getElementById('tab-basic').style.display      = 'block';
    document.getElementById('tab-appearance').style.display = 'none';
    modal.querySelectorAll('.modal-tab').forEach(t => {
        const isBasic = t.dataset.tab === 'basic';
        t.style.borderBottomColor = isBasic ? '#374151' : 'transparent';
        t.style.color             = isBasic ? '#374151' : '#9ca3af';
    });

    modal.style.display = 'flex';
}

// 保存
document.getElementById('edit-save').addEventListener('click', () => {
    const name = document.getElementById('edit-name').value.trim();
    const role = document.getElementById('edit-role').value.trim();
    if (!name) return;
    fetch('/org_chart/staff/' + activeStaffId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({ staff_name: name, role_name: role, color: selectedColor, size: selectedSize, shape: selectedShape }),
    })
    .then(r => r.json())
    .then(() => {
        const c = COLORS[selectedColor];
        // staff-chip-wrapの中のdivを取得
        const wrap = activeMagnetEl.querySelector('.staff-chip-wrap');
        const chip = wrap.querySelector('div');  // ← 内側のdivを正しく取得
        chip.style.background  = c.bg;
        chip.style.borderColor = c.border;
        chip.style.width       = SIZES[selectedSize];  // ← サイズ更新
        const SHAPES = {
            rect:   'border-radius:8px;clip-path:none;',
            circle: 'border-radius:50%;clip-path:none;',
            sharp:  'border-radius:0;clip-path:none;',
            rounded_bottom: 'border-radius:0 0 50% 50%;clip-path:none;',
            tab:    'border-radius:0 0 8px 8px;clip-path:none;',
        };
        chip.style.cssText = `
            background:${c.bg};
            border:2px solid ${c.border};
            border-top:${selectedShape === 'tab' ? '4px' : '2px'} solid ${c.border};
            width:${SIZES[selectedSize]};
            padding:6px;
            text-align:center;
            ${SHAPES[selectedShape] ?? SHAPES['rect']}
        `;
        activeMagnetEl.dataset.shape = selectedShape;
        activeMagnetEl.dataset.size  = selectedSize;
        activeMagnetEl.dataset.color = selectedColor;
        activeMagnetEl.dataset.name  = name;
        activeMagnetEl.dataset.role  = role;
        const nameEl = wrap.querySelector('[data-field="name"]');
        const roleEl = wrap.querySelector('[data-field="role"]');
        if (nameEl) { nameEl.textContent = name; nameEl.style.color = c.text; }
        if (roleEl) { roleEl.textContent = role; roleEl.style.color = c.text; }
        modal.style.display = 'none';
    });
});

document.getElementById('edit-delete').addEventListener('click', () => {
    if (!confirm('このスタッフを削除しますか？')) return;
    fetch('/org_chart/staff/' + activeStaffId, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': CSRF },
    })
    .then(r => r.json())
    .then(() => {
        activeMagnetEl.remove();
        modal.style.display = 'none';
    });
});

// パン処理
let isPanning  = false;
let panStartX  = 0;
let panStartY  = 0;
let scrollLeft = 0;
let scrollTop  = 0;

board.addEventListener('mousedown', e => {
    // 磁石・ゾーン以外の場所でパン開始
    if (
        e.target === board ||
        e.target.id === 'board-canvas' ||
        e.target.closest('#board-canvas') === document.getElementById('board-canvas') &&
        !e.target.closest('.magnet') &&
        !e.target.closest('.magnet-zone')
    ) {
        isPanning  = true;
        panStartX  = e.clientX;
        panStartY  = e.clientY;
        scrollLeft = board.scrollLeft;
        scrollTop  = board.scrollTop;
        board.style.cursor = 'grabbing';
        e.preventDefault();
    }
});

document.addEventListener('mousemove', e => {
    if (!isPanning) return;
    board.scrollLeft = scrollLeft - (e.clientX - panStartX);
    board.scrollTop  = scrollTop  - (e.clientY - panStartY);
});

document.addEventListener('mouseup', () => {
    if (!isPanning) return;
    isPanning = false;
    board.style.cursor = 'default';
});

// ゾーンカラー定義
const ZONE_COLORS = [
    { border:'#378ADD', bg:'rgba(56,138,221,0.06)',  text:'#0C447C' },
    { border:'#639922', bg:'rgba(99,153,34,0.06)',   text:'#27500A' },
    { border:'#D4537E', bg:'rgba(212,83,126,0.06)',  text:'#72243E' },
    { border:'#BA7517', bg:'rgba(186,117,23,0.06)',  text:'#633806' },
    { border:'#7F77DD', bg:'rgba(127,119,221,0.06)', text:'#3C3489' },
];

// ゾーン編集モーダル
const zoneModal = document.createElement('div');
zoneModal.id = 'zone-edit-modal';
zoneModal.style.cssText = `
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;
zoneModal.innerHTML = `
    <div style="background:white;border-radius:12px;padding:24px;width:320px;">
        <p style="font-size:15px;font-weight:500;margin-bottom:16px;">グループを編集</p>
        <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:4px;">名称</label>
            <input id="zone-edit-label" type="text" autocomplete="off"
                   style="width:100%;font-size:14px;border:1px solid #d1d5db;border-radius:6px;padding:6px 10px;">
        </div>
        <div style="margin-bottom:20px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:8px;">色</label>
            <div style="display:flex;gap:8px;">
                ${ZONE_COLORS.map((c, i) => `
                    <div class="zone-color-chip" data-color-index="${i}"
                         style="width:28px;height:28px;border-radius:50%;cursor:pointer;
                                background:${c.border};border:2px solid ${c.border};">
                    </div>
                `).join('')}
            </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button id="zone-edit-cancel"
                    style="font-size:13px;padding:6px 16px;border:1px solid #d1d5db;
                           border-radius:6px;cursor:pointer;background:white;">
                キャンセル
            </button>
            <button id="zone-edit-save"
                    style="font-size:13px;padding:6px 16px;border:none;
                           border-radius:6px;cursor:pointer;background:#374151;color:white;">
                保存
            </button>
        </div>
    </div>
`;
document.body.appendChild(zoneModal);

let selectedZoneColor = 0;
let activeZoneEl      = null;

// 色チップ選択
zoneModal.querySelectorAll('.zone-color-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        selectedZoneColor = parseInt(chip.dataset.colorIndex);
        zoneModal.querySelectorAll('.zone-color-chip').forEach(c => {
            c.style.outline = 'none';
            c.style.transform = 'scale(1)';
        });
        chip.style.outline = '2px solid #374151';
        chip.style.outlineOffset = '2px';
        chip.style.transform = 'scale(1.2)';
    });
});

document.getElementById('zone-edit-cancel').addEventListener('click', () => {
    zoneModal.style.display = 'none';
});

// 保存
document.getElementById('zone-edit-save').addEventListener('click', () => {
    const label = document.getElementById('zone-edit-label').value.trim();
    if (!label) return;

    const zoneId = activeZoneEl.dataset.zoneId;
    const c      = ZONE_COLORS[selectedZoneColor];

    // DB保存
    fetch('/org_chart/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'client_zone',
            item_id:       parseInt(zoneId),
            on_board:      true,
            pos_x:         parseFloat(activeZoneEl.style.left) || 0,
            pos_y:         parseFloat(activeZoneEl.style.top)  || 0,
            meta: {
                color_index: selectedZoneColor,
                label:       label,
            },
        }),
    });

    // DOM更新
    activeZoneEl.style.borderColor = c.border;
    activeZoneEl.style.background  = c.bg;
    activeZoneEl.dataset.colorIndex = selectedZoneColor;
    activeZoneEl.dataset.label      = label;
    const labelEl = activeZoneEl.querySelector('.zone-label-text');
    if (labelEl) {
        labelEl.textContent  = label;
        labelEl.style.color  = c.text;
    }

    zoneModal.style.display = 'none';
});

// initZone にホバーと編集ボタンを追加
function initZone(el) {
    el.addEventListener('mousedown',  e => startZoneDrag(e, el));
    el.addEventListener('touchstart', e => startZoneDrag(e, el), { passive: false });

    // ホバーで編集ボタン表示
    el.addEventListener('mouseenter', () => {
        const btn = el.querySelector('.zone-edit-btn');
        if (btn) btn.style.display = 'flex';
    });
    el.addEventListener('mouseleave', () => {
        const btn = el.querySelector('.zone-edit-btn');
        if (btn) btn.style.display = 'none';
    });

    // 編集ボタンクリック
    const editBtn = el.querySelector('.zone-edit-btn');
    if (editBtn) {
        editBtn.addEventListener('mousedown', e => e.stopPropagation());
        editBtn.addEventListener('click', e => {
            e.stopPropagation();
            activeZoneEl      = el;
            selectedZoneColor = parseInt(el.dataset.colorIndex ?? 0);

            document.getElementById('zone-edit-label').value = el.dataset.label ?? '';

            // 色チップのハイライト
            zoneModal.querySelectorAll('.zone-color-chip').forEach(c => {
                const active = parseInt(c.dataset.colorIndex) === selectedZoneColor;
                c.style.outline   = active ? '2px solid #374151' : 'none';
                c.style.outlineOffset = '2px';
                c.style.transform = active ? 'scale(1.2)' : 'scale(1)';
            });

            zoneModal.style.display = 'flex';
        });
    }
}

// 既存のゾーンにinitZoneを適用
document.querySelectorAll('.magnet-zone').forEach(el => initZone(el));