import { board, WHITEBOARD_ID, CSRF } from './constants.js';
import {
    initMagnet, addStaff,
    handleStaffAdded, handleStaffDeleted, handleStaffUpdated, handleItemUpdatedStaff,
} from './staff.js';
import {
    initZone, addZone,
    handleZoneAdded, handleZoneDeleted, handleItemUpdatedZone,
} from './zone.js';
import {
    createTextEl, initText, addText,
    handleTextAdded, handleTextDeleted, handleItemUpdatedText,
} from './text.js';
import {
    createShapeEl, createShapeSVG, initShape, addShape,
    handleShapeAdded, handleShapeDeleted, handleItemUpdatedShape,
} from './shape.js';
import {
    createImageEl, initImage, addImage,
    handleImageAdded, handleImageDeleted, handleItemUpdatedImage,
} from './image.js';

// グローバル公開
window.addStaff = addStaff;
window.addZone  = addZone;
window.addText  = addText;
window.addShape = addShape;
window.clearBoard = clearBoard;
window.addImage = addImage;

// 既存要素の初期化
document.querySelectorAll('.magnet').forEach(el => initMagnet(el));
document.querySelectorAll('.magnet-zone').forEach(el => initZone(el));
document.querySelectorAll('.text-box').forEach(el => initText(el));
document.querySelectorAll('.shape-box').forEach(el => initShape(el));
document.querySelectorAll('.image-box').forEach(el => initImage(el));

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
        !e.target.closest('.text-box') &&
        !e.target.closest('.shape-box') &&
        !e.target.closest('.image-box')
    ) {
        const editing = document.querySelector('.text-box-inner[contenteditable="true"]');
        if (editing) {
            editing.blur();
            return;
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

// ボード空白クリックでテキスト編集を解除
document.getElementById('board-canvas').addEventListener('mousedown', e => {
    if (e.target.closest('.text-box')) return;
    const editing = document.querySelector('.text-box-inner[contenteditable="true"]');
    if (editing) editing.blur();
});

// リアルタイム同期
window.Echo.channel('whiteboard.' + WHITEBOARD_ID)
    .listen('.board.updated', (e) => {
        switch (e.action) {
            case 'item.updated':
                if (e.payload.itemType === 'staff') handleItemUpdatedStaff(e.payload);
                if (e.payload.itemType === 'zone')  handleItemUpdatedZone(e.payload);
                if (e.payload.itemType === 'text')  handleItemUpdatedText(e.payload);
                if (e.payload.itemType === 'shape') handleItemUpdatedShape(e.payload);
                if (e.payload.itemType === 'image') handleItemUpdatedImage(e.payload);
                break;
            case 'staff.added':   handleStaffAdded(e.payload);   break;
            case 'staff.deleted': handleStaffDeleted(e.payload); break;
            case 'staff.updated': handleStaffUpdated(e.payload); break;
            case 'zone.added':    handleZoneAdded(e.payload);    break;
            case 'zone.deleted':  handleZoneDeleted(e.payload);  break;
            case 'text.added':    handleTextAdded(e.payload);    break;
            case 'text.deleted':  handleTextDeleted(e.payload);  break;
            case 'shape.added':   handleShapeAdded(e.payload);   break;
            case 'shape.deleted': handleShapeDeleted(e.payload); break;
            case 'image.added':   handleImageAdded(e.payload);   break;
            case 'image.deleted': handleImageDeleted(e.payload); break;
        }
    });

function clearBoard() {
    if (!confirm('ボード上の全ての要素を削除しますか？\nこの操作は元に戻せません。')) return;

    fetch('/board/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({ whiteboard_id: WHITEBOARD_ID }),
    })
    .then(r => r.json())
    .then(() => {
        document.querySelectorAll('.magnet').forEach(el => el.remove());
        document.querySelectorAll('.magnet-zone').forEach(el => el.remove());
        document.querySelectorAll('.text-box').forEach(el => el.remove());
        document.querySelectorAll('.shape-box').forEach(el => el.remove());
        document.querySelectorAll('.image-box').forEach(el => el.remove());
    });
}