const CSRF = document.querySelector('meta[name="csrf-token"]').content;

// チェックUIの更新
function updateCheckUI(label) {
    const cb      = label.querySelector('input[type="checkbox"]');
    const icon    = label.querySelector('.check-icon');
    const checked = cb.checked;

    if (checked) {
        icon.style.background  = '#374151';
        icon.style.borderColor = '#374151';
        icon.innerHTML         = '<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><polyline points="1,3.5 3.5,6 8,1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        label.style.background = 'var(--color-background-secondary)';
    } else {
        icon.style.background  = 'transparent';
        icon.style.borderColor = 'var(--color-border-secondary)';
        icon.innerHTML         = '';
        label.style.background = 'transparent';
    }
}

// ユーザーリスト初期化（検索・ソート・カウント）
function initUserSearch(searchId, listId, countId) {
    const search = document.getElementById(searchId);
    const list   = document.getElementById(listId);
    const count  = document.getElementById(countId);

    // 初期チェックUI反映
    list.querySelectorAll('.user-item').forEach(label => updateCheckUI(label));

    function updateCount() {
        const n = list.querySelectorAll('input[type="checkbox"]:checked').length;
        count.textContent = n + '人';
    }

    function sortAndFilter() {
        const q     = search.value.trim().toLowerCase();
        const items = [...list.querySelectorAll('.user-item')];

        // 絞り込み
        items.forEach(item => {
            item.style.display = item.dataset.name.toLowerCase().includes(q) ? '' : 'none';
        });
    }

    // ラベルクリックでチェック切り替え
    list.querySelectorAll('.user-item').forEach(label => {
        label.addEventListener('click', e => {
            e.preventDefault();
            const cb = label.querySelector('input[type="checkbox"]');
            if (cb.disabled) return;
            cb.checked = !cb.checked;
            updateCheckUI(label);
            updateCount();
            sortAndFilter();
        });
    });

    search.addEventListener('input', sortAndFilter);
    updateCount();

    return {
        reset() {
            search.value = '';
            sortAndFilter();
            updateCount();
        },
        syncChecked(userNos, disabledNo = null) {
            list.querySelectorAll('.user-item').forEach(label => {
                const cb    = label.querySelector('input[type="checkbox"]');
                cb.checked  = userNos.includes(parseInt(cb.value));
                cb.disabled = disabledNo !== null && parseInt(cb.value) === disabledNo;
                updateCheckUI(label);
            });
            updateCount();
            sortAndFilter();
        }
    };
}

// モーダル管理
let createSearch        = null;
let editSearch          = null;
let editingWhiteboardId = null;

function openCreateModal() {
    document.getElementById('create-modal').style.display = 'flex';
    if (!createSearch) {
        createSearch = initUserSearch('create-user-search', 'create-user-list', 'create-selected-count');
    }
    createSearch.reset();
    document.getElementById('wb-title').focus();
}

function closeCreateModal() {
    document.getElementById('create-modal').style.display = 'none';
}

function submitCreate() {
    const title = document.getElementById('wb-title').value.trim();
    if (!title) return;

    const userNos = [...document.querySelectorAll('input[name="user_nos[]"]:checked')]
                    .map(el => el.value);

    fetch('/whiteboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({ title, user_nos: userNos }),
    })
    .then(r => r.json())
    .then(data => {
        location.href = '/board?whiteboard_id=' + data.whiteboard_id;
    });
}

function deleteWhiteboard(id) {
    if (!confirm('このホワイトボードを削除しますか？')) return;
    fetch('/whiteboard/' + id, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': CSRF },
    })
    .then(r => r.json())
    .then(() => location.reload());
}

function startEditTitle(el) {
    const id    = el.dataset.id;
    const title = el.textContent.trim();

    const input = document.createElement('input');
    input.type  = 'text';
    input.value = title;
    input.style.cssText = 'font-size:14px;font-weight:500;border:1px solid #d1d5db;border-radius:6px;padding:2px 6px;width:100%;';

    // inputのクリックがカードに伝播しないようにする
    input.addEventListener('click',     e => e.stopPropagation());
    input.addEventListener('mousedown', e => e.stopPropagation());

    el.replaceWith(input);
    input.focus();
    input.select();

    function save() {
        const newTitle = input.value.trim();

        // 50文字チェック
        if (newTitle.length > 50) {
            input.style.borderColor = '#ef4444';
            let errEl = input.parentNode.querySelector('.title-error');
            if (!errEl) {
                errEl = document.createElement('p');
                errEl.className = 'title-error';
                errEl.style.cssText = 'font-size:11px;color:#ef4444;margin:2px 0 0;';
                input.insertAdjacentElement('afterend', errEl);
            }
            errEl.textContent = `50文字以内で入力してください（現在${newTitle.length}文字）`;
            return;
        }

        // エラー表示をリセット
        input.style.borderColor = '#d1d5db';
        const errEl = input.parentNode.querySelector('.title-error');
        if (errEl) errEl.remove();

        if (!newTitle || newTitle === title) {
            input.replaceWith(el);
            return;
        }

        fetch('/whiteboard/' + id + '/title', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
            body: JSON.stringify({ title: newTitle }),
        })
        .then(r => r.json())
        .then(() => {
            el.textContent = newTitle;
            input.replaceWith(el);
        });
    }

    input.addEventListener('blur', save);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter')  { e.preventDefault(); input.blur(); }
        if (e.key === 'Escape') {
            const errEl = input.parentNode?.querySelector('.title-error');
            if (errEl) errEl.remove();
            input.replaceWith(el);
        }
    });

    // リアルタイムチェック
    input.addEventListener('input', () => {
        const len = input.value.trim().length;
        if (len > 50) {
            input.style.borderColor = '#ef4444';
            let errEl = input.parentNode.querySelector('.title-error');
            if (!errEl) {
                errEl = document.createElement('p');
                errEl.className = 'title-error';
                errEl.style.cssText = 'font-size:11px;color:#ef4444;margin:2px 0 0;';
                input.insertAdjacentElement('afterend', errEl);
            }
            errEl.textContent = `50文字以内で入力してください（現在${len}文字）`;
        } else {
            input.style.borderColor = '#d1d5db';
            const errEl = input.parentNode.querySelector('.title-error');
            if (errEl) errEl.remove();
        }
    });
}

function openEditUsers(whiteboardId, currentUserNos, createdBy) {
    editingWhiteboardId = whiteboardId;
    document.getElementById('edit-users-modal').style.display = 'flex';
    if (!editSearch) {
        editSearch = initUserSearch('edit-user-search', 'edit-user-list', 'edit-selected-count');
    }
    editSearch.syncChecked(currentUserNos, createdBy);
}

function closeEditUsers() {
    document.getElementById('edit-users-modal').style.display = 'none';
}

function submitEditUsers() {
    const userNos = [...document.querySelectorAll('input[name="edit_user_nos[]"]:checked')]
                    .map(el => parseInt(el.value));

    if (userNos.length === 0) return;

    fetch('/whiteboard/' + editingWhiteboardId + '/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
        body: JSON.stringify({ user_nos: userNos }),
    })
    .then(r => r.json())
    .then(() => {
        closeEditUsers();
        location.reload();
    });
}

// グローバルに公開
window.openCreateModal  = openCreateModal;
window.closeCreateModal = closeCreateModal;
window.submitCreate     = submitCreate;
window.deleteWhiteboard = deleteWhiteboard;
window.startEditTitle   = startEditTitle;
window.openEditUsers    = openEditUsers;
window.closeEditUsers   = closeEditUsers;
window.submitEditUsers  = submitEditUsers;