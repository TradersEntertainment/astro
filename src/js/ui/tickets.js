// Bilet kartları: açılır panel (CSS grid-rows), aria durumu, hareket katmanına olay.
export function initTickets() {
    document.querySelectorAll('[data-ticket]').forEach((ticket) => {
        const btn = ticket.querySelector('.ticket__toggle');
        const panel = btn && document.getElementById(btn.getAttribute('aria-controls'));
        if (!btn || !panel) return;
        const setOpen = (open) => {
            ticket.classList.toggle('is-open', open);
            btn.setAttribute('aria-expanded', String(open));
            btn.textContent = open ? 'Gizle' : 'Detaylar';
            document.dispatchEvent(new CustomEvent('ticket:toggle', { detail: { ticket, open } }));
            panel.addEventListener('transitionend', () => document.dispatchEvent(new Event('layout:change')), { once: true });
        };
        btn.addEventListener('click', () => setOpen(!ticket.classList.contains('is-open')));
    });
}
