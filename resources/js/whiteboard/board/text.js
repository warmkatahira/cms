import {
    board, WHITEBOARD_ID, CSRF, CANVAS_W, CANVAS_H,
    PALETTE, copyOffset, lastCopyEl, setCopyOffset, setLastCopyEl, rgbToHex,
} from './constants.js';

export function createTextEl(item) {
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
        <div class="text-box-inner" data-bg-color="${meta.bg_color ?? 'transparent'}" style="
            width:100%;min-height:100%;padding:8px;
            font-size:${meta.font_size ?? 14}px;
            color:${meta.color ?? '#374151'};
            font-weight:${meta.font_weight ?? '400'};
            font-family:${(meta.font_family ?? "'Kosugi Maru', sans-serif").replace(/"/g, "'")};
            text-align:${meta.text_align ?? 'left'};
            border:1.5px dashed #d1d5db;border-radius:6px;
            background-color:${meta.bg_color ?? 'transparent'};word-break:break-all;
            box-sizing:border-box;
        ">${(meta.text ?? '').replace(/\n/g, '<br>')}</div>
        <div class="text-edit-btn" style="
            display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;
            background:#374151;color:white;font-size:10px;
            align-items:center;justify-content:center;
            cursor:pointer;z-index:10;">✏</div>
        <div class="text-copy-btn" style="
            display:none;position:absolute;top:-7px;right:14px;
            width:18px;height:18px;border-radius:50%;
            background:#374151;color:white;font-size:10px;line-height:18px;
            text-align:center;cursor:pointer;z-index:10;">📋</div>
        <div class="text-delete-btn" style="
            display:none;position:absolute;top:-7px;left:-7px;
            width:18px;height:18px;border-radius:50%;
            background:#ef4444;color:white;font-size:12px;line-height:18px;
            text-align:center;cursor:pointer;z-index:10;">×</div>
        <div class="text-resize-handle" style="
            display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;
            color:#374151;font-size:18px;line-height:14px;text-align:center;
            cursor:se-resize;z-index:10;user-select:none;">⤡</div>
    `;
    return el;
}

export function initText(el) {
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

    el.querySelector('.text-box-inner').addEventListener('dblclick', e => {
        e.stopPropagation();
        startTextEdit(el);
    });

    const editBtn = el.querySelector('.text-edit-btn');
    editBtn.addEventListener('mousedown', e => e.stopPropagation());
    editBtn.addEventListener('click', e => { e.stopPropagation(); startTextEdit(el); });

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

    const copyBtn = el.querySelector('.text-copy-btn');
    copyBtn.addEventListener('mousedown', e => e.stopPropagation());
    copyBtn.addEventListener('click', e => { e.stopPropagation(); copyText(el); });

    const resizeHandle = el.querySelector('.text-resize-handle');
    resizeHandle.addEventListener('mousedown', e => startTextResize(e, el));
    resizeHandle.addEventListener('touchstart', e => startTextResize(e, el), { passive: false });
}

function startTextEdit(el) {
    const inner     = el.querySelector('.text-box-inner');
    const current   = inner.textContent;
    const currentBg = inner.style.backgroundColor || 'transparent';

    inner.contentEditable = 'true';
    inner.style.cursor    = 'text';
    inner.style.borderColor = '#374151';
    inner.focus();

    const range = document.createRange();
    range.selectNodeContents(inner);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

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
    const currentFont  = inner.style.fontFamily || "'Kosugi Maru', sans-serif";

    toolbar.innerHTML = `
        <select class="tb-font" style="font-size:11px;border:1px solid #e5e7eb;border-radius:4px;padding:2px 4px;width:110px;">
            <option value="'Kosugi Maru', sans-serif" ${currentFont.includes('Kosugi Maru') ? 'selected' : ''}>丸ゴシック</option>
            <option value="'Sawarabi Mincho', serif" ${currentFont.includes('Sawarabi Mincho') ? 'selected' : ''}>明朝</option>
            <option value="'Zen Maru Gothic', sans-serif" ${currentFont.includes('Zen Maru Gothic') ? 'selected' : ''}>丸ゴシック太</option>
            <option value="'Kiwi Maru', serif" ${currentFont.includes('Kiwi Maru') ? 'selected' : ''}>丸明朝</option>
            <option value="'Hachi Maru Pop', cursive" ${currentFont.includes('Hachi Maru Pop') ? 'selected' : ''}>手書き</option>
            <option value="'Potta One', cursive" ${currentFont.includes('Potta One') ? 'selected' : ''}>ポップ</option>
        </select>
        <select class="tb-size" style="font-size:11px;border:1px solid #e5e7eb;border-radius:4px;padding:2px 4px;">
            ${[10,12,14,16,18,20,24,28,32,40].map(s =>
                `<option value="${s}" ${s === currentSize ? 'selected' : ''}>${s}px</option>`
            ).join('')}
        </select>
        <div class="tb-color-wrap" style="position:relative;">
            <button class="tb-color-btn" title="文字色" style="
                width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
                cursor:pointer;font-size:14px;font-weight:700;line-height:24px;
                text-align:center;background:white;color:${currentColor};">A</button>
            <div class="tb-color-palette" style="
                display:none;position:absolute;top:-112px;left:0;
                background:white;border:1px solid #d1d5db;border-radius:6px;
                padding:4px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:30;">
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
                background-color:${currentBg === 'transparent' ? '#ffffff' : currentBg};">塗</button>
            <div class="tb-bg-palette" style="
                display:none;position:absolute;top:-112px;left:0;
                background:white;border:1px solid #d1d5db;border-radius:6px;
                padding:4px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:30;">
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
            background:${currentBold ? '#f3f4f6' : 'transparent'};
            color:#374151;">B</button>
        <button class="tb-align" data-align="left" title="左寄せ" style="
            font-size:12px;width:24px;height:24px;
            border:1px solid #e5e7eb;border-radius:4px;cursor:pointer;
            background:white;color:#374151;text-align:center;line-height:24px;
        ">≡</button>
        <button class="tb-align" data-align="center" title="中央" style="
            font-size:12px;width:24px;height:24px;
            border:1px solid #e5e7eb;border-radius:4px;cursor:pointer;
            background:white;color:#374151;text-align:center;line-height:24px;
        ">☰</button>
        <button class="tb-align" data-align="right" title="右寄せ" style="
            font-size:12px;width:24px;height:24px;
            border:1px solid #e5e7eb;border-radius:4px;cursor:pointer;
            background:white;color:#374151;text-align:center;line-height:24px;
        ">≣</button>
    `;
    el.appendChild(toolbar);

    toolbar.addEventListener('mousedown', e => {
        e.stopPropagation();
        if (!e.target.closest('select')) e.preventDefault();
    });

    toolbar.querySelector('.tb-font').addEventListener('change', e => {
        inner.style.fontFamily = e.target.value;
    });

    toolbar.querySelector('.tb-size').addEventListener('change', e => {
        inner.style.fontSize = e.target.value + 'px';
    });

    toolbar.querySelector('.tb-bold').addEventListener('click', e => {
        const isBold = inner.style.fontWeight === '700';
        inner.style.fontWeight     = isBold ? '400' : '700';
        e.target.style.borderColor = isBold ? '#e5e7eb' : '#374151';
        e.target.style.background  = isBold ? 'transparent'   : '#f3f4f6';
    });

    toolbar.querySelectorAll('.tb-align').forEach(btn => {
        if (btn.dataset.align === (inner.style.textAlign || 'left')) {
            btn.style.borderColor = '#374151';
            btn.style.background  = '#f3f4f6';
        }
        btn.addEventListener('click', () => {
            inner.style.textAlign = btn.dataset.align;
            toolbar.querySelectorAll('.tb-align').forEach(b => {
                b.style.borderColor = '#e5e7eb';
                b.style.background  = 'transparent';
            });
            btn.style.borderColor = '#374151';
            btn.style.background  = '#f3f4f6';
        });
    });

    const colorBtn     = toolbar.querySelector('.tb-color-btn');
    const colorPalette = toolbar.querySelector('.tb-color-palette');
    colorBtn.addEventListener('click', () => {
        colorPalette.style.display = colorPalette.style.display === 'none' ? 'block' : 'none';
        toolbar.querySelector('.tb-bg-palette').style.display = 'none';
    });
    toolbar.querySelectorAll('.tb-color-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            inner.style.color    = chip.dataset.color;
            colorBtn.style.color = chip.dataset.color;
            colorPalette.style.display = 'none';
            inner.focus();
        });
    });

    const bgBtn     = toolbar.querySelector('.tb-bg-btn');
    const bgPalette = toolbar.querySelector('.tb-bg-palette');
    bgBtn.addEventListener('click', () => {
        bgPalette.style.display = bgPalette.style.display === 'none' ? 'block' : 'none';
        colorPalette.style.display = 'none';
    });
    toolbar.querySelectorAll('.tb-bg-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            inner.style.backgroundColor = chip.dataset.color;
            inner.dataset.bgColor = chip.dataset.color;
            bgBtn.style.backgroundColor = chip.dataset.color;
            bgPalette.style.display = 'none';
            inner.focus();
        });
    });

    function saveText() {
        inner.removeEventListener('blur', onBlur);
        inner.contentEditable = 'false';
        inner.style.cursor    = 'inherit';
        inner.style.borderColor = '#d1d5db';
        toolbar.remove();

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
                    text:        inner.innerText.trim(),
                    font_size:   parseInt(inner.style.fontSize) || 14,
                    color:       inner.style.color || '#374151',
                    font_weight: inner.style.fontWeight || '400',
                    font_family: (inner.style.fontFamily || "'Kosugi Maru', sans-serif").replace(/"/g, "'"),
                    text_align:  inner.style.textAlign || 'left',
                    bg_color: inner.dataset.bgColor || 'transparent',
                    width:       el.offsetWidth,
                    height:      el.offsetHeight,
                },
            }),
        });
    }

    function onBlur(e) {
        if (toolbar.contains(e.relatedTarget)) { inner.focus(); return; }
        setTimeout(() => {
            if (inner.contentEditable !== 'true') return;
            saveText();
        }, 50);
    }
    inner.addEventListener('blur', onBlur);

    inner.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            inner.removeEventListener('blur', onBlur);
            inner.textContent   = current;
            inner.contentEditable = 'false';
            inner.style.cursor  = 'inherit';
            inner.style.borderColor = '#d1d5db';
            toolbar.remove();
        }
    });
}

// ドラッグ
let draggingText  = null;
let textGhost     = null;
let textOffX = 0, textOffY = 0;
let pendingText   = null;
let pendingTextCx = 0, pendingTextCy = 0;

function startTextDrag(e, el) {
    if (e.target.classList.contains('text-edit-btn'))      return;
    if (e.target.classList.contains('text-delete-btn'))    return;
    if (e.target.classList.contains('text-copy-btn'))      return;
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

    const boardRect = board.getBoundingClientRect();
    const textEl    = draggingText;
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
                text:        inner.innerText,
                font_size:   parseInt(inner.style.fontSize) || 14,
                color:       inner.style.color || '#374151',
                font_weight: inner.style.fontWeight || '400',
                font_family: (inner.style.fontFamily || "'Kosugi Maru', sans-serif").replace(/"/g, "'"),
                text_align:  inner.style.textAlign || 'left',
                bg_color: inner.dataset.bgColor || 'transparent',
                width:       textEl.offsetWidth,
                height:      textEl.offsetHeight,
            },
        }),
    });
}

// リサイズ
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
    resizingText.style.width  = Math.max(100, textResStartW + (e.clientX - textResStartX)) + 'px';
    resizingText.style.height = Math.max(50,  textResStartH + (e.clientY - textResStartY)) + 'px';
    const inner = resizingText.querySelector('.text-box-inner');
    if (inner) inner.style.minHeight = resizingText.style.height;
}

function onTextResizeEnd() {
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
                text:        inner.innerText,
                font_size:   parseInt(inner.style.fontSize) || 14,
                color:       inner.style.color || '#374151',
                font_weight: inner.style.fontWeight || '400',
                font_family: (inner.style.fontFamily || "'Kosugi Maru', sans-serif").replace(/"/g, "'"),
                text_align:  inner.style.textAlign || 'left',
                bg_color: inner.dataset.bgColor || 'transparent',
                width:       resizingText.offsetWidth,
                height:      resizingText.offsetHeight,
            },
        }),
    });
    resizingText = null;
}

// テキスト追加
export function addText() {
    fetch('/board/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({ whiteboard_id: WHITEBOARD_ID, text: 'テキスト' }),
    })
    .then(r => r.json())
    .then(data => {
        const el = createTextEl(data.item);
        document.getElementById('board-canvas').appendChild(el);
        initText(el);
    });
}

// 複製
function copyText(el) {
    const inner = el.querySelector('.text-box-inner');
    fetch('/board/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({ whiteboard_id: WHITEBOARD_ID, text: inner.innerText.trim() }),
    })
    .then(r => r.json())
    .then(data => {
        const item = data.item;
        item.meta = {
            ...item.meta,
            font_size:   parseInt(inner.style.fontSize) || 14,
            color:       inner.style.color || '#374151',
            font_weight: inner.style.fontWeight || '400',
            font_family: (inner.style.fontFamily || "'Kosugi Maru', sans-serif").replace(/"/g, "'"),
            text_align:  inner.style.textAlign || 'left',
            bg_color: inner.dataset.bgColor || 'transparent',
            width:       el.offsetWidth,
            height:      el.offsetHeight,
        };
        if (lastCopyEl !== el) { setCopyOffset(0); setLastCopyEl(el); }
        setCopyOffset(copyOffset + 20);
        item.pos_x = (parseFloat(el.style.left) || 0) + copyOffset;
        item.pos_y = (parseFloat(el.style.top)  || 0) + copyOffset;

        const newEl = createTextEl(item);
        newEl.querySelectorAll('.text-edit-btn, .text-copy-btn, .text-delete-btn').forEach(b => b.style.display = 'none');
        newEl.querySelectorAll('.text-resize-handle').forEach(b => b.style.display = 'none');
        document.getElementById('board-canvas').appendChild(newEl);
        initText(newEl);

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

// リアルタイム受信
export function handleTextAdded(p) {
    setTimeout(() => {
        if (document.querySelector(`.text-box[data-text-id="${p.whiteboard_item_id}"]`)) return;
        const el = createTextEl(p);
        document.getElementById('board-canvas').appendChild(el);
        initText(el);
    }, 100);
}

export function handleTextDeleted(p) {
    const el = document.querySelector(`.text-box[data-text-id="${p.itemId}"]`);
    if (el) el.remove();
}

export function handleItemUpdatedText(p) {
    const el = document.querySelector(`.text-box[data-text-id="${p.itemId}"]`);
    if (!el) return;
    el.style.left = p.posX + 'px';
    el.style.top  = p.posY + 'px';
    if (p.meta?.width)  el.style.width  = p.meta.width  + 'px';
    if (p.meta?.height) el.style.height = p.meta.height + 'px';
}