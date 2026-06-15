export const board         = document.getElementById('board');
export const tray          = document.getElementById('tray');
export const WHITEBOARD_ID = parseInt(board.dataset.whiteboardId);
export const CANVAS_W      = parseInt(board.dataset.canvasW);
export const CANVAS_H      = parseInt(board.dataset.canvasH);
export const CSRF          = document.querySelector('meta[name="csrf-token"]').content;

export const COLORS = [
    { bg:'#E6F1FB', border:'#378ADD', text:'#0C447C' }, // 青
    { bg:'#EAF3DE', border:'#639922', text:'#27500A' }, // 緑
    { bg:'#FAEEDA', border:'#BA7517', text:'#633806' }, // オレンジ
    { bg:'#FBEAF0', border:'#D4537E', text:'#72243E' }, // ピンク
    { bg:'#E1F5EE', border:'#1D9E75', text:'#085041' }, // エメラルド
    { bg:'#EEEDFE', border:'#7F77DD', text:'#3C3489' }, // 紫
    { bg:'#FAECE7', border:'#D85A30', text:'#711B13' }, // 赤オレンジ
    { bg:'#FEF9E7', border:'#D4AC0D', text:'#7D6608' }, // 黄
    { bg:'#F2F3F4', border:'#717D7E', text:'#2C3E50' }, // グレー
    { bg:'#FDEDEC', border:'#C0392B', text:'#7B241C' }, // 赤
];

export const ZONE_COLORS = [
    { border:'#378ADD', bg:'rgba(56,138,221,0.06)',  text:'#0C447C' }, // 青
    { border:'#639922', bg:'rgba(99,153,34,0.06)',   text:'#27500A' }, // 緑
    { border:'#D4537E', bg:'rgba(212,83,126,0.06)',  text:'#72243E' }, // ピンク
    { border:'#BA7517', bg:'rgba(186,117,23,0.06)',  text:'#633806' }, // オレンジ
    { border:'#7F77DD', bg:'rgba(127,119,221,0.06)', text:'#3C3489' }, // 紫
    { border:'#1D9E75', bg:'rgba(29,158,117,0.06)',  text:'#085041' }, // エメラルド
    { border:'#D85A30', bg:'rgba(216,90,48,0.06)',   text:'#711B13' }, // 赤オレンジ
    { border:'#D4AC0D', bg:'rgba(212,172,13,0.06)',  text:'#7D6608' }, // 黄
    { border:'#717D7E', bg:'rgba(113,125,126,0.06)', text:'#2C3E50' }, // グレー
    { border:'#C0392B', bg:'rgba(192,57,43,0.06)',   text:'#7B241C' }, // 赤
];

export const PALETTE = [
    '#374151', '#ffffff', '#dc2626', '#ea580c', '#ca8a04',
    '#16a34a', '#2563eb', '#7c3aed', '#ec4899',
    '#000000', '#6b7280', '#b91c1c', '#92400e', '#854d0e',
    '#065f46', '#1e40af', '#5b21b6', '#9d174d', '#0891b2',
    '#fca5a5', '#fdba74', '#fde047', '#86efac', '#93c5fd',
    '#c4b5fd', '#f9a8d4', '#67e8f9', '#9ca3af', '#e5e7eb',
];

export let copyOffset = 0;
export let lastCopyEl = null;

export function setCopyOffset(val) { copyOffset = val; }
export function setLastCopyEl(val) { lastCopyEl = val; }

export function rgbToHex(color) {
    if (!color || color === 'white') return '#ffffff';
    if (color.startsWith('#')) return color;
    const m = color.match(/\d+/g);
    if (!m || m.length < 3) return '#ffffff';
    return '#' + m.slice(0, 3).map(v => parseInt(v).toString(16).padStart(2, '0')).join('');
}