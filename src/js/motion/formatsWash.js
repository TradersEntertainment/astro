// Formatlar: kaydırmayla soldan sağa geçen spot yıkaması; ışık üstüne gelen kart yanar, "Yakında" nabız atar.
import { gsap } from '../gsap.js';
import { SCRUB } from '../config.js';

export const formatsWash = {
    name: 'formatsWash',
    sel: '.formats',
    init(wrap) {
        const cards = [...wrap.querySelectorAll('.format')];
        if (!cards.length) return;
        const state = { x: -60 };
        gsap.to(state, {
            x: 160, ease: 'none',
            scrollTrigger: { id: 'formats-wash', trigger: wrap, start: 'top 85%', end: 'bottom 35%', scrub: SCRUB },
            onUpdate: () => {
                wrap.style.setProperty('--wash-x', `${state.x.toFixed(1)}%`);
                const W = wrap.clientWidth, band = W * 0.34, cx = (state.x / 100) * band + band / 2;
                cards.forEach((card) => {
                    const r = card.offsetLeft + card.offsetWidth / 2;
                    card.classList.toggle('is-lit', Math.abs(r - cx) < band * 0.5);
                });
            },
        });
        return () => { wrap.style.removeProperty('--wash-x'); cards.forEach((c) => c.classList.remove('is-lit')); };
    },
};
