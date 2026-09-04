// Koyu bölümlere girerken ince bordo perde süpürmesi (tek seferlik).
import { gsap } from '../gsap.js';
import { sfx } from '../sfx.js';

export const wipes = {
    name: 'wipes',
    init() {
        const sections = [...document.querySelectorAll('.scene.on-dark')];
        if (!sections.length) return;
        const els = sections.map((s, i) => {
            const w = document.createElement('div');
            w.className = 'wipe';
            w.setAttribute('aria-hidden', 'true');
            s.appendChild(w);
            gsap.set(w, { scaleX: 0, transformOrigin: '0% 50%' });
            gsap.timeline({ scrollTrigger: { id: `wipe-${s.id || i}`, trigger: s, start: 'top 70%', once: true }, onStart: () => sfx('whoosh') })
                .to(w, { scaleX: 1, duration: 0.45, ease: 'power3.in' })
                .set(w, { transformOrigin: '100% 50%' })
                .to(w, { scaleX: 0, duration: 0.55, ease: 'power3.out' });
            return w;
        });
        return () => els.forEach((w) => w.remove());
    },
};
