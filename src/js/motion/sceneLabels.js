// "Perde I · Programlar" etiketleri: numara → pirinç çizgi çizilir → başlık.
import { gsap } from '../gsap.js';

export const sceneLabels = {
    name: 'sceneLabels',
    sel: '.scene-label',
    init() {
        const labels = [...document.querySelectorAll('.scene-label')];
        labels.forEach((l) => {
            gsap.set(l.querySelector('.scene-label__rule'), { scaleX: 0 });
            gsap.set([l.querySelector('.scene-label__num'), l.querySelector('.scene-label__title')], { opacity: 0, x: -8 });
        });
        const io = new IntersectionObserver((entries) => entries.forEach((en) => {
            if (!en.isIntersecting) return;
            io.unobserve(en.target);
            const l = en.target;
            gsap.timeline()
                .to(l.querySelector('.scene-label__num'), { opacity: 1, x: 0, duration: 0.5 })
                .to(l.querySelector('.scene-label__rule'), { scaleX: 1, duration: 0.7, ease: 'power3.inOut' }, 0.1)
                .to(l.querySelector('.scene-label__title'), { opacity: 1, x: 0, duration: 0.5 }, 0.5);
        }), { threshold: 0.3 });
        labels.forEach((l) => io.observe(l));
        return () => io.disconnect();
    },
};
