import {
    board, WHITEBOARD_ID, CSRF, CANVAS_W, CANVAS_H,
    ZONE_COLORS, copyOffset, lastCopyEl, setCopyOffset, setLastCopyEl,
} from './constants.js';
import { initTippy } from './constants.js';

let draggingZone  = null;
let zoneGhost     = null;
let zoneOffX = 0, zoneOffY = 0;
let pendingZone   = null;
let pendingZoneCx = 0, pendingZoneCy = 0;

export function initZone(el) {
    el.addEventListener('mousedown',  e => startZoneDrag(e, el));
    el.addEventListener('touchstart', e => startZoneDrag(e, el), { passive: false });

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

    const editBtn = el.querySelector('.zone-edit-btn');
    if (editBtn) {
        editBtn.addEventListener('mousedown', e => e.stopPropagation());
        editBtn.addEventListener('click', e => {
            e.stopPropagation();
            openZoneModal(el);
        });
    }

    const copyBtn = el.querySelector('.zone-copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('mousedown', e => e.stopPropagation());
        copyBtn.addEventListener('click', e => {
            e.stopPropagation();
            copyZone(el);
        });
    }

    const resizeHandle = el.querySelector('.zone-resize-handle');
    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', e => startZoneResize(e, el));
        resizeHandle.addEventListener('touchstart', e => startZoneResize(e, el), { passive: false });
    }
    initTippy(el);
}

function startZoneDrag(e, el) {
    if (e.target.classList.contains('zone-edit-btn')) return;
    if (e.target.classList.contains('zone-copy-btn')) return;
    if (draggingZone) { draggingZone.style.opacity = '1'; draggingZone = null; }
    if (zoneGhost)    { zoneGhost.remove(); zoneGhost = null; }
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
    const zoneEl    = draggingZone;
    const zoneId    = zoneEl.dataset.zoneId;

    let px = cx - boardRect.left + board.scrollLeft - zoneOffX;
    let py = cy - boardRect.top  + board.scrollTop  - zoneOffY;
    px = Math.max(0, Math.min(px, CANVAS_W - zoneEl.offsetWidth));
    py = Math.max(0, Math.min(py, CANVAS_H - zoneEl.offsetHeight));

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

// リサイズ
let resizingZone  = null;
let resizeStartX  = 0, resizeStartY  = 0;
let resizeStartW  = 0, resizeStartH  = 0;

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
    resizingZone.style.width  = Math.max(100, resizeStartW + (cx - resizeStartX)) + 'px';
    resizingZone.style.height = Math.max(80,  resizeStartH + (cy - resizeStartY)) + 'px';
}

function onZoneResizeEnd(e)      { endZoneResize(); }
function onZoneResizeEndTouch(e) { endZoneResize(); }

function endZoneResize() {
    document.removeEventListener('mousemove', onZoneResize);
    document.removeEventListener('mouseup',   onZoneResizeEnd);
    document.removeEventListener('touchmove', onZoneResizeTouch);
    document.removeEventListener('touchend',  onZoneResizeEndTouch);
    if (!resizingZone) return;

    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'zone',
            item_id:       parseInt(resizingZone.dataset.zoneId),
            pos_x:         parseFloat(resizingZone.style.left) || 0,
            pos_y:         parseFloat(resizingZone.style.top)  || 0,
            meta: {
                color_index: parseInt(resizingZone.dataset.colorIndex ?? 0),
                label:       resizingZone.dataset.label ?? '',
                width:       resizingZone.offsetWidth,
                height:      resizingZone.offsetHeight,
            },
        }),
    });

    resizingZone = null;
}

// 編集モーダル
let activeZoneEl      = null;
let selectedZoneColor = 0;

const zoneModal = document.createElement('div');
zoneModal.id = 'zone-edit-modal';
zoneModal.style.cssText = `
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;
zoneModal.innerHTML = `
    <div style="background:white;border-radius:12px;padding:24px;width:400px;">
        <p style="font-size:15px;font-weight:500;margin-bottom:16px;">グループを編集</p>
        <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:4px;">名称</label>
            <input id="zone-edit-label" type="text" autocomplete="off"
                   style="width:100%;font-size:14px;border:1px solid #d1d5db;border-radius:6px;padding:6px 10px;">
        </div>
        <div style="margin-bottom:20px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:8px;">色</label>
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;width:180px;">
                ${ZONE_COLORS.map((c, i) => `
                    <div class="zone-color-chip" data-color-index="${i}"
                        style="height:32px;border-radius:6px;cursor:pointer;
                                background:${c.bg};border:2px solid ${c.border};">
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
    </div>
`;
document.body.appendChild(zoneModal);

zoneModal.querySelectorAll('.zone-color-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        selectedZoneColor = parseInt(chip.dataset.colorIndex);
        zoneModal.querySelectorAll('.zone-color-chip').forEach(c => {
            c.style.outline   = 'none';
            c.style.transform = 'scale(1)';
        });
        chip.style.outline      = '2px solid #374151';
        chip.style.outlineOffset = '2px';
        chip.style.transform    = 'scale(1.2)';
    });
});

document.getElementById('zone-edit-cancel').addEventListener('click', () => {
    zoneModal.style.display = 'none';
});

document.getElementById('zone-edit-save').addEventListener('click', () => {
    const label = document.getElementById('zone-edit-label').value.trim();
    if (!label) return;

    const c = ZONE_COLORS[selectedZoneColor];

    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'zone',
            item_id:       parseInt(activeZoneEl.dataset.zoneId),
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

    activeZoneEl.style.borderColor  = c.border;
    activeZoneEl.style.background   = c.bg;
    activeZoneEl.dataset.colorIndex = selectedZoneColor;
    activeZoneEl.dataset.label      = label;
    const labelEl = activeZoneEl.querySelector('.zone-label-text');
    if (labelEl) { labelEl.textContent = label; labelEl.style.color = c.text; }

    zoneModal.style.display = 'none';
});

document.getElementById('zone-edit-delete').addEventListener('click', () => {
    if (!confirm('このグループを削除しますか？')) return;
    fetch('/board/zone/' + activeZoneEl.dataset.zoneId, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': CSRF },
    })
    .then(r => r.json())
    .then(() => {
        activeZoneEl.remove();
        zoneModal.style.display = 'none';
    });
});

function openZoneModal(el) {
    activeZoneEl      = el;
    selectedZoneColor = parseInt(el.dataset.colorIndex ?? 0);
    document.getElementById('zone-edit-label').value = el.dataset.label ?? '';
    zoneModal.querySelectorAll('.zone-color-chip').forEach(c => {
        const active = parseInt(c.dataset.colorIndex) === selectedZoneColor;
        c.style.outline      = active ? '2px solid #374151' : 'none';
        c.style.outlineOffset = '2px';
        c.style.transform    = active ? 'scale(1.2)' : 'scale(1)';
    });
    zoneModal.style.display = 'flex';
}

// グループ追加
export function addZone() {
    const label = document.getElementById('newZoneLabel').value.trim();
    if (!label) return;

    fetch('/board/zone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({ whiteboard_id: WHITEBOARD_ID, label, color_index: 0 }),
    })
    .then(r => r.json())
    .then(data => {
        const item = data.item;
        const el   = createZoneEl(item);
        document.getElementById('board-canvas').appendChild(el);
        initZone(el);
        document.getElementById('newZoneLabel').value = '';
    });
}

function createZoneEl(item) {
    const meta = item.meta ?? {};
    const c    = ZONE_COLORS[meta.color_index ?? 0];
    const el   = document.createElement('div');
    el.className = 'zone magnet-zone cursor-grab select-none absolute border-2 rounded-xl';
    el.dataset.zoneId     = item.whiteboard_item_id;
    el.dataset.colorIndex = meta.color_index ?? 0;
    el.dataset.label      = meta.label ?? '';
    el.style.cssText = `
        left:${item.pos_x ?? 40}px;top:${item.pos_y ?? 40}px;
        width:${meta.width ?? 180}px;height:${meta.height ?? 280}px;
        border-color:${c.border};background:${c.bg};
    `;
    el.innerHTML = zoneInnerHTML(meta.label ?? '', c);
    return el;
}

function zoneInnerHTML(label, c) {
    return `
        <span class="zone-label-text absolute -top-3 left-2 text-xs font-medium px-1 rounded pointer-events-none select-none"
              style="color:${c.text};background:#f7f6f0;">${label}</span>
        <div class="zone-edit-btn" data-tippy-content="編集" style="display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            align-items:center;justify-content:center;cursor:pointer;z-index:10;">✏</div>
        <div class="zone-copy-btn" data-tippy-content="複製" style="display:none;position:absolute;top:-7px;right:14px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            align-items:center;justify-content:center;cursor:pointer;z-index:10;">📋</div>
        <div class="zone-resize-handle" data-tippy-content="サイズ変更" style="display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;color:#374151;font-size:18px;line-height:14px;
            text-align:center;cursor:se-resize;z-index:10;user-select:none;">⤡</div>
    `;
}

// 複製
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
        if (lastCopyEl !== el) { setCopyOffset(0); setLastCopyEl(el); }
        setCopyOffset(copyOffset + 20);
        const px = (parseFloat(el.style.left) || 0) + copyOffset;
        const py = (parseFloat(el.style.top)  || 0) + copyOffset;

        item.pos_x = px;
        item.pos_y = py;
        item.meta.width  = el.offsetWidth;
        item.meta.height = el.offsetHeight;

        const newEl = createZoneEl(item);
        newEl.querySelectorAll('.zone-edit-btn, .zone-copy-btn').forEach(b => b.style.display = 'none');
        newEl.querySelectorAll('.zone-resize-handle').forEach(b => b.style.display = 'none');
        document.getElementById('board-canvas').appendChild(newEl);
        initZone(newEl);

        fetch('/board/item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
            body: JSON.stringify({
                whiteboard_id: WHITEBOARD_ID,
                item_type:     'zone',
                item_id:       parseInt(item.whiteboard_item_id),
                pos_x:         px,
                pos_y:         py,
                meta:          item.meta,
            }),
        });
    });
}

// リアルタイム受信
export function handleZoneAdded(p) {
    if (document.querySelector(`.magnet-zone[data-zone-id="${p.whiteboard_item_id}"]`)) return;
    const el = createZoneEl(p);
    document.getElementById('board-canvas').appendChild(el);
    initZone(el);
}

export function handleZoneDeleted(p) {
    const el = document.querySelector(`.magnet-zone[data-zone-id="${p.zoneId}"]`);
    if (el) el.remove();
}

export function handleItemUpdatedZone(p) {
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