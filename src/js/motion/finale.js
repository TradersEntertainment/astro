// Final: sayfa sonunda perde bacakları kenarlardan içeri süzülür, orta açık kalır (kaydırma ile).
import { gsap } from '../gsap.js';

export const finale = {
    name: 'finale',
    sel: '.finale',
    init(sec, c) {
        const l = sec.querySelector('.curtain__leg--l');
        const r = sec.querySelector('.curtain__leg--r');
        if (!l || !r) return;
        const closeTo = c.desktop ? 58 : 82;
        gsap.set(l, { xPercent: -100, x: 0 });
        gsap.set(r, { xPercent: 100, x: 0 });
        gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 85%', end: 'bottom bottom', scrub: 0.6 } })
            .to(l, { xPercent: -closeTo, ease: 'none' }, 0)
            .to(r, { xPercent: closeTo, ease: 'none' }, 0);
    },
};
