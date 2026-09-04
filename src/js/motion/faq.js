// SSS: öğeler sırayla sağ/soldan kayar; cevap açılırken metin üstünden ışık iner.
import { gsap } from '../gsap.js';

export const faqMotion = {
    name: 'faq',
    sel: '.faq',
    init(wrap) {
        const items = [...wrap.querySelectorAll('.faq__item')];
        if (items.length) {
            gsap.from(items, {
                x: (i) => (i % 2 ? 48 : -48), opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
                scrollTrigger: { id: 'faq', trigger: wrap, start: 'top 85%', once: true }, clearProps: 'transform',
            });
        }
        const onToggle = (e) => {
            const { answer, open } = e.detail;
            if (!open || !wrap.contains(answer)) return;
            const box = answer.firstElementChild;
            if (box) gsap.fromTo(box, { '--sweep-y': '-120%' }, { '--sweep-y': '300%', duration: 0.9, ease: 'power2.inOut', delay: 0.1 });
        };
        document.addEventListener('faq:toggle', onToggle);
        return () => document.removeEventListener('faq:toggle', onToggle);
    },
};
