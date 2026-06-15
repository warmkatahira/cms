const board         = document.getElementById('board');
const tray          = document.getElementById('tray');
const WHITEBOARD_ID = parseInt(board.dataset.whiteboardId);
const CANVAS_W      = parseInt(board.dataset.canvasW);
const CANVAS_H      = parseInt(board.dataset.canvasH);
const CSRF          = document.querySelector('meta[name="csrf-token"]').content;

let copyOffset = 0;
let lastCopyEl  = null;

const COLORS = [
    { bg:'#E6F1FB', border:'#378ADD', text:'#0C447C' },
    { bg:'#EAF3DE', border:'#639922', text:'#27500A' },
    { bg:'#FAEEDA', border:'#BA7517', text:'#633806' },
    { bg:'#FBEAF0', border:'#D4537E', text:'#72243E' },
    { bg:'#E1F5EE', border:'#1D9E75', text:'#085041' },
    { bg:'#EEEDFE', border:'#7F77DD', text:'#3C3489' },
    { bg:'#FAECE7', border:'#D85A30', text:'#711B13' },
];

const PALETTE = [
    // 濃い色（既存19色）
    '#374151', '#ffffff', '#dc2626', '#ea580c', '#ca8a04',
    '#16a34a', '#2563eb', '#7c3aed', '#ec4899',
    '#000000', '#6b7280', '#b91c1c', '#92400e', '#854d0e',
    '#065f46', '#1e40af', '#5b21b6', '#9d174d', '#0891b2',
    // 薄い色（追加10色）
    '#fca5a5', '#fdba74', '#fde047', '#86efac', '#93c5fd',
    '#c4b5fd', '#f9a8d4', '#67e8f9', '#9ca3af', '#e5e7eb',
];

function rgbToHex(color) {
    if (!color || color === 'white') return '#ffffff';
    if (color.startsWith('#')) return color;
    const m = color.match(/\d+/g);
    if (!m || m.length < 3) return '#ffffff';
    return '#' + m.slice(0, 3).map(v => parseInt(v).toString(16).padStart(2, '0')).join('');
}

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
    const zoneEl    = draggingZone; // ← null にする前に保存
    const zoneId    = zoneEl.dataset.zoneId;

    let px = cx - boardRect.left + board.scrollLeft - zoneOffX;
    let py = cy - boardRect.top  + board.scrollTop  - zoneOffY;

    const zoneW = zoneEl.offsetWidth;
    const zoneH = zoneEl.offsetHeight;
    px = Math.max(0, Math.min(px, CANVAS_W - zoneW));
    py = Math.max(0, Math.min(py, CANVAS_H - zoneH));

    zoneEl.style.left    = px + 'px';
    zoneEl.style.top     = py + 'px';
    zoneEl.style.opacity = '1';
    draggingZone = null;

    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'zone',
            item_id:       parseInt(zoneId),
            on_board:      true,
            pos_x:         px,
            pos_y:         py,
            meta: {
                color_index: parseInt(zoneEl.dataset.colorIndex ?? 0),
                label:       zoneEl.dataset.label ?? '',
                width:       zoneEl.offsetWidth,
                height:      zoneEl.offsetHeight,
            },
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

        // サイズ・形をリセット
        const chip = dragging.querySelector('.staff-chip-wrap > div');
        if (chip) {
            chip.style.width        = '90px';
            chip.style.height       = '';
            chip.style.borderRadius = '8px';
            chip.style.clipPath     = '';
        }
        dragging.dataset.shape = 'rect';

        tray.appendChild(dragging);
    }

    dragging.style.opacity = '1';
    dragging = null;
}

function saveItem(staffId, onBoard, posX, posY) {
    const el   = document.querySelector(`.magnet[data-id="${staffId}"]`);
    const chip = el ? el.querySelector('.staff-chip-wrap > div') : null;
    const meta = chip ? { width: chip.offsetWidth, height: chip.offsetHeight } : null;

    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_id:       parseInt(staffId),
            on_board:      onBoard,
            pos_x:         posX,
            pos_y:         posY,
            meta:          meta,
        }),
    });
}

// スタッフ追加
window.addStaff = function() {
    const name = document.getElementById('newName').value.trim();
    const role = document.getElementById('newRole').value.trim();
    if (!name) return;

    fetch('/board/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            staff_name: name,
            role_name:  role,
        }),
    })
    .then(r => r.json())
    .then(data => {
        const s = data.staff;
        const c = COLORS[(s.color ?? 0) % COLORS.length];
        const w = '90px';
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
                <div class="chip-copy-btn" style="
                    display:none;position:absolute;top:-7px;right:14px;
                    width:18px;height:18px;border-radius:50%;
                    background:#374151;color:white;font-size:10px;
                    align-items:center;justify-content:center;
                    cursor:pointer;z-index:10;
                ">📋</div>
                <div class="chip-resize-handle" style="
                    display:none;position:absolute;bottom:-4px;right:-4px;
                    width:10px;height:10px;border-radius:2px;
                    background:#374151;cursor:se-resize;z-index:10;
                "></div>
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

    el.addEventListener('mouseenter', () => {
        const btn = el.querySelector('.chip-edit-btn');
        if (btn) btn.style.display = 'flex';
        const copyBtn = el.querySelector('.chip-copy-btn');
        if (copyBtn) copyBtn.style.display = 'flex';
        const handle = el.querySelector('.chip-resize-handle');
        if (handle) handle.style.display = 'block';
    });
    el.addEventListener('mouseleave', () => {
        const btn = el.querySelector('.chip-edit-btn');
        if (btn) btn.style.display = 'none';
        const copyBtn = el.querySelector('.chip-copy-btn');
        if (copyBtn) copyBtn.style.display = 'none';
        const handle = el.querySelector('.chip-resize-handle');
        if (handle) handle.style.display = 'none';
    });

    // 編集ボタン（既存）
    const editBtn = el.querySelector('.chip-edit-btn');
    if (editBtn) {
        editBtn.addEventListener('mousedown', e => e.stopPropagation());
        editBtn.addEventListener('click', e => {
            e.stopPropagation();
            openEditModal(e, el);
        });
    }

    // 複製ボタン
    const copyBtn = el.querySelector('.chip-copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('mousedown', e => e.stopPropagation());
        copyBtn.addEventListener('click', e => {
            e.stopPropagation();
            copyStaff(el);
        });
    }

    // リサイズハンドル（既存）
    const resizeHandle = el.querySelector('.chip-resize-handle');
    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', e => startChipResize(e, el));
        resizeHandle.addEventListener('touchstart', e => startChipResize(e, el), { passive: false });
    }
}

function openEditModal(e, el) {
    e.preventDefault();
    activeStaffId  = el.dataset.id;
    activeMagnetEl = el;

    // トレイにいる場合は見た目タブを非表示
    const isOnTray = tray.contains(el);
    const appearanceTab = modal.querySelector('.modal-tab[data-tab="appearance"]');
    if (appearanceTab) appearanceTab.style.display = isOnTray ? 'none' : 'block';

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
    fetch('/board/staff/' + activeStaffId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({ staff_name: name, role_name: role, color: selectedColor, shape: selectedShape }),
    })
    .then(r => r.json())
    .then(() => {
        const c = COLORS[selectedColor];
        // staff-chip-wrapの中のdivを取得
        const wrap = activeMagnetEl.querySelector('.staff-chip-wrap');
        const chip = wrap.querySelector('div');  // ← 内側のdivを正しく取得
        chip.style.background  = c.bg;
        chip.style.borderColor = c.border;
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
            width:${chip.style.width || chip.offsetWidth + 'px'};
            height:${chip.style.height || chip.offsetHeight + 'px'};
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
    fetch('/board/staff/' + activeStaffId, {
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
    if (
        e.target === board ||
        e.target.id === 'board-canvas' ||
        e.target.closest('#board-canvas') === document.getElementById('board-canvas') &&
        !e.target.closest('.magnet') &&
        !e.target.closest('.magnet-zone') &&
        !e.target.closest('.text-box')
    ) {
        // 編集中のテキストがあれば先に解除
        const editing = document.querySelector('.text-box-inner[contenteditable="true"]');
        if (editing) {
            editing.blur();
            return; // パンは開始しない
        }

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
        <div style="display:flex;justify-content:space-between;align-items:center;">
        <button id="zone-edit-delete"
                style="font-size:13px;padding:6px 16px;border:1px solid #fca5a5;
                    border-radius:6px;cursor:pointer;background:white;color:#dc2626;">
            削除
        </button>
        <div style="display:flex;gap:8px;">
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
    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'zone',
            item_id:       parseInt(zoneId),
            on_board:      true,
            pos_x:         parseFloat(activeZoneEl.style.left) || 0,
            pos_y:         parseFloat(activeZoneEl.style.top)  || 0,
            meta: {
                color_index: selectedZoneColor,
                label:       label,
                width:       parseFloat(activeZoneEl.style.width)  || activeZoneEl.offsetWidth,
                height:      parseFloat(activeZoneEl.style.height) || activeZoneEl.offsetHeight,
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

    // ホバー表示に追加
    el.addEventListener('mouseenter', () => {
        const btn = el.querySelector('.zone-edit-btn');
        if (btn) btn.style.display = 'flex';
        const copyBtn = el.querySelector('.zone-copy-btn');
        if (copyBtn) copyBtn.style.display = 'flex';
        const handle = el.querySelector('.zone-resize-handle');
        if (handle) handle.style.display = 'block';
    });
    el.addEventListener('mouseleave', () => {
        const btn = el.querySelector('.zone-edit-btn');
        if (btn) btn.style.display = 'none';
        const copyBtn = el.querySelector('.zone-copy-btn');
        if (copyBtn) copyBtn.style.display = 'none';
        const handle = el.querySelector('.zone-resize-handle');
        if (handle) handle.style.display = 'none';
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
    // リサイズハンドル
    const resizeHandle = el.querySelector('.zone-resize-handle');
    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', e => startZoneResize(e, el));
        resizeHandle.addEventListener('touchstart', e => startZoneResize(e, el), { passive: false });
    }

    // 複製ボタン
    const copyBtn = el.querySelector('.zone-copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('mousedown', e => e.stopPropagation());
        copyBtn.addEventListener('click', e => {
            e.stopPropagation();
            copyZone(el);
        });
    }
}

// 既存のゾーンにinitZoneを適用
document.querySelectorAll('.magnet-zone').forEach(el => initZone(el));

let resizingZone  = null;
let resizeStartX  = 0;
let resizeStartY  = 0;
let resizeStartW  = 0;
let resizeStartH  = 0;

function startZoneResize(e, el) {
    e.stopPropagation();
    e.preventDefault();
    resizingZone = el;
    resizeStartX = e.touches ? e.touches[0].clientX : e.clientX;
    resizeStartY = e.touches ? e.touches[0].clientY : e.clientY;
    resizeStartW = el.offsetWidth;
    resizeStartH = el.offsetHeight;

    document.addEventListener('mousemove', onZoneResize);
    document.addEventListener('mouseup',   onZoneResizeEnd);
    document.addEventListener('touchmove', onZoneResizeTouch, { passive: false });
    document.addEventListener('touchend',  onZoneResizeEndTouch);
}

function onZoneResize(e)      { doZoneResize(e.clientX, e.clientY); }
function onZoneResizeTouch(e) { e.preventDefault(); doZoneResize(e.touches[0].clientX, e.touches[0].clientY); }

function doZoneResize(cx, cy) {
    if (!resizingZone) return;
    const dx = cx - resizeStartX;
    const dy = cy - resizeStartY;
    const newW = Math.max(100, resizeStartW + dx);
    const newH = Math.max(80,  resizeStartH + dy);
    resizingZone.style.width  = newW + 'px';
    resizingZone.style.height = newH + 'px';
}

function onZoneResizeEnd(e)      { endZoneResize(e.clientX, e.clientY); }
function onZoneResizeEndTouch(e) { endZoneResize(e.changedTouches[0].clientX, e.changedTouches[0].clientY); }

function endZoneResize(cx, cy) {
    document.removeEventListener('mousemove', onZoneResize);
    document.removeEventListener('mouseup',   onZoneResizeEnd);
    document.removeEventListener('touchmove', onZoneResizeTouch);
    document.removeEventListener('touchend',  onZoneResizeEndTouch);

    if (!resizingZone) return;

    const zoneId = resizingZone.dataset.zoneId;
    const w = resizingZone.offsetWidth;
    const h = resizingZone.offsetHeight;
    const px = parseFloat(resizingZone.style.left) || 0;
    const py = parseFloat(resizingZone.style.top)  || 0;
    const meta = {
        color_index: parseInt(resizingZone.dataset.colorIndex ?? 0),
        label:       resizingZone.dataset.label ?? '',
        width:       w,
        height:      h,
    };

    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'zone',
            item_id:       parseInt(zoneId),
            on_board:      true,
            pos_x:         px,
            pos_y:         py,
            meta:          meta,
        }),
    });

    resizingZone = null;
}

let resizingChip  = null;
let chipResStartX = 0;
let chipResStartY = 0;
let chipResStartW = 0;
let chipResStartH = 0;

function startChipResize(e, el) {
    e.stopPropagation();
    e.preventDefault();
    resizingChip  = el;
    chipResStartX = e.touches ? e.touches[0].clientX : e.clientX;
    chipResStartY = e.touches ? e.touches[0].clientY : e.clientY;
    const chip = el.querySelector('.staff-chip-wrap > div');
    chipResStartW = chip ? chip.offsetWidth  : 90;
    chipResStartH = chip ? chip.offsetHeight : 40;

    document.addEventListener('mousemove', onChipResize);
    document.addEventListener('mouseup',   onChipResizeEnd);
    document.addEventListener('touchmove', onChipResizeTouch, { passive: false });
    document.addEventListener('touchend',  onChipResizeEndTouch);
}

function onChipResize(e)      { doChipResize(e.clientX, e.clientY); }
function onChipResizeTouch(e) { e.preventDefault(); doChipResize(e.touches[0].clientX, e.touches[0].clientY); }

function doChipResize(cx, cy) {
    if (!resizingChip) return;
    const dx = cx - chipResStartX;
    const dy = cy - chipResStartY;
    const newW = Math.max(50, chipResStartW + dx);
    const newH = Math.max(50, chipResStartH + dy);
    const chip = resizingChip.querySelector('.staff-chip-wrap > div');
    if (chip) {
        chip.style.width  = newW + 'px';
        chip.style.height = newH + 'px';
    }
}

function onChipResizeEnd(e)      { endChipResize(); }
function onChipResizeEndTouch(e) { endChipResize(); }

function endChipResize() {
    document.removeEventListener('mousemove', onChipResize);
    document.removeEventListener('mouseup',   onChipResizeEnd);
    document.removeEventListener('touchmove', onChipResizeTouch);
    document.removeEventListener('touchend',  onChipResizeEndTouch);

    if (!resizingChip) return;

    const chip   = resizingChip.querySelector('.staff-chip-wrap > div');
    const staffId = resizingChip.dataset.id;
    const w = chip ? chip.offsetWidth  : 90;
    const h = chip ? chip.offsetHeight : 40;

    // DBに保存（sizeの代わりにwidthとheightをmetaとして保存）
    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_id:       parseInt(staffId),
            on_board:      true,
            pos_x:         parseFloat(resizingChip.style.left) || 0,
            pos_y:         parseFloat(resizingChip.style.top)  || 0,
            meta: { width: w, height: h },
        }),
    });

    resizingChip = null;
}

// グループ追加
window.addZone = function() {
    const label = document.getElementById('newZoneLabel').value.trim();
    if (!label) return;

    fetch('/board/zone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            label:         label,
            color_index:   0,
        }),
    })
    .then(r => r.json())
    .then(data => {
        const item = data.item;
        const meta = item.meta;
        const c    = ZONE_COLORS[meta.color_index ?? 0];
        const el   = document.createElement('div');
        el.className = 'zone magnet-zone cursor-grab select-none absolute border-2 rounded-xl';
        el.dataset.zoneId     = item.whiteboard_item_id;
        el.dataset.colorIndex = meta.color_index ?? 0;
        el.dataset.label      = meta.label;
        el.style.cssText = `
            left:40px;top:40px;
            width:180px;height:280px;
            border-color:${c.border};
            background:${c.bg};
        `;
        el.innerHTML = `
            <span class="zone-label-text absolute -top-3 left-2 text-xs font-medium px-1 rounded pointer-events-none select-none"
                  style="color:${c.text};background:#f7f6f0;">
                ${meta.label}
            </span>
            <div class="zone-edit-btn" style="
                display:none;position:absolute;top:-7px;right:-7px;
                width:18px;height:18px;border-radius:50%;
                background:#374151;color:white;font-size:10px;
                align-items:center;justify-content:center;
                cursor:pointer;z-index:10;
            ">✏</div>
            <div class="zone-copy-btn" style="
                display:none;position:absolute;top:-7px;right:14px;
                width:18px;height:18px;border-radius:50%;
                background:#374151;color:white;font-size:10px;
                align-items:center;justify-content:center;
                cursor:pointer;z-index:10;
            ">📋</div>
            <div class="zone-resize-handle" style="
                display:none;position:absolute;bottom:-4px;right:-4px;
                width:14px;height:14px;border-radius:2px;
                color:#374151;font-size:18px;line-height:14px;text-align:center;
                cursor:se-resize;z-index:10;user-select:none;
            ">⤡</div>
        `;
        document.getElementById('board-canvas').appendChild(el);
        initZone(el);
        document.getElementById('newZoneLabel').value = '';
    });
};

// グループ削除
document.getElementById('zone-edit-delete').addEventListener('click', () => {
    if (!confirm('このグループを削除しますか？')) return;

    const zoneId = activeZoneEl.dataset.zoneId;

    fetch('/board/zone/' + zoneId, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': CSRF },
    })
    .then(r => r.json())
    .then(() => {
        activeZoneEl.remove();
        zoneModal.style.display = 'none';
    });
});

window.Echo.channel('whiteboard.' + WHITEBOARD_ID)
    .listen('.board.updated', (e) => {
        switch (e.action) {
            case 'item.updated':  handleItemUpdated(e.payload);  break;
            case 'staff.added':   handleStaffAdded(e.payload);   break;
            case 'staff.deleted': handleStaffDeleted(e.payload); break;
            case 'staff.updated': handleStaffUpdated(e.payload); break;
            case 'zone.added':    handleZoneAdded(e.payload);    break;
            case 'zone.deleted':  handleZoneDeleted(e.payload);  break;
            case 'text.added':   handleTextAdded(e.payload);   break;
            case 'text.deleted': handleTextDeleted(e.payload); break;
        }
    });

function handleItemUpdated(p) {
    if (p.itemType === 'staff') {
        const el = document.querySelector(`.magnet[data-id="${p.itemId}"]`);
        if (!el) return;
        if (p.onBoard) {
            el.style.position = 'absolute';
            el.style.left     = p.posX + 'px';
            el.style.top      = p.posY + 'px';
            if (p.meta?.width)  el.querySelector('.staff-chip-wrap > div').style.width  = p.meta.width  + 'px';
            if (p.meta?.height) el.querySelector('.staff-chip-wrap > div').style.height = p.meta.height + 'px';
            document.getElementById('board-canvas').appendChild(el);
        } else {
            el.style.position = '';
            el.style.left     = '';
            el.style.top      = '';
            tray.appendChild(el);
        }
    } else if (p.itemType === 'zone') {
        const el = document.querySelector(`.magnet-zone[data-zone-id="${p.itemId}"]`);
        if (!el) return;
        el.style.left = p.posX + 'px';
        el.style.top  = p.posY + 'px';
        if (p.meta?.width)  el.style.width  = p.meta.width  + 'px';
        if (p.meta?.height) el.style.height = p.meta.height + 'px';
        if (p.meta?.colorIndex !== undefined) {
            const c = ZONE_COLORS[p.meta.colorIndex];
            el.style.borderColor = c.border;
            el.style.background  = c.bg;
        }
        if (p.meta?.label) {
            const labelEl = el.querySelector('.zone-label-text');
            if (labelEl) labelEl.textContent = p.meta.label;
        }
    }
}

function handleStaffAdded(p) {
    // 少し待ってDOMとSetを再チェック
    setTimeout(() => {
        if (document.querySelector(`.magnet[data-id="${p.staff_id}"]`)) return;
        const c  = COLORS[(p.color ?? 0) % COLORS.length];
        const el = document.createElement('div');
        el.className     = 'magnet cursor-grab select-none';
        el.dataset.id    = p.staff_id;
        el.dataset.color = p.color ?? 0;
        el.dataset.name  = p.staff_name;
        el.dataset.role  = p.role_name ?? '';
        el.dataset.shape = p.shape ?? 'rect';
        el.innerHTML = `
            <div class="staff-chip-wrap" style="position:relative;display:inline-block;">
                <div style="width:90px;padding:6px;border-radius:8px;text-align:center;
                            border:2px solid ${c.border};background:${c.bg};">
                    <div data-field="name" style="font-size:12px;font-weight:500;color:${c.text};">${p.staff_name}</div>
                    <div data-field="role" style="font-size:10px;color:${c.text};opacity:.7;">${p.role_name ?? ''}</div>
                </div>
                <div class="chip-edit-btn" style="display:none;position:absolute;top:-7px;right:-7px;
                    width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
                    align-items:center;justify-content:center;cursor:pointer;z-index:10;">✏</div>
                <div class="chip-copy-btn" style="
                    display:none;position:absolute;top:-7px;right:14px;
                    width:18px;height:18px;border-radius:50%;
                    background:#374151;color:white;font-size:10px;
                    align-items:center;justify-content:center;
                    cursor:pointer;z-index:10;
                ">📋</div>
                <div class="chip-resize-handle" style="display:none;position:absolute;bottom:-4px;right:-4px;
                    width:10px;height:10px;border-radius:2px;background:#374151;cursor:se-resize;z-index:10;"></div>
            </div>`;
        initMagnet(el);
        tray.appendChild(el);
    }, 100); // 100ms待つ
}

function handleStaffDeleted(p) {
    const el = document.querySelector(`.magnet[data-id="${p.staffId}"]`);
    if (el) el.remove();
}

function handleStaffUpdated(p) {
    const el = document.querySelector(`.magnet[data-id="${p.staff_id}"]`);
    if (!el) return;
    const c    = COLORS[(p.color ?? 0) % COLORS.length];
    const wrap = el.querySelector('.staff-chip-wrap');
    const chip = wrap?.querySelector('div');
    if (!chip) return;

    // 現在のサイズを保持（styleが空の場合はoffsetを使う）
    const currentW = chip.style.width  || chip.offsetWidth  + 'px';
    const currentH = chip.style.height || chip.offsetHeight + 'px';

    const SHAPES = {
        rect:           'border-radius:8px;',
        circle:         'border-radius:50%;',
        sharp:          'border-radius:0;',
        rounded_bottom: 'border-radius:0 0 50% 50%;',
        tab:            'border-radius:0 0 8px 8px;',
    };
    chip.style.cssText = `
        background:${c.bg};border:2px solid ${c.border};
        width:${currentW};height:${currentH};
        padding:6px;text-align:center;
        ${SHAPES[p.shape] ?? SHAPES['rect']}
    `;
    el.dataset.name  = p.staff_name;
    el.dataset.role  = p.role_name ?? '';
    el.dataset.color = p.color ?? 0;
    el.dataset.shape = p.shape ?? 'rect';
    const nameEl = wrap.querySelector('[data-field="name"]');
    const roleEl = wrap.querySelector('[data-field="role"]');
    if (nameEl) { nameEl.textContent = p.staff_name; nameEl.style.color = c.text; }
    if (roleEl) { roleEl.textContent = p.role_name ?? ''; roleEl.style.color = c.text; }
}

function handleZoneAdded(p) {
    if (document.querySelector(`.magnet-zone[data-zone-id="${p.whiteboard_item_id}"]`)) return;
    const meta = p.meta ?? {};
    const c    = ZONE_COLORS[meta.color_index ?? 0];
    const el   = document.createElement('div');
    el.className = 'zone magnet-zone cursor-grab select-none absolute border-2 rounded-xl';
    el.dataset.zoneId     = p.whiteboard_item_id;
    el.dataset.colorIndex = meta.color_index ?? 0;
    el.dataset.label      = meta.label ?? '';
    el.style.cssText = `
        left:${p.pos_x}px;top:${p.pos_y}px;
        width:${meta.width ?? 180}px;height:${meta.height ?? 280}px;
        border-color:${c.border};background:${c.bg};
    `;
    el.innerHTML = `
        <span class="zone-label-text absolute -top-3 left-2 text-xs font-medium px-1 rounded pointer-events-none select-none"
              style="color:${c.text};background:#f7f6f0;">${meta.label ?? ''}</span>
        <div class="zone-edit-btn" style="display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            align-items:center;justify-content:center;cursor:pointer;z-index:10;">✏</div>
            <div class="zone-copy-btn" style="
                display:none;position:absolute;top:-7px;right:14px;
                width:18px;height:18px;border-radius:50%;
                background:#374151;color:white;font-size:10px;
                align-items:center;justify-content:center;
                cursor:pointer;z-index:10;
            ">📋</div>
        <div class="zone-resize-handle" style="display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;color:#374151;font-size:18px;line-height:14px;
            text-align:center;cursor:se-resize;z-index:10;user-select:none;">⤡</div>
    `;
    document.getElementById('board-canvas').appendChild(el);
    initZone(el);
}

function handleZoneDeleted(p) {
    const el = document.querySelector(`.magnet-zone[data-zone-id="${p.zoneId}"]`);
    if (el) el.remove();
}

// テキスト追加
window.addText = function() {
    fetch('/board/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            text:          'テキスト',
        }),
    })
    .then(r => r.json())
    .then(data => {
        const item = data.item;
        const el   = createTextEl(item);
        document.getElementById('board-canvas').appendChild(el);
        initText(el);
    });
};

function createTextEl(item) {
    const meta = item.meta ?? {};
    const el   = document.createElement('div');
    el.className = 'text-box absolute cursor-grab select-none';
    el.dataset.textId = item.whiteboard_item_id;
    el.style.cssText = `
        left:${item.pos_x}px;top:${item.pos_y}px;
        width:${meta.width ?? 200}px;height:${meta.height ?? 100}px;
        position:absolute;
    `;
    el.innerHTML = `
        <div class="text-box-inner" style="
            width:100%;min-height:100%;padding:8px;
            font-size:${meta.font_size ?? 14}px;
            color:${meta.color ?? '#374151'};
            font-weight:${meta.font_weight ?? '400'};
            border:1.5px dashed #d1d5db;border-radius:6px;
            background:${meta.bg_color ?? 'white'};word-break:break-all;
            box-sizing:border-box;
        ">${meta.text ?? ''}</div>
        <div class="text-edit-btn" style="
            display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;
            background:#374151;color:white;font-size:10px;
            align-items:center;justify-content:center;
            cursor:pointer;z-index:10;
        ">✏</div>
        <div class="text-copy-btn" style="
            display:none;position:absolute;top:-7px;right:14px;
            width:18px;height:18px;border-radius:50%;
            background:#374151;color:white;font-size:10px;line-height:18px;
            text-align:center;cursor:pointer;z-index:10;
        ">📋</div>
        <div class="text-delete-btn" style="
            display:none;position:absolute;top:-7px;left:-7px;
            width:18px;height:18px;border-radius:50%;
            background:#ef4444;color:white;font-size:12px;line-height:18px;
            text-align:center;cursor:pointer;z-index:10;
        ">×</div>
        <div class="text-resize-handle" style="
            display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;
            color:#374151;font-size:18px;line-height:14px;text-align:center;
            cursor:se-resize;z-index:10;user-select:none;
        ">⤡</div>
    `;
    return el;
}

function initText(el) {
    el.addEventListener('mousedown',  e => startTextDrag(e, el));
    el.addEventListener('touchstart', e => startTextDrag(e, el), { passive: false });

    el.addEventListener('mouseenter', () => {
        el.querySelector('.text-edit-btn').style.display   = 'flex';
        el.querySelector('.text-delete-btn').style.display = 'block';
        el.querySelector('.text-copy-btn').style.display   = 'block';
        el.querySelector('.text-resize-handle').style.display = 'block';
    });
    el.addEventListener('mouseleave', () => {
        el.querySelector('.text-edit-btn').style.display   = 'none';
        el.querySelector('.text-delete-btn').style.display = 'none';
        el.querySelector('.text-copy-btn').style.display   = 'none';
        el.querySelector('.text-resize-handle').style.display = 'none';
    });

    // ダブルクリック（既存）
    el.querySelector('.text-box-inner').addEventListener('dblclick', e => {
        e.stopPropagation();
        startTextEdit(el);
    });

    // 編集ボタン（既存）
    const editBtn = el.querySelector('.text-edit-btn');
    editBtn.addEventListener('mousedown', e => e.stopPropagation());
    editBtn.addEventListener('click', e => {
        e.stopPropagation();
        startTextEdit(el);
    });

    // 削除ボタン（既存）
    const deleteBtn = el.querySelector('.text-delete-btn');
    deleteBtn.addEventListener('mousedown', e => e.stopPropagation());
    deleteBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (!confirm('このテキストを削除しますか？')) return;
        fetch('/board/text/' + el.dataset.textId, {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': CSRF },
        })
        .then(r => r.json())
        .then(() => el.remove());
    });

    // 複製ボタン
    const copyBtn = el.querySelector('.text-copy-btn');
    copyBtn.addEventListener('mousedown', e => e.stopPropagation());
    copyBtn.addEventListener('click', e => {
        e.stopPropagation();
        copyText(el);
    });

    // リサイズ（既存）
    const resizeHandle = el.querySelector('.text-resize-handle');
    resizeHandle.addEventListener('mousedown', e => startTextResize(e, el));
    resizeHandle.addEventListener('touchstart', e => startTextResize(e, el), { passive: false });
}

function startTextEdit(el) {
    const inner   = el.querySelector('.text-box-inner');
    const current = inner.textContent;
    const currentBg = inner.style.background || 'white';

    inner.contentEditable = 'true';
    inner.style.cursor    = 'text';
    inner.style.borderColor = '#374151';
    inner.focus();

    // カーソルを末尾に移動
    const range = document.createRange();
    range.selectNodeContents(inner);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    // ミニツールバーを表示
    const toolbar = document.createElement('div');
    toolbar.className = 'text-toolbar';
    toolbar.style.cssText = `
        position:absolute;bottom:-36px;left:0;
        display:flex;align-items:center;gap:4px;
        background:white;border:1px solid #d1d5db;border-radius:6px;
        padding:4px 6px;z-index:20;box-shadow:0 2px 6px rgba(0,0,0,0.1);
    `;

    const currentSize  = parseInt(inner.style.fontSize) || 14;
    const currentColor = inner.style.color || '#374151';
    const currentBold  = inner.style.fontWeight === '700' || inner.style.fontWeight === 'bold';

    toolbar.innerHTML = `
        <select class="tb-size" style="font-size:11px;border:1px solid #e5e7eb;border-radius:4px;padding:2px 4px;">
            ${[10,12,14,16,18,20,24,28,32,40].map(s =>
                `<option value="${s}" ${s === currentSize ? 'selected' : ''}>${s}px</option>`
            ).join('')}
        </select>
        <div class="tb-color-wrap" style="position:relative;">
            <button class="tb-color-btn" title="文字色" style="
                width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
                cursor:pointer;font-size:14px;font-weight:700;line-height:24px;
                text-align:center;background:white;color:${currentColor};
            ">A</button>
            <div class="tb-color-palette" style="
                display:none;position:absolute;top:-112px;left:0;
                background:white;border:1px solid #d1d5db;border-radius:6px;
                padding:4px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:30;
            ">
                <div style="display:flex;flex-wrap:wrap;gap:3px;width:${10 * 23}px;">
                    ${PALETTE.map(c => `
                        <div class="tb-color-chip" data-color="${c}" style="
                            width:20px;height:20px;border-radius:4px;cursor:pointer;
                            background:${c};border:1.5px solid ${c === '#ffffff' ? '#d1d5db' : c};
                        "></div>
                    `).join('')}
                </div>
            </div>
        </div>
        <div class="tb-bg-wrap" style="position:relative;">
            <button class="tb-bg-btn" title="背景色" style="
                width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
                cursor:pointer;font-size:10px;line-height:24px;
                text-align:center;color:#374151;
                background:${currentBg === 'white' ? '#ffffff' : currentBg};
            ">塗</button>
            <div class="tb-bg-palette" style="
                display:none;position:absolute;top:-112px;left:0;
                background:white;border:1px solid #d1d5db;border-radius:6px;
                padding:4px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:30;
            ">
                <div style="display:flex;flex-wrap:wrap;gap:3px;width:${10 * 23}px;">
                    ${PALETTE.map(c => `
                        <div class="tb-bg-chip" data-color="${c}" style="
                            width:20px;height:20px;border-radius:4px;cursor:pointer;
                            background:${c};border:1.5px solid ${c === '#ffffff' ? '#d1d5db' : c};
                        "></div>
                    `).join('')}
                </div>
            </div>
        </div>
        <button class="tb-bold" style="
            font-size:12px;font-weight:700;width:24px;height:24px;
            border:1px solid ${currentBold ? '#374151' : '#e5e7eb'};
            border-radius:4px;cursor:pointer;
            background:${currentBold ? '#f3f4f6' : 'white'};
            color:#374151;
        ">B</button>
    `;
    el.appendChild(toolbar);

    // イベント伝播を止める
    toolbar.addEventListener('mousedown', e => {
        e.stopPropagation();
        e.preventDefault();
    });

    // フォントサイズ変更
    toolbar.querySelector('.tb-size').addEventListener('change', e => {
        inner.style.fontSize = e.target.value + 'px';
    });

    // 太字切り替え
    toolbar.querySelector('.tb-bold').addEventListener('click', e => {
        const isBold = inner.style.fontWeight === '700';
        inner.style.fontWeight = isBold ? '400' : '700';
        e.target.style.borderColor = isBold ? '#e5e7eb' : '#374151';
        e.target.style.background  = isBold ? 'white'   : '#f3f4f6';
    });

    // 文字色パレット開閉
    const colorBtn     = toolbar.querySelector('.tb-color-btn');
    const colorPalette = toolbar.querySelector('.tb-color-palette');
    colorBtn.addEventListener('click', () => {
        colorPalette.style.display = colorPalette.style.display === 'none' ? 'block' : 'none';
        toolbar.querySelector('.tb-bg-palette').style.display = 'none';
    });
    toolbar.querySelectorAll('.tb-color-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const c = chip.dataset.color;
            inner.style.color = c;
            colorBtn.style.color = c;
            colorPalette.style.display = 'none';
            inner.focus();
        });
    });

    // 背景色パレット開閉
    const bgBtn     = toolbar.querySelector('.tb-bg-btn');
    const bgPalette = toolbar.querySelector('.tb-bg-palette');
    bgBtn.addEventListener('click', () => {
        bgPalette.style.display = bgPalette.style.display === 'none' ? 'block' : 'none';
        colorPalette.style.display = 'none';
    });
    toolbar.querySelectorAll('.tb-bg-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const c = chip.dataset.color;
            inner.style.background = c;
            bgBtn.style.background = c;
            bgPalette.style.display = 'none';
            inner.focus();
        });
    });

    function saveText() {
        inner.removeEventListener('blur', onBlur);
        inner.contentEditable = 'false';
        inner.style.cursor = 'inherit';
        inner.style.borderColor = '#d1d5db';
        toolbar.remove();

        const newText = inner.textContent.trim();

        fetch('/board/item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
            body: JSON.stringify({
                whiteboard_id: WHITEBOARD_ID,
                item_type:     'text',
                item_id:       parseInt(el.dataset.textId),
                on_board:      true,
                pos_x:         parseFloat(el.style.left) || 0,
                pos_y:         parseFloat(el.style.top)  || 0,
                meta: {
                    text:        newText,
                    font_size:   parseInt(inner.style.fontSize) || 14,
                    color:       inner.style.color || '#374151',
                    font_weight: inner.style.fontWeight || '400',
                    bg_color:    inner.style.background || 'white',
                    width:       el.offsetWidth,
                    height:      el.offsetHeight,
                },
            }),
        });
    }
    
    function onBlur(e) {
        // ツールバー内のクリックでは保存しない
        if (toolbar.contains(e.relatedTarget)) {
            inner.focus();
            return;
        }
        // 少し待ってツールバー操作中でないか確認
        setTimeout(() => {
            if (inner.contentEditable !== 'true') return; // すでに解除済み
            saveText();
        }, 50);
    }
    inner.addEventListener('blur', onBlur);
    

    inner.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            inner.removeEventListener('blur', onBlur);
            inner.textContent = current;
            inner.contentEditable = 'false';
            inner.style.cursor = 'inherit';
            inner.style.borderColor = '#d1d5db';
            toolbar.remove();
        }
    });
}

// テキストドラッグ
let draggingText = null;
let textGhost    = null;
let textOffX = 0, textOffY = 0;
let pendingText  = null;
let pendingTextCx = 0, pendingTextCy = 0;

function startTextDrag(e, el) {
    if (e.target.classList.contains('text-edit-btn'))   return;
    if (e.target.classList.contains('text-delete-btn')) return;
    if (e.target.classList.contains('text-copy-btn'))   return;
    if (e.target.classList.contains('text-resize-handle')) return;
    if (e.target.contentEditable === 'true') return;

    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    pendingText   = el;
    pendingTextCx = cx;
    pendingTextCy = cy;
    document.addEventListener('mousemove', onTextMoveCheck);
    document.addEventListener('mouseup',   onTextCancelPending);
}

function onTextMoveCheck(e) {
    const dx = e.clientX - pendingTextCx;
    const dy = e.clientY - pendingTextCy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        document.removeEventListener('mousemove', onTextMoveCheck);
        document.removeEventListener('mouseup',   onTextCancelPending);
        beginTextDrag(pendingText, pendingTextCx, pendingTextCy);
        pendingText = null;
    }
}

function onTextCancelPending() {
    document.removeEventListener('mousemove', onTextMoveCheck);
    document.removeEventListener('mouseup',   onTextCancelPending);
    pendingText = null;
}

function beginTextDrag(el, startCx, startCy) {
    draggingText = el;
    const rect = el.getBoundingClientRect();
    textOffX = startCx - rect.left;
    textOffY = startCy - rect.top;

    textGhost = el.cloneNode(true);
    textGhost.style.cssText += `position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;`;
    document.body.appendChild(textGhost);
    el.style.opacity = '0.3';

    document.addEventListener('mousemove', onTextMove);
    document.addEventListener('mouseup',   onTextUp);
}

function onTextMove(e) {
    textGhost.style.left = (e.clientX - textOffX) + 'px';
    textGhost.style.top  = (e.clientY - textOffY) + 'px';
}

function onTextUp(e) {
    document.removeEventListener('mousemove', onTextMove);
    document.removeEventListener('mouseup',   onTextUp);
    textGhost.remove();
    textGhost = null;

    const boardRect  = board.getBoundingClientRect();
    const textEl     = draggingText; // ← null にする前に保存
    let px = e.clientX - boardRect.left + board.scrollLeft - textOffX;
    let py = e.clientY - boardRect.top  + board.scrollTop  - textOffY;
    px = Math.max(0, Math.min(px, CANVAS_W - textEl.offsetWidth));
    py = Math.max(0, Math.min(py, CANVAS_H - textEl.offsetHeight));

    textEl.style.left    = px + 'px';
    textEl.style.top     = py + 'px';
    textEl.style.opacity = '1';
    draggingText = null;

    const inner = textEl.querySelector('.text-box-inner');
    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'text',
            item_id:       parseInt(textEl.dataset.textId),
            on_board:      true,
            pos_x:         px,
            pos_y:         py,
            meta: {
                text:        inner.textContent,
                font_size:   parseInt(inner.style.fontSize) || 14,
                color:       inner.style.color || '#374151',
                font_weight: inner.style.fontWeight || '400',
                bg_color:    inner.style.background || 'white',
                width:       textEl.offsetWidth,   // onTextUpの場合
                height:      textEl.offsetHeight,
            },
        }),
    });
}

// テキストリサイズ
let resizingText  = null;
let textResStartX = 0, textResStartY = 0;
let textResStartW = 0, textResStartH = 0;

function startTextResize(e, el) {
    e.stopPropagation();
    e.preventDefault();
    resizingText  = el;
    textResStartX = e.touches ? e.touches[0].clientX : e.clientX;
    textResStartY = e.touches ? e.touches[0].clientY : e.clientY;
    textResStartW = el.offsetWidth;
    textResStartH = el.offsetHeight;

    document.addEventListener('mousemove', onTextResize);
    document.addEventListener('mouseup',   onTextResizeEnd);
}

function onTextResize(e) {
    if (!resizingText) return;
    const newW = Math.max(100, textResStartW + (e.clientX - textResStartX));
    const newH = Math.max(50,  textResStartH + (e.clientY - textResStartY));
    resizingText.style.width  = newW + 'px';
    resizingText.style.height = newH + 'px';
    const inner = resizingText.querySelector('.text-box-inner');
    if (inner) inner.style.minHeight = newH + 'px';
}

function onTextResizeEnd(e) {
    document.removeEventListener('mousemove', onTextResize);
    document.removeEventListener('mouseup',   onTextResizeEnd);
    if (!resizingText) return;

    const inner = resizingText.querySelector('.text-box-inner');
    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'text',
            item_id:       parseInt(resizingText.dataset.textId),
            on_board:      true,
            pos_x:         parseFloat(resizingText.style.left) || 0,
            pos_y:         parseFloat(resizingText.style.top)  || 0,
            meta: {
                text:        inner.textContent,
                font_size:   parseInt(inner.style.fontSize) || 14,
                color:       inner.style.color || '#374151',
                font_weight: inner.style.fontWeight || '400',
                bg_color:    inner.style.background || 'white',
                width:       resizingText.offsetWidth,
                height:      resizingText.offsetHeight,
            },
        }),
    });
    resizingText = null;
}

// リアルタイム受信
function handleTextAdded(p) {
    setTimeout(() => {
        if (document.querySelector(`.text-box[data-text-id="${p.whiteboard_item_id}"]`)) return;
        const el = createTextEl(p);
        document.getElementById('board-canvas').appendChild(el);
        initText(el);
    }, 100);
}

function handleTextDeleted(p) {
    const el = document.querySelector(`.text-box[data-text-id="${p.itemId}"]`);
    if (el) el.remove();
}

document.querySelectorAll('.text-box').forEach(el => initText(el));

// ボード空白クリックでテキスト編集を解除
document.getElementById('board-canvas').addEventListener('mousedown', e => {
    // テキストボックス内のクリックは無視
    if (e.target.closest('.text-box')) return;

    // 編集中のテキストボックスがあればblurさせる
    const editing = document.querySelector('.text-box-inner[contenteditable="true"]');
    if (editing) {
        editing.blur();
    }
});

function copyStaff(el) {
    fetch('/board/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            staff_name:    el.dataset.name,
            role_name:     el.dataset.role,
            color: parseInt(el.dataset.color) || 0,
        }),
    })
    .then(r => r.json())
    .then(data => {
        const s = data.staff;
        const c = COLORS[(s.color ?? 0) % COLORS.length];

        // 元がボード上ならずらして配置、トレイならトレイに追加
        const isOnBoard = document.getElementById('board-canvas').contains(el);

        const newEl = document.createElement('div');
        newEl.className  = 'magnet cursor-grab select-none';
        newEl.dataset.id    = s.staff_id;
        newEl.dataset.color = s.color;
        newEl.dataset.name  = s.staff_name;
        newEl.dataset.role  = s.role_name ?? '';
        newEl.dataset.size  = el.dataset.size ?? 'M';
        newEl.dataset.shape = el.dataset.shape ?? 'rect';
        newEl.innerHTML = el.innerHTML;

        newEl.querySelectorAll('.chip-edit-btn, .chip-copy-btn').forEach(b => b.style.display = 'none');
        newEl.querySelectorAll('.chip-resize-handle').forEach(b => b.style.display = 'none');

        // 新しいIDでDOM更新
        initMagnet(newEl);

        if (isOnBoard) {
            if (lastCopyEl !== el) { copyOffset = 0; lastCopyEl = el; }
            copyOffset += 20;
            const px = (parseFloat(el.style.left) || 0) + copyOffset;
            const py = (parseFloat(el.style.top)  || 0) + copyOffset;
            newEl.style.position = 'absolute';
            newEl.style.left = px + 'px';
            newEl.style.top  = py + 'px';
            document.getElementById('board-canvas').appendChild(newEl);
            saveItem(s.staff_id, true, px, py);
        } else {
            tray.appendChild(newEl);
        }
    });
}

function copyText(el) {
    const inner = el.querySelector('.text-box-inner');

    fetch('/board/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            text:          inner.textContent.trim(),
        }),
    })
    .then(r => r.json())
    .then(data => {
        const item = data.item;
        // 元のスタイルを引き継ぐ
        item.meta = {
            ...item.meta,
            font_size:   parseInt(inner.style.fontSize) || 14,
            color:       inner.style.color || '#374151',
            font_weight: inner.style.fontWeight || '400',
            bg_color:    inner.style.background || 'white',
            width:       el.offsetWidth,
            height:      el.offsetHeight,
        };
        if (lastCopyEl !== el) { copyOffset = 0; lastCopyEl = el; }
        copyOffset += 20;
        item.pos_x = (parseFloat(el.style.left) || 0) + copyOffset;
        item.pos_y = (parseFloat(el.style.top)  || 0) + copyOffset;

        const newEl = createTextEl(item);
        document.getElementById('board-canvas').appendChild(newEl);

        newEl.querySelectorAll('.text-edit-btn, .text-copy-btn, .text-delete-btn').forEach(b => b.style.display = 'none');
        newEl.querySelectorAll('.text-resize-handle').forEach(b => b.style.display = 'none');

        initText(newEl);

        // スタイルも含めてDB保存
        fetch('/board/item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
            body: JSON.stringify({
                whiteboard_id: WHITEBOARD_ID,
                item_type:     'text',
                item_id:       parseInt(item.whiteboard_item_id),
                on_board:      true,
                pos_x:         item.pos_x,
                pos_y:         item.pos_y,
                meta:          item.meta,
            }),
        });
    });
}

function copyZone(el) {
    fetch('/board/zone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            label:         el.dataset.label,
            color_index:   parseInt(el.dataset.colorIndex ?? 0),
        }),
    })
    .then(r => r.json())
    .then(data => {
        const item = data.item;
        if (lastCopyEl !== el) { copyOffset = 0; lastCopyEl = el; }
        copyOffset += 20;
        const px = (parseFloat(el.style.left) || 0) + copyOffset;
        const py = (parseFloat(el.style.top)  || 0) + copyOffset;

        // 元のサイズを引き継ぐ
        item.pos_x = px;
        item.pos_y = py;
        item.meta.width  = el.offsetWidth;
        item.meta.height = el.offsetHeight;

        const newEl = document.createElement('div');
        const c = ZONE_COLORS[item.meta.color_index ?? 0];
        newEl.className = 'zone magnet-zone cursor-grab select-none absolute border-2 rounded-xl';
        newEl.dataset.zoneId     = item.whiteboard_item_id;
        newEl.dataset.colorIndex = item.meta.color_index ?? 0;
        newEl.dataset.label      = item.meta.label;
        newEl.style.cssText = `
            left:${px}px;top:${py}px;
            width:${el.offsetWidth}px;height:${el.offsetHeight}px;
            border-color:${c.border};background:${c.bg};
        `;
        newEl.innerHTML = el.innerHTML;
        document.getElementById('board-canvas').appendChild(newEl);

        newEl.querySelectorAll('.zone-edit-btn, .zone-copy-btn').forEach(b => b.style.display = 'none');
        newEl.querySelectorAll('.zone-resize-handle').forEach(b => b.style.display = 'none');

        initZone(newEl);

        // 位置・サイズをDB保存
        fetch('/board/item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
            body: JSON.stringify({
                whiteboard_id: WHITEBOARD_ID,
                item_type:     'zone',
                item_id:       parseInt(item.whiteboard_item_id),
                on_board:      true,
                pos_x:         px,
                pos_y:         py,
                meta:          item.meta,
            }),
        });
    });
}