tippy('.tippy_base_aliases', {
    content(reference) {
        const aliases = reference.getAttribute('data-aliases');
        if (!aliases) return '荷主なし';
        return aliases.split(',').map((name, i) =>
            `<div style="${i > 0 ? 'border-top: 2px solid rgba(255,255,255,0.5); padding-top: 3px; margin-top: 3px;' : ''}">${name}</div>`
        ).join('');
    },
    duration: 500,
    maxWidth: 'none',
    allowHTML: true,
    placement: 'right',
    theme: 'tippy_main_theme',
});