// Program notu şeridi: öğeler perde rayı gibi yanlardan gelir, ayraçlar çizilir, MEB rozeti dönerek mühürlenir.
import { gsap } from '../gsap.js';
import { sfx } from '../sfx.js';

export const notu = {
    name: 'notu',
    sel: '.notu',
    init(strip) {
        const items = [...strip.querySelectorAll('.notu__item')];
        const seps = [...strip.querySelectorAll('.notu__sep')];
        const ros = strip.querySelector('.rosette');
        if (!items.length) return;
        const last = items.length - 1;
        gsap.set(items, { opacity: 0, x: (i) => (i === 0 ? -40 : i === last ? 40 : 0), y: (i) => (i === 0 || i === last ? 0 : 16) });
        gsap.set(seps, { scaleY: 0, transformOrigin: '50% 50%' });
        if (ros) gsap.set(ros, { rotation: -150, scale: 0, transformOrigin: '50% 50%' });
        const tl = gsap.timeline({ scrollTrigger: { id: 'notu', trigger: strip, start: 'top 92%', once: true } });
        tl.to(items, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 });
        if (seps.length) tl.to(seps, { scaleY: 1, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, 0.3);
        if (ros) tl.to(ros, { rotation: 0, scale: 1, duration: 0.8, ease: 'back.out(1.8)', onStart: () => sfx('seal') }, 0.5);
    },
};
