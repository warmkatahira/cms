import {
    board, WHITEBOARD_ID, CSRF, CANVAS_W, CANVAS_H,
    copyOffset, lastCopyEl, setCopyOffset, setLastCopyEl,
} from './constants.js';
import { initTippy } from './constants.js';

export function createImageEl(item) {
    const meta = item.meta ?? {};
    const el   = document.createElement('div');
    el.className = 'image-box absolute cursor-grab select-none';
    el.dataset.imageId = item.whiteboard_item_id;
    el.style.cssText = `
        left:${item.pos_x}px;top:${item.pos_y}px;
        width:${meta.width ?? 200}px;height:${meta.height ?? 200}px;
        position:absolute;
    `;
    el.innerHTML = `
        <img src="${meta.src}" draggable="false" style="
            width:100%;height:100%;object-fit:contain;
            border-radius:4px;pointer-events:none;
        ">
        <div class="image-delete-btn" data-tippy-content="削除" style="display:none;position:absolute;top:-7px;left:-7px;
            width:18px;height:18px;border-radius:50%;background:#ef4444;color:white;font-size:12px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">×</div>
        <div class="image-copy-btn" data-tippy-content="複製" style="display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">📋</div>
        <div class="image-resize-handle" data-tippy-content="サイズ変更" style="display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;color:#374151;font-size:18px;line-height:14px;
            text-align:center;cursor:se-resize;z-index:10;user-select:none;">⤡</div>
    `;
    return el;
}

export function initImage(el) {
    el.addEventListener('mousedown',  e => startImageDrag(e, el));
    el.addEventListener('touchstart', e => startImageDrag(e, el), { passive: false });

    el.addEventListener('mouseenter', () => {
        el.querySelector('.image-delete-btn').style.display  = 'block';
        el.querySelector('.image-copy-btn').style.display    = 'block';
        el.querySelector('.image-resize-handle').style.display = 'block';
    });
    el.addEventListener('mouseleave', () => {
        el.querySelector('.image-delete-btn').style.display  = 'none';
        el.querySelector('.image-copy-btn').style.display    = 'none';
        el.querySelector('.image-resize-handle').style.display = 'none';
    });

    // 削除
    const deleteBtn = el.querySelector('.image-delete-btn');
    deleteBtn.addEventListener('mousedown', e => e.stopPropagation());
    deleteBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (!confirm('この画像を削除しますか？')) return;
        fetch('/board/image/' + el.dataset.imageId, {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': CSRF },
        })
        .then(r => r.json())
        .then(() => el.remove());
    });

    // 複製
    const copyBtn = el.querySelector('.image-copy-btn');
    copyBtn.addEventListener('mousedown', e => e.stopPropagation());
    copyBtn.addEventListener('click', e => { e.stopPropagation(); copyImage(el); });

    // リサイズ
    const resizeHandle = el.querySelector('.image-resize-handle');
    resizeHandle.addEventListener('mousedown', e => startImageResize(e, el));
    resizeHandle.addEventListener('touchstart', e => startImageResize(e, el), { passive: false });
    initTippy(el);
}

// ドラッグ
let draggingImage  = null;
let imageGhost     = null;
let imageOffX = 0, imageOffY = 0;
let pendingImage   = null;
let pendingImageCx = 0, pendingImageCy = 0;

function startImageDrag(e, el) {
    if (e.target.classList.contains('image-delete-btn'))  return;
    if (e.target.classList.contains('image-copy-btn'))    return;
    if (e.target.classList.contains('image-resize-handle')) return;

    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    pendingImage   = el;
    pendingImageCx = cx;
    pendingImageCy = cy;
    document.addEventListener('mousemove', onImageMoveCheck);
    document.addEventListener('mouseup',   onImageCancelPending);
}

function onImageMoveCheck(e) {
    const dx = e.clientX - pendingImageCx;
    const dy = e.clientY - pendingImageCy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        document.removeEventListener('mousemove', onImageMoveCheck);
        document.removeEventListener('mouseup',   onImageCancelPending);
        beginImageDrag(pendingImage, pendingImageCx, pendingImageCy);
        pendingImage = null;
    }
}

function onImageCancelPending() {
    document.removeEventListener('mousemove', onImageMoveCheck);
    document.removeEventListener('mouseup',   onImageCancelPending);
    pendingImage = null;
}

function beginImageDrag(el, startCx, startCy) {
    draggingImage = el;
    const rect = el.getBoundingClientRect();
    imageOffX = startCx - rect.left;
    imageOffY = startCy - rect.top;

    imageGhost = el.cloneNode(true);
    imageGhost.style.cssText += `position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;`;
    document.body.appendChild(imageGhost);
    el.style.opacity = '0.3';

    document.addEventListener('mousemove', onImageMove);
    document.addEventListener('mouseup',   onImageUp);
}

function onImageMove(e) {
    imageGhost.style.left = (e.clientX - imageOffX) + 'px';
    imageGhost.style.top  = (e.clientY - imageOffY) + 'px';
}

function onImageUp(e) {
    document.removeEventListener('mousemove', onImageMove);
    document.removeEventListener('mouseup',   onImageUp);
    imageGhost.remove();
    imageGhost = null;

    const boardRect = board.getBoundingClientRect();
    const imgEl     = draggingImage;
    let px = e.clientX - boardRect.left + board.scrollLeft - imageOffX;
    let py = e.clientY - boardRect.top  + board.scrollTop  - imageOffY;
    px = Math.max(0, Math.min(px, CANVAS_W - imgEl.offsetWidth));
    py = Math.max(0, Math.min(py, CANVAS_H - imgEl.offsetHeight));

    imgEl.style.left    = px + 'px';
    imgEl.style.top     = py + 'px';
    imgEl.style.opacity = '1';
    draggingImage = null;

    saveImageItem(imgEl, px, py);
}

function saveImageItem(el, px, py) {
    const img = el.querySelector('img');
    fetch('/board/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            item_type:     'image',
            item_id:       parseInt(el.dataset.imageId),
            pos_x:         px,
            pos_y:         py,
            meta: {
                src:    img.src.replace(location.origin, ''),
                width:  el.offsetWidth,
                height: el.offsetHeight,
            },
        }),
    });
}

// リサイズ
let resizingImage  = null;
let imageResStartX = 0, imageResStartY = 0;
let imageResStartW = 0, imageResStartH = 0;

function startImageResize(e, el) {
    e.stopPropagation();
    e.preventDefault();
    resizingImage  = el;
    imageResStartX = e.touches ? e.touches[0].clientX : e.clientX;
    imageResStartY = e.touches ? e.touches[0].clientY : e.clientY;
    imageResStartW = el.offsetWidth;
    imageResStartH = el.offsetHeight;
    document.addEventListener('mousemove', onImageResize);
    document.addEventListener('mouseup',   onImageResizeEnd);
}

function onImageResize(e) {
    if (!resizingImage) return;
    resizingImage.style.width  = Math.max(40, imageResStartW + (e.clientX - imageResStartX)) + 'px';
    resizingImage.style.height = Math.max(40, imageResStartH + (e.clientY - imageResStartY)) + 'px';
}

function onImageResizeEnd() {
    document.removeEventListener('mousemove', onImageResize);
    document.removeEventListener('mouseup',   onImageResizeEnd);
    if (!resizingImage) return;
    saveImageItem(
        resizingImage,
        parseFloat(resizingImage.style.left) || 0,
        parseFloat(resizingImage.style.top)  || 0,
    );
    resizingImage = null;
}

// 画像追加
export function addImage() {
    const input = document.createElement('input');
    input.type   = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', () => {
        const file = input.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('whiteboard_id', WHITEBOARD_ID);
        formData.append('image', file);

        fetch('/board/image', {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': CSRF },
            body: formData,
        })
        .then(r => r.json())
        .then(data => {
            const el = createImageEl(data.item);
            document.getElementById('board-canvas').appendChild(el);
            initImage(el);
        });
    });
    input.click();
}

// 複製
function copyImage(el) {
    const img = el.querySelector('img');
    const src = img.src.replace(location.origin, '');

    // 同じ画像で新しいアイテムを作成（サーバー側でDBレコードのみ作成）
    fetch('/board/image/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({
            whiteboard_id: WHITEBOARD_ID,
            src:           src,
            width:         el.offsetWidth,
            height:        el.offsetHeight,
        }),
    })
    .then(r => r.json())
    .then(data => {
        const item = data.item;
        if (lastCopyEl !== el) { setCopyOffset(0); setLastCopyEl(el); }
        setCopyOffset(copyOffset + 20);
        item.pos_x = (parseFloat(el.style.left) || 0) + copyOffset;
        item.pos_y = (parseFloat(el.style.top)  || 0) + copyOffset;

        const newEl = createImageEl(item);
        newEl.querySelectorAll('.image-delete-btn, .image-copy-btn').forEach(b => b.style.display = 'none');
        newEl.querySelectorAll('.image-resize-handle').forEach(b => b.style.display = 'none');
        document.getElementById('board-canvas').appendChild(newEl);
        initImage(newEl);

        fetch('/board/item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
            body: JSON.stringify({
                whiteboard_id: WHITEBOARD_ID,
                item_type:     'image',
                item_id:       parseInt(item.whiteboard_item_id),
                pos_x:         item.pos_x,
                pos_y:         item.pos_y,
                meta:          item.meta,
            }),
        });
    });
}

// リアルタイム受信
export function handleImageAdded(p) {
    setTimeout(() => {
        if (document.querySelector(`.image-box[data-image-id="${p.whiteboard_item_id}"]`)) return;
        const el = createImageEl(p);
        document.getElementById('board-canvas').appendChild(el);
        initImage(el);
    }, 100);
}

export function handleImageDeleted(p) {
    const el = document.querySelector(`.image-box[data-image-id="${p.itemId}"]`);
    if (el) el.remove();
}

export function handleItemUpdatedImage(p) {
    const el = document.querySelector(`.image-box[data-image-id="${p.itemId}"]`);
    if (!el) return;
    el.style.left = p.posX + 'px';
    el.style.top  = p.posY + 'px';
    if (p.meta?.width)  el.style.width  = p.meta.width  + 'px';
    if (p.meta?.height) el.style.height = p.meta.height + 'px';
}