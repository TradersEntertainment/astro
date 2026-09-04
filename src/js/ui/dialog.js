// Belge büyütme: yerel <dialog>; Esc ve arka plan tıklaması kapatır, odak açan düğmeye döner.
export function initDialogs() {
    let opener = null;
    document.querySelectorAll('[data-open-dialog]').forEach((btn) => {
        const dlg = document.getElementById(btn.dataset.openDialog);
        if (!dlg) return;
        btn.addEventListener('click', () => {
            if (typeof dlg.showModal !== 'function') {
                const img = dlg.querySelector('img');
                if (img) window.open(img.src, '_blank', 'noopener');
                return;
            }
            opener = btn;
            dlg.showModal();
        });
    });
    document.querySelectorAll('dialog').forEach((dlg) => {
        dlg.addEventListener('click', (e) => {
            if (e.target === dlg || e.target.closest('[data-close-dialog]')) dlg.close();
        });
        dlg.addEventListener('close', () => { opener?.focus(); opener = null; });
    });
}
