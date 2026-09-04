// Format ikonları çizgi çizgi çizilir; "Yakında" etiketi tek nabız atar.
import { gsap } from '../gsap.js';

export const formats = {
    name: 'formats',
    sel: '.formats',
    init(wrap) {
        const shapes = [...wrap.querySelectorAll('svg.draw *')].filter((el) => /^(path|rect|circle|line|polyline|polygon)$/i.test(el.tagName));
        const soon = wrap.querySelector('.chip--soon');
        if (!shapes.length && !soon) return;
        gsap.set(shapes, { drawSVG: '0%' });
        const tl = gsap.timeline({ scrollTrigger: { trigger: wrap, start: 'top 80%', once: true } });
        if (shapes.length) tl.to(shapes, { drawSVG: '0% 100%', duration: 0.9, stagger: 0.08, ease: 'power2.inOut' });
        if (soon) tl.fromTo(soon, { scale: 1 }, { scale: 1.1, duration: 0.35, yoyo: true, repeat: 1, ease: 'sine.inOut', transformOrigin: '50% 50%' }, '-=0.3');
    },
};
