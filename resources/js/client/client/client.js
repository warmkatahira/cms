// 紐付け荷主数のツールチップ
tippy('.tippy_client_aliases', {
    content(reference) {
        const aliases = reference.getAttribute('data-client-aliases');
        if (!aliases) return '荷主なし';
        return aliases.split(',').map(name => `<div>${name}</div>`).join('');
    },
    duration: 500,
    maxWidth: 'none',
    allowHTML: true,
    placement: 'right',
    theme: 'tippy_main_theme',
});