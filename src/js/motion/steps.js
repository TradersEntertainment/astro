// Adımlar: kesik bağlantı çizgisi kaydırmayla çizilir, numaralar damga gibi vurulur.
import { gsap } from '../gsap.js';
import { SCRUB } from '../config.js';
import { sfx } from '../sfx.js';

export const steps = {
    name: 'steps',
    sel: '.steps',
    init(wrap, c) {
        const nums = [...wrap.querySelectorAll('.step__num')];
        if (c.desktop) {
            gsap.fromTo(wrap, { '--line': 0 }, { '--line': 1, ease: 'none', scrollTrigger: { id: 'steps-line', trigger: wrap, start: 'top 85%', end: 'top 40%', scrub: SCRUB } });
        }
        if (nums.length) {
            gsap.from(nums, {
                scale: 2.2, opacity: 0, duration: 0.4, ease: 'power4.in', stagger: 0.18, transformOrigin: '50% 50%',
                scrollTrigger: { id: 'steps-nums', trigger: wrap, start: 'top 80%', once: true },
                onStart: () => sfx('stamp', { soft: true }),
            });
        }
        return () => wrap.style.removeProperty('--line');
    },
};
