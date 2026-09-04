// [data-reveal] öğeleri görünüme girince .is-in (CSS geçişi). IntersectionObserver — ScrollTrigger maliyeti yok.
import { gsap } from '../gsap.js';

export const reveals = {
    name: 'reveals',
    init() {
        const els = [...document.querySelectorAll('[data-reveal]:not(.is-in)')];
        if (!els.length) return;
        let queue = [];
        let scheduled = false;
        const flush = () => {
            scheduled = false;
            queue.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
                 .forEach((el, i) => gsap.delayedCall(i * 0.07, () => el.classList.add('is-in')));
            queue = [];
        };
        const io = new IntersectionObserver((entries) => {
            for (const en of entries) {
                if (!en.isIntersecting) continue;
                io.unobserve(en.target);
                queue.push(en.target);
            }
            if (queue.length && !scheduled) { scheduled = true; requestAnimationFrame(flush); }
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    },
};
