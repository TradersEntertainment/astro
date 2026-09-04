// Biletler masaya dağıtılır (y + ±1.6° → 0); açılırken koçan "yırtılır".
import { gsap } from '../gsap.js';

export const ticketsMotion = {
    name: 'tickets',
    sel: '.tickets',
    init(wrap) {
        const tickets = [...wrap.querySelectorAll('.ticket')];
        if (tickets.length) {
            gsap.set(tickets, { y: 70, rotation: (i) => (i % 2 ? 1.6 : -1.6), opacity: 0, transformOrigin: '50% 100%' });
            gsap.to(tickets, {
                y: 0, rotation: 0, opacity: 1, duration: 1, stagger: 0.13, ease: 'power3.out',
                scrollTrigger: { trigger: wrap, start: 'top 78%', once: true },
                onComplete: () => gsap.set(tickets, { clearProps: 'transform' }),
            });
        }
        const onToggle = (e) => {
            const { ticket, open } = e.detail;
            if (!wrap.contains(ticket)) return;
            const stub = ticket.querySelector('.ticket__stub');
            if (stub) gsap.fromTo(stub, { rotation: open ? -3 : 2, x: open ? 6 : -4 }, { rotation: 0, x: 0, duration: 1, ease: 'elastic.out(1, 0.4)', clearProps: 'transform' });
        };
        document.addEventListener('ticket:toggle', onToggle);
        return () => document.removeEventListener('ticket:toggle', onToggle);
    },
};
