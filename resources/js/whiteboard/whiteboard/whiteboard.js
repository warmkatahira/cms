const CSRF = document.querySelector('meta[name="csrf-token"]').content;

function openCreateModal() {
    document.getElementById('create-modal').style.display = 'flex';
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
        location.href = '/org_chart?whiteboard_id=' + data.whiteboard_id;
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

    // ← 追加：inputのクリックがカードに伝播しないようにする
    input.addEventListener('click',     e => e.stopPropagation());
    input.addEventListener('mousedown', e => e.stopPropagation());

    el.replaceWith(input);
    input.focus();
    input.select();

    function save() {
        const newTitle = input.value.trim();

        // ← 追加：50文字チェック
        if (newTitle.length > 50) {
            input.style.borderColor = '#ef4444';
            input.title = '50文字以内で入力してください';
            // エラーメッセージを表示
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

        fetch('/whiteboard/' + id, {
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

    // ← リアルタイムチェック
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

// 参加者編集モーダル
let editingWhiteboardId = null;

function openEditUsers(whiteboardId, currentUserNos, createdBy) {
    editingWhiteboardId = whiteboardId;

    document.querySelectorAll('input[name="edit_user_nos[]"]').forEach(cb => {
        cb.checked   = currentUserNos.includes(parseInt(cb.value));
        cb.disabled  = parseInt(cb.value) === createdBy; // 作成者は変更不可
    });

    document.getElementById('edit-users-modal').style.display = 'flex';
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