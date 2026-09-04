export function initFaq() {
    document.querySelectorAll('.faq__q').forEach((btn) => {
        const answer = document.getElementById(btn.getAttribute('aria-controls'));
        if (!answer) return;
        btn.addEventListener('click', () => {
            const open = btn.getAttribute('aria-expanded') !== 'true';
            btn.setAttribute('aria-expanded', String(open));
            answer.classList.toggle('is-open', open);
            document.dispatchEvent(new CustomEvent('faq:toggle', { detail: { item: btn.closest('.faq__item'), answer, open } }));
            answer.addEventListener('transitionend', () => document.dispatchEvent(new Event('layout:change')), { once: true });
        });
    });
}
