import {
    board, WHITEBOARD_ID, CSRF, CANVAS_W, CANVAS_H,
    COLORS, copyOffset, lastCopyEl, setCopyOffset, setLastCopyEl,
} from './constants.js';
import { initTippy } from './constants.js';

// ドラッグ
let dragging    = null;
let ghost       = null;
let offX = 0, offY = 0;
let pendingDrag   = null;
let pendingStartX = 0;
let pendingStartY = 0;

export function initMagnet(el) {
    el.addEventListener('mousedown',  e => startDrag(e, el));
    el.addEventListener('touchstart', e => startDrag(e, el), { passive: false });

    el.addEventListener('mouseenter', () => {
        const btn = el.querySelector('.chip-edit-btn');
        if (btn) btn.style.display = 'flex';
        const copyBtn = el.querySelector('.chip-copy-btn');
        if (copyBtn) copyBtn.style.display = 'flex';
        const deleteBtn = el.querySelector('.chip-delete-btn');
        if (deleteBtn) deleteBtn.style.display = 'block';
        const handle = el.querySelector('.chip-resize-handle');
        if (handle) handle.style.display = 'block';
    });
    el.addEventListener('mouseleave', () => {
        const btn = el.querySelector('.chip-edit-btn');
        if (btn) btn.style.display = 'none';
        const copyBtn = el.querySelector('.chip-copy-btn');
        if (copyBtn) copyBtn.style.display = 'none';
        const deleteBtn = el.querySelector('.chip-delete-btn');
        if (deleteBtn) deleteBtn.style.display = 'none';
        const handle = el.querySelector('.chip-resize-handle');
        if (handle) handle.style.display = 'none';
    });

    const editBtn = el.querySelector('.chip-edit-btn');
    if (editBtn) {
        editBtn.addEventListener('mousedown', e => e.stopPropagation());
        editBtn.addEventListener('click', e => {
            e.stopPropagation();
            openEditModal(e, el);
        });
    }

    const copyBtn = el.querySelector('.chip-copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('mousedown', e => e.stopPropagation());
        copyBtn.addEventListener('click', e => {
            e.stopPropagation();
            copyStaff(el);
        });
    }

    const deleteBtn = el.querySelector('.chip-delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('mousedown', e => e.stopPropagation());
        deleteBtn.addEventListener('click', e => {
            e.stopPropagation();
            if (!confirm('このスタッフを削除しますか？')) return;
            fetch('/board/staff/' + el.dataset.id, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': CSRF },
            })
            .then(r => r.json())
            .then(() => el.remove());
        });
    }

    const resizeHandle = el.querySelector('.chip-resize-handle');
    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', e => startChipResize(e, el));
        resizeHandle.addEventListener('touchstart', e => startChipResize(e, el), { passive: false });
    }
    initTippy(el);
}

function startDrag(e, el) {
    if (dragging) { dragging.style.opacity = '1'; dragging = null; }
    if (ghost)    { ghost.remove(); ghost = null; }
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

    const boardRect = board.getBoundingClientRect();
    const staffId   = dragging.dataset.id;
    
    let px = cx - boardRect.left + board.scrollLeft - offX;
    let py = cy - boardRect.top  + board.scrollTop  - offY;
    px = Math.max(0, Math.min(px, CANVAS_W - 80));
    py = Math.max(0, Math.min(py, CANVAS_H - 50));
    saveItem(staffId, px, py);
    dragging.style.position = 'absolute';
    dragging.style.left = px + 'px';
    dragging.style.top  = py + 'px';
    document.getElementById('board-canvas').appendChild(dragging);

    dragging.style.opacity = '1';
    dragging = null;
}

function saveItem(staffId, posX, posY) {
    const el   = document.querySelector(`.magnet[data-id="${staffId}"]`);
    const chip = el ? el.querySelector('.staff-chip-wrap > div') : null;
    const meta = chip ? { width: chip.offsetWidth, height: chip.offsetHeight } : null;

    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'staff',
            item_id:       parseInt(staffId),
            pos_x:         posX,
            pos_y:         posY,
            meta: {
                staff_name: el?.dataset.name ?? '',
                role_name:  el?.dataset.role ?? '',
                color:      parseInt(el?.dataset.color ?? 0),
                shape:      el?.dataset.shape ?? 'rect',
                width:      chip ? chip.offsetWidth  : 90,
                height:     chip ? chip.offsetHeight : 40,
            },
        }),
    });
}

// リサイズ
let resizingChip  = null;
let chipResStartX = 0, chipResStartY = 0;
let chipResStartW = 0, chipResStartH = 0;

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
    const chip = resizingChip.querySelector('.staff-chip-wrap > div');
    if (chip) {
        chip.style.width  = Math.max(50, chipResStartW + (cx - chipResStartX)) + 'px';
        chip.style.height = Math.max(50, chipResStartH + (cy - chipResStartY)) + 'px';
    }
}

function onChipResizeEnd()      { endChipResize(); }
function onChipResizeEndTouch() { endChipResize(); }

function endChipResize() {
    document.removeEventListener('mousemove', onChipResize);
    document.removeEventListener('mouseup',   onChipResizeEnd);
    document.removeEventListener('touchmove', onChipResizeTouch);
    document.removeEventListener('touchend',  onChipResizeEndTouch);
    if (!resizingChip) return;

    const chip    = resizingChip.querySelector('.staff-chip-wrap > div');
    const staffId = resizingChip.dataset.id;

    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'staff',
            item_id:       parseInt(staffId),
            pos_x:         parseFloat(resizingChip.style.left) || 0,
            pos_y:         parseFloat(resizingChip.style.top)  || 0,
            meta: {
                staff_name: resizingChip.dataset.name ?? '',
                role_name:  resizingChip.dataset.role ?? '',
                color:      parseInt(resizingChip.dataset.color ?? 0),
                shape:      resizingChip.dataset.shape ?? 'rect',
                width:      chip ? chip.offsetWidth  : 90,
                height:     chip ? chip.offsetHeight : 40,
            },
        }),
    });

    resizingChip = null;
}

// 編集モーダル
let activeStaffId  = null;
let activeMagnetEl = null;
let selectedColor  = 0;
let selectedSize   = 'M';
let selectedShape  = 'rect';

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
                <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;width:180px;">
                    ${COLORS.map((c, i) => `
                        <div class="edit-color-chip" data-color="${i}"
                            style="height:32px;border-radius:6px;cursor:pointer;
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

function openEditModal(e, el) {
    e.preventDefault();
    activeStaffId  = el.dataset.id;
    activeMagnetEl = el;

    const appearanceTab = modal.querySelector('.modal-tab[data-tab="appearance"]');
    if (appearanceTab) appearanceTab.style.display = 'block';

    document.getElementById('edit-name').value = el.dataset.name ?? '';
    document.getElementById('edit-role').value = el.dataset.role ?? '';
    selectedColor = parseInt(el.dataset.color ?? 0) || 0;
    selectedSize  = el.dataset.size ?? 'M';
    selectedShape = el.dataset.shape ?? 'rect';

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

    modal.querySelectorAll('.edit-shape-chip').forEach(c => {
        const active = c.dataset.shape === selectedShape;
        c.style.borderColor = active ? '#374151' : '#d1d5db';
        c.style.background  = active ? '#f3f4f6' : 'white';
    });

    document.getElementById('tab-basic').style.display      = 'block';
    document.getElementById('tab-appearance').style.display = 'none';
    modal.querySelectorAll('.modal-tab').forEach(t => {
        const isBasic = t.dataset.tab === 'basic';
        t.style.borderBottomColor = isBasic ? '#374151' : 'transparent';
        t.style.color             = isBasic ? '#374151' : '#9ca3af';
    });

    modal.style.display = 'flex';
}

document.getElementById('edit-save').addEventListener('click', () => {
    const name = document.getElementById('edit-name').value.trim();
    const role = document.getElementById('edit-role').value.trim();
    if (!name) return;
    const wrap = activeMagnetEl.querySelector('.staff-chip-wrap');
    const chip = wrap.querySelector('div');
    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'staff',
            item_id:       parseInt(activeStaffId),
            pos_x:         parseFloat(activeMagnetEl.style.left) || 0,
            pos_y:         parseFloat(activeMagnetEl.style.top)  || 0,
            meta: {
                staff_name: name,
                role_name:  role,
                color:      selectedColor,
                shape:      selectedShape,
                width:      chip ? chip.offsetWidth  : 90,
                height:     chip ? chip.offsetHeight : 40,
            },
        }),
    })
    .then(r => r.json())
    .then(() => {
        const c = COLORS[selectedColor];
        const SHAPES = {
            rect:           'border-radius:8px;clip-path:none;',
            circle:         'border-radius:50%;clip-path:none;',
            sharp:          'border-radius:0;clip-path:none;',
            rounded_bottom: 'border-radius:0 0 50% 50%;clip-path:none;',
            tab:            'border-radius:0 0 8px 8px;clip-path:none;',
        };
        chip.style.cssText = `
            background:${c.bg};
            border:2px solid ${c.border};
            border-top:${selectedShape === 'tab' ? '4px' : '2px'} solid ${c.border};
            width:${chip.style.width || chip.offsetWidth + 'px'};
            height:${chip.style.height || chip.offsetHeight + 'px'};
            padding:6px;text-align:center;
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

// スタッフ追加
export function addStaff() {
    const name = document.getElementById('newName').value.trim();
    const role = document.getElementById('newRole').value.trim();
    if (!name) return;

    fetch('/board/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({ whiteboard_id: WHITEBOARD_ID, staff_name: name, role_name: role }),
    })
    .then(r => r.json())
    .then(data => {
        const s  = data.item;
        const c  = COLORS[(s.meta?.color ?? 0) % COLORS.length];
        const el = document.createElement('div');
        el.className     = 'magnet absolute cursor-grab select-none';
        el.dataset.id    = s.whiteboard_item_id;
        el.dataset.color = s.meta?.color ?? 0;
        el.dataset.name  = s.meta?.staff_name ?? '';
        el.dataset.role  = s.meta?.role_name ?? '';
        el.dataset.shape = s.meta?.shape ?? 'rect';
        el.style.left = '40px';
        el.style.top  = '40px';
        el.innerHTML = staffChipHTML(s.meta?.staff_name ?? '', s.meta?.role_name ?? '', c);
        initMagnet(el);
        document.getElementById('board-canvas').appendChild(el);
        saveItem(s.whiteboard_item_id, 40, 40);
        document.getElementById('newName').value = '';
        document.getElementById('newRole').value = '';
    });
}

function staffChipHTML(name, role, c) {
    return `
        <div class="staff-chip-wrap" style="position:relative;display:inline-block;">
            <div style="width:90px;padding:6px;border-radius:8px;text-align:center;
                        border:2px solid ${c.border};background:${c.bg};">
                <div data-field="name" style="font-size:12px;font-weight:500;color:${c.text};">${name}</div>
                <div data-field="role" style="font-size:10px;color:${c.text};opacity:.7;">${role}</div>
            </div>
            <div class="chip-edit-btn" data-tippy-content="編集" style="display:none;position:absolute;top:-7px;right:-7px;
                width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
                align-items:center;justify-content:center;cursor:pointer;z-index:10;">✏</div>
            <div class="chip-copy-btn" data-tippy-content="複製" style="display:none;position:absolute;top:-7px;right:14px;
                width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
                align-items:center;justify-content:center;cursor:pointer;z-index:10;">📋</div>
            <div class="chip-delete-btn" data-tippy-content="削除" style="display:none;position:absolute;top:-7px;left:-7px;
                width:18px;height:18px;border-radius:50%;background:#ef4444;color:white;font-size:12px;
                line-height:18px;text-align:center;cursor:pointer;z-index:10;">×</div>
            <div class="chip-resize-handle" data-tippy-content="サイズ変更" style="
                display:none;position:absolute;bottom:-4px;right:-4px;
                width:14px;height:14px;border-radius:2px;
                color:#374151;font-size:18px;line-height:14px;text-align:center;
                cursor:se-resize;z-index:10;user-select:none;
            ">⤡</div>
        </div>`;
}

// 複製
function copyStaff(el) {
    fetch('/board/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            staff_name:    el.dataset.name,
            role_name:     el.dataset.role,
            color:         parseInt(el.dataset.color) || 0,
        }),
    })
    .then(r => r.json())
    .then(data => {
        const s    = data.item;
        const newEl = document.createElement('div');
        newEl.className  = 'magnet absolute cursor-grab select-none';
        newEl.dataset.id    = s.whiteboard_item_id;
        newEl.dataset.color = s.meta?.color ?? 0;
        newEl.dataset.name  = s.meta?.staff_name ?? '';
        newEl.dataset.role  = s.meta?.role_name ?? '';
        newEl.dataset.size  = el.dataset.size ?? 'M';
        newEl.dataset.shape = el.dataset.shape ?? 'rect';
        newEl.innerHTML = el.innerHTML;

        newEl.querySelectorAll('.chip-edit-btn, .chip-copy-btn').forEach(b => b.style.display = 'none');
        newEl.querySelectorAll('.chip-resize-handle').forEach(b => b.style.display = 'none');
        initMagnet(newEl);

        if (lastCopyEl !== el) { setCopyOffset(0); setLastCopyEl(el); }
        setCopyOffset(copyOffset + 20);
        const px = (parseFloat(el.style.left) || 0) + copyOffset;
        const py = (parseFloat(el.style.top)  || 0) + copyOffset;
        newEl.style.left = px + 'px';
        newEl.style.top  = py + 'px';
        document.getElementById('board-canvas').appendChild(newEl);
        saveItem(s.whiteboard_item_id, px, py);
    });
}

// リアルタイム受信
export function handleStaffAdded(p) {
    setTimeout(() => {
        if (document.querySelector(`.magnet[data-id="${p.whiteboard_item_id}"]`)) return;
        const c  = COLORS[(p.meta?.color ?? 0) % COLORS.length];
        const el = document.createElement('div');
        el.className     = 'magnet absolute cursor-grab select-none';
        el.dataset.id    = p.whiteboard_item_id;
        el.dataset.color = p.meta?.color ?? 0;
        el.dataset.name  = p.meta?.staff_name ?? '';
        el.dataset.role  = p.meta?.role_name ?? '';
        el.dataset.shape = p.meta?.shape ?? 'rect';
        el.style.left = '40px';
        el.style.top  = '40px';
        el.innerHTML = staffChipHTML(p.meta?.staff_name ?? '', p.meta?.role_name ?? '', c);
        initMagnet(el);
        document.getElementById('board-canvas').appendChild(el);
    }, 100);
}

export function handleStaffDeleted(p) {
    const el = document.querySelector(`.magnet[data-id="${p.staffId}"]`);
    if (el) el.remove();
}

export function handleItemUpdatedStaff(p) {
    const el = document.querySelector(`.magnet[data-id="${p.itemId}"]`);
    if (!el) return;
    el.style.position = 'absolute';
    el.style.left     = p.posX + 'px';
    el.style.top      = p.posY + 'px';
    if (p.meta?.width)  el.querySelector('.staff-chip-wrap > div').style.width  = p.meta.width  + 'px';
    if (p.meta?.height) el.querySelector('.staff-chip-wrap > div').style.height = p.meta.height + 'px';
    // 名前・色・形の更新
    if (p.meta?.staff_name || p.meta?.color !== undefined || p.meta?.shape) {
        const c    = COLORS[(p.meta.color ?? 0) % COLORS.length];
        const wrap = el.querySelector('.staff-chip-wrap');
        const chip = wrap?.querySelector('div');
        const SHAPES = {
            rect:           'border-radius:8px;',
            circle:         'border-radius:50%;',
            sharp:          'border-radius:0;',
            rounded_bottom: 'border-radius:0 0 50% 50%;',
            tab:            'border-radius:0 0 8px 8px;',
        };
        if (chip) {
            chip.style.cssText = `
                background:${c.bg};border:2px solid ${c.border};
                width:${chip.style.width || chip.offsetWidth + 'px'};
                height:${chip.style.height || chip.offsetHeight + 'px'};
                padding:6px;text-align:center;
                ${SHAPES[p.meta.shape] ?? SHAPES['rect']}
            `;
        }
        el.dataset.name  = p.meta.staff_name ?? '';
        el.dataset.role  = p.meta.role_name  ?? '';
        el.dataset.color = p.meta.color ?? 0;
        el.dataset.shape = p.meta.shape ?? 'rect';
        const nameEl = wrap?.querySelector('[data-field="name"]');
        const roleEl = wrap?.querySelector('[data-field="role"]');
        if (nameEl) { nameEl.textContent = p.meta.staff_name ?? ''; nameEl.style.color = c.text; }
        if (roleEl) { roleEl.textContent = p.meta.role_name  ?? ''; roleEl.style.color = c.text; }
    }
    document.getElementById('board-canvas').appendChild(el);
}