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

// グローバルに公開
window.openCreateModal  = openCreateModal;
window.closeCreateModal = closeCreateModal;
window.submitCreate     = submitCreate;
window.deleteWhiteboard = deleteWhiteboard;