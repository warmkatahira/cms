import {
    board, WHITEBOARD_ID, CSRF, CANVAS_W, CANVAS_H,
    copyOffset, lastCopyEl, setCopyOffset, setLastCopyEl,
} from './constants.js';

// SVG生成
export function createShapeSVG(shapeType, fillColor, strokeColor, itemId) {
    switch (shapeType) {
        case 'rect':
            return `<rect x="2" y="2" width="96" height="96"
                fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" rx="4"
                vector-effect="non-scaling-stroke"/>`;
        case 'circle':
            return `<ellipse cx="50" cy="50" rx="48" ry="48"
                fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"
                vector-effect="non-scaling-stroke"/>`;
        case 'triangle':
            return `<polygon points="50,2 98,98 2,98"
                fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"
                vector-effect="non-scaling-stroke"/>`;
        case 'line':
            return `<line x1="0" y1="50" x2="100" y2="50"
                stroke="${strokeColor}" stroke-width="3"
                vector-effect="non-scaling-stroke"/>`;
        case 'arrow':
            return `
                <defs>
                    <marker id="arrow-${itemId}" markerWidth="10" markerHeight="7"
                            refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="${strokeColor}"/>
                    </marker>
                </defs>
                <line x1="0" y1="50" x2="90" y2="50"
                    stroke="${strokeColor}" stroke-width="3"
                    vector-effect="non-scaling-stroke"
                    marker-end="url(#arrow-${itemId})"/>`;
        default:
            return '';
            }
}

export function createShapeEl(item) {
    const meta      = item.meta ?? {};
    const shapeType = meta.shape_type  ?? 'rect';
    const fillColor  = meta.fill_color  ?? '#93c5fd';
    const strokeColor = meta.stroke_color ?? '#2563eb';
    const rotation  = meta.rotation    ?? 0;

    const el = document.createElement('div');
    el.className = 'shape-box absolute cursor-grab select-none';
    el.dataset.shapeId   = item.whiteboard_item_id;
    el.dataset.shapeType = shapeType;
    el.dataset.fillColor  = fillColor;
    el.dataset.strokeColor = strokeColor;
    el.dataset.rotation  = rotation;
    el.style.cssText = `
        left:${item.pos_x}px;top:${item.pos_y}px;
        width:${meta.width ?? 120}px;height:${meta.height ?? 120}px;
        position:absolute;
        transform:rotate(${rotation}deg);
    `;
    el.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="overflow:visible;">
            ${createShapeSVG(shapeType, fillColor, strokeColor, item.whiteboard_item_id)}
        </svg>
        <div class="shape-delete-btn" style="display:none;position:absolute;top:-7px;left:-7px;
            width:18px;height:18px;border-radius:50%;background:#ef4444;color:white;font-size:12px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">×</div>
        <div class="shape-copy-btn" style="display:none;position:absolute;top:-7px;right:14px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">📋</div>
        <div class="shape-color-btn" style="display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">🎨</div>
        <div class="shape-resize-handle" style="display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;color:#374151;font-size:18px;line-height:14px;
            text-align:center;cursor:se-resize;z-index:10;user-select:none;">⤡</div>
        <div class="shape-rotate-handle" style="display:none;position:absolute;top:-7px;right:35px;
            width:14px;height:14px;border-radius:50%;background:#374151;
            cursor:grab;z-index:10;user-select:none;">↻</div>
    `;
    return el;
}

export function initShape(el) {
    el.addEventListener('mousedown',  e => startShapeDrag(e, el));
    el.addEventListener('touchstart', e => startShapeDrag(e, el), { passive: false });

    el.addEventListener('mouseenter', () => {
        el.querySelector('.shape-delete-btn').style.display  = 'block';
        el.querySelector('.shape-copy-btn').style.display    = 'block';
        el.querySelector('.shape-color-btn').style.display   = 'block';
        el.querySelector('.shape-resize-handle').style.display = 'block';
        el.querySelector('.shape-rotate-handle').style.display = 'block';
    });
    el.addEventListener('mouseleave', (e) => {
        // 回転ハンドルへの移動は無視
        if (e.relatedTarget && e.relatedTarget.classList.contains('shape-rotate-handle')) return;
        el.querySelector('.shape-delete-btn').style.display  = 'none';
        el.querySelector('.shape-copy-btn').style.display    = 'none';
        el.querySelector('.shape-color-btn').style.display   = 'none';
        el.querySelector('.shape-resize-handle').style.display = 'none';
        el.querySelector('.shape-rotate-handle').style.display = 'none';
    });

    // 削除
    const deleteBtn = el.querySelector('.shape-delete-btn');
    deleteBtn.addEventListener('mousedown', e => e.stopPropagation());
    deleteBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (!confirm('この図形を削除しますか？')) return;
        fetch('/board/shape/' + el.dataset.shapeId, {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': CSRF },
        })
        .then(r => r.json())
        .then(() => el.remove());
    });

    // 複製
    const copyBtn = el.querySelector('.shape-copy-btn');
    copyBtn.addEventListener('mousedown', e => e.stopPropagation());
    copyBtn.addEventListener('click', e => { e.stopPropagation(); copyShape(el); });

    // 色変更
    const colorBtn = el.querySelector('.shape-color-btn');
    colorBtn.addEventListener('mousedown', e => e.stopPropagation());
    colorBtn.addEventListener('click', e => { e.stopPropagation(); openColorModal(el); });

    // リサイズ
    const resizeHandle = el.querySelector('.shape-resize-handle');
    resizeHandle.addEventListener('mousedown', e => startShapeResize(e, el));
    resizeHandle.addEventListener('touchstart', e => startShapeResize(e, el), { passive: false });

    // 回転
    const rotateHandle = el.querySelector('.shape-rotate-handle');
    rotateHandle.addEventListener('mouseleave', (e) => {
        // ドラッグ中は非表示にしない
        if (rotatingShape) return;
        // el に戻る場合は非表示にしない
        if (e.relatedTarget && (e.relatedTarget === el || el.contains(e.relatedTarget))) return;
        el.querySelector('.shape-delete-btn').style.display   = 'none';
        el.querySelector('.shape-copy-btn').style.display     = 'none';
        el.querySelector('.shape-color-btn').style.display    = 'none';
        el.querySelector('.shape-resize-handle').style.display = 'none';
        rotateHandle.style.display = 'none';
    });
    rotateHandle.addEventListener('mousedown', e => startShapeRotate(e, el));
}

// ドラッグ
let draggingShape  = null;
let shapeGhost     = null;
let shapeOffX = 0, shapeOffY = 0;
let pendingShape   = null;
let pendingShapeCx = 0, pendingShapeCy = 0;

function startShapeDrag(e, el) {
    if (e.target.classList.contains('shape-delete-btn'))  return;
    if (e.target.classList.contains('shape-copy-btn'))    return;
    if (e.target.classList.contains('shape-color-btn'))   return;
    if (e.target.classList.contains('shape-resize-handle')) return;
    if (e.target.classList.contains('shape-rotate-handle')) return;

    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    pendingShape   = el;
    pendingShapeCx = cx;
    pendingShapeCy = cy;
    document.addEventListener('mousemove', onShapeMoveCheck);
    document.addEventListener('mouseup',   onShapeCancelPending);
}

function onShapeMoveCheck(e) {
    const dx = e.clientX - pendingShapeCx;
    const dy = e.clientY - pendingShapeCy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        document.removeEventListener('mousemove', onShapeMoveCheck);
        document.removeEventListener('mouseup',   onShapeCancelPending);
        beginShapeDrag(pendingShape, pendingShapeCx, pendingShapeCy);
        pendingShape = null;
    }
}

function onShapeCancelPending() {
    document.removeEventListener('mousemove', onShapeMoveCheck);
    document.removeEventListener('mouseup',   onShapeCancelPending);
    pendingShape = null;
}

function beginShapeDrag(el, startCx, startCy) {
    draggingShape = el;
    const rect = el.getBoundingClientRect();
    shapeOffX = startCx - rect.left;
    shapeOffY = startCy - rect.top;

    shapeGhost = el.cloneNode(true);
    shapeGhost.style.cssText += `position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;`;
    document.body.appendChild(shapeGhost);
    el.style.opacity = '0.3';

    document.addEventListener('mousemove', onShapeMove);
    document.addEventListener('mouseup',   onShapeUp);
}

function onShapeMove(e) {
    shapeGhost.style.left = (e.clientX - shapeOffX) + 'px';
    shapeGhost.style.top  = (e.clientY - shapeOffY) + 'px';
}

function onShapeUp(e) {
    document.removeEventListener('mousemove', onShapeMove);
    document.removeEventListener('mouseup',   onShapeUp);
    shapeGhost.remove();
    shapeGhost = null;

    const boardRect = board.getBoundingClientRect();
    const shapeEl   = draggingShape;
    let px = e.clientX - boardRect.left + board.scrollLeft - shapeOffX;
    let py = e.clientY - boardRect.top  + board.scrollTop  - shapeOffY;
    px = Math.max(0, Math.min(px, CANVAS_W - shapeEl.offsetWidth));
    py = Math.max(0, Math.min(py, CANVAS_H - shapeEl.offsetHeight));

    shapeEl.style.left    = px + 'px';
    shapeEl.style.top     = py + 'px';
    shapeEl.style.opacity = '1';
    draggingShape = null;

    saveShapeItem(shapeEl, px, py);
}

function saveShapeItem(el, px, py) {
    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'shape',
            item_id:       parseInt(el.dataset.shapeId),
            on_board:      true,
            pos_x:         px,
            pos_y:         py,
            meta: {
                shape_type:   el.dataset.shapeType,
                fill_color:   el.dataset.fillColor,
                stroke_color: el.dataset.strokeColor,
                rotation:     parseInt(el.dataset.rotation) || 0,
                width:        el.offsetWidth,
                height:       el.offsetHeight,
            },
        }),
    });
}

// リサイズ
let resizingShape  = null;
let shapeResStartX = 0, shapeResStartY = 0;
let shapeResStartW = 0, shapeResStartH = 0;

function startShapeResize(e, el) {
    e.stopPropagation();
    e.preventDefault();
    resizingShape  = el;
    shapeResStartX = e.touches ? e.touches[0].clientX : e.clientX;
    shapeResStartY = e.touches ? e.touches[0].clientY : e.clientY;
    shapeResStartW = el.offsetWidth;
    shapeResStartH = el.offsetHeight;
    document.addEventListener('mousemove', onShapeResize);
    document.addEventListener('mouseup',   onShapeResizeEnd);
}

function onShapeResize(e) {
    if (!resizingShape) return;
    resizingShape.style.width  = Math.max(20, shapeResStartW + (e.clientX - shapeResStartX)) + 'px';
    resizingShape.style.height = Math.max(20, shapeResStartH + (e.clientY - shapeResStartY)) + 'px';
}

function onShapeResizeEnd() {
    document.removeEventListener('mousemove', onShapeResize);
    document.removeEventListener('mouseup',   onShapeResizeEnd);
    if (!resizingShape) return;
    saveShapeItem(
        resizingShape,
        parseFloat(resizingShape.style.left) || 0,
        parseFloat(resizingShape.style.top)  || 0,
    );
    resizingShape = null;
}

// 回転
let rotatingShape = null;
let rotateCenterX = 0, rotateCenterY = 0;
let rotateStartAngle = 0;

function startShapeRotate(e, el) {
    e.stopPropagation();
    e.preventDefault();
    rotatingShape = el;
    const rect = el.getBoundingClientRect();
    rotateCenterX = rect.left + rect.width  / 2;
    rotateCenterY = rect.top  + rect.height / 2;
    rotateStartAngle = parseInt(el.dataset.rotation) || 0;
    document.addEventListener('mousemove', onShapeRotate);
    document.addEventListener('mouseup',   onShapeRotateEnd);
}

function onShapeRotate(e) {
    if (!rotatingShape) return;
    const dx    = e.clientX - rotateCenterX;
    const dy    = e.clientY - rotateCenterY;
    const angle = Math.round(Math.atan2(dy, dx) * (180 / Math.PI) + 90);
    rotatingShape.style.transform    = `rotate(${angle}deg)`;
    rotatingShape.dataset.rotation   = angle;
}

function onShapeRotateEnd() {
    document.removeEventListener('mousemove', onShapeRotate);
    document.removeEventListener('mouseup',   onShapeRotateEnd);
    if (!rotatingShape) return;
    saveShapeItem(
        rotatingShape,
        parseFloat(rotatingShape.style.left) || 0,
        parseFloat(rotatingShape.style.top)  || 0,
    );
    rotatingShape = null;
}

// 色変更モーダル
const colorModal = document.createElement('div');
colorModal.id = 'shape-color-modal';
colorModal.style.cssText = `
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;
colorModal.innerHTML = `
    <div style="background:white;border-radius:12px;padding:24px;width:280px;">
        <p style="font-size:15px;font-weight:500;margin-bottom:16px;">色を変更</p>
        <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:6px;">塗りつぶし色</label>
            <input type="color" id="shape-fill-color"
                   style="width:100%;height:36px;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;">
        </div>
        <div style="margin-bottom:20px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:6px;">枠線の色</label>
            <input type="color" id="shape-stroke-color"
                   style="width:100%;height:36px;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;">
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button id="shape-color-cancel"
                    style="font-size:13px;padding:6px 16px;border:1px solid #d1d5db;
                           border-radius:6px;cursor:pointer;background:white;">
                キャンセル
            </button>
            <button id="shape-color-save"
                    style="font-size:13px;padding:6px 16px;border:none;
                           border-radius:6px;cursor:pointer;background:#374151;color:white;">
                保存
            </button>
        </div>
    </div>
`;
document.body.appendChild(colorModal);

let activeShapeEl = null;

document.getElementById('shape-color-cancel').addEventListener('click', () => {
    colorModal.style.display = 'none';
});

document.getElementById('shape-color-save').addEventListener('click', () => {
    const fillColor   = document.getElementById('shape-fill-color').value;
    const strokeColor = document.getElementById('shape-stroke-color').value;

    activeShapeEl.dataset.fillColor   = fillColor;
    activeShapeEl.dataset.strokeColor = strokeColor;

    const svg = activeShapeEl.querySelector('svg');
    svg.innerHTML = createShapeSVG(
        activeShapeEl.dataset.shapeType,
        fillColor,
        strokeColor,
        activeShapeEl.dataset.shapeId,
    );

    saveShapeItem(
        activeShapeEl,
        parseFloat(activeShapeEl.style.left) || 0,
        parseFloat(activeShapeEl.style.top)  || 0,
    );

    colorModal.style.display = 'none';
});

function openColorModal(el) {
    activeShapeEl = el;
    document.getElementById('shape-fill-color').value   = el.dataset.fillColor   || '#93c5fd';
    document.getElementById('shape-stroke-color').value = el.dataset.strokeColor || '#2563eb';
    colorModal.style.display = 'flex';
}

// 複製
function copyShape(el) {
    fetch('/board/shape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            shape_type:    el.dataset.shapeType,
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
        item.meta  = {
            shape_type:   el.dataset.shapeType,
            fill_color:   el.dataset.fillColor,
            stroke_color: el.dataset.strokeColor,
            rotation:     parseInt(el.dataset.rotation) || 0,
            width:        el.offsetWidth,
            height:       el.offsetHeight,
        };

        const newEl = createShapeEl(item);
        newEl.querySelectorAll('.shape-delete-btn, .shape-copy-btn, .shape-color-btn').forEach(b => b.style.display = 'none');
        newEl.querySelectorAll('.shape-resize-handle, .shape-rotate-handle').forEach(b => b.style.display = 'none');
        document.getElementById('board-canvas').appendChild(newEl);
        initShape(newEl);

        fetch('/board/item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
            body: JSON.stringify({
                whiteboard_id: WHITEBOARD_ID,
                item_type:     'shape',
                item_id:       parseInt(item.whiteboard_item_id),
                on_board:      true,
                pos_x:         px,
                pos_y:         py,
                meta:          item.meta,
            }),
        });
    });
}

// 図形追加
export function addShape(shapeType) {
    fetch('/board/shape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({ whiteboard_id: WHITEBOARD_ID, shape_type: shapeType }),
    })
    .then(r => r.json())
    .then(data => {
        const el = createShapeEl(data.item);
        document.getElementById('board-canvas').appendChild(el);
        initShape(el);
    });
}

// リアルタイム受信
export function handleShapeAdded(p) {
    setTimeout(() => {
        if (document.querySelector(`.shape-box[data-shape-id="${p.whiteboard_item_id}"]`)) return;
        const el = createShapeEl(p);
        document.getElementById('board-canvas').appendChild(el);
        initShape(el);
    }, 100);
}

export function handleShapeDeleted(p) {
    const el = document.querySelector(`.shape-box[data-shape-id="${p.itemId}"]`);
    if (el) el.remove();
}

export function handleItemUpdatedShape(p) {
    const el = document.querySelector(`.shape-box[data-shape-id="${p.itemId}"]`);
    if (!el) return;
    el.style.left      = p.posX + 'px';
    el.style.top       = p.posY + 'px';
    el.style.transform = `rotate(${p.meta?.rotation ?? 0}deg)`;
    if (p.meta?.width)  el.style.width  = p.meta.width  + 'px';
    if (p.meta?.height) el.style.height = p.meta.height + 'px';
    if (p.meta?.fillColor || p.meta?.strokeColor) {
        el.dataset.fillColor   = p.meta.fillColor;
        el.dataset.strokeColor = p.meta.strokeColor;
        const svg = el.querySelector('svg');
        svg.innerHTML = createShapeSVG(el.dataset.shapeType, p.meta.fillColor, p.meta.strokeColor, p.itemId);
    }
}