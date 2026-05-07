// プロフィールのツールチップ
tippy('.tippy_profile', {
    content(reference) {
        const fullName = reference.getAttribute('data-full-name') + ' さん' || '';
        return fullName;
    },
    duration: 500,
    maxWidth: 'none',
    allowHTML: true,
    placement: 'right',
    theme: 'tippy_main_theme',
});