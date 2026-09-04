// Landing ekstraları: açılış bitince üstten "giriş bileti" iner; kaydırınca yırtılıp düşer. Güven kartları 3D döner.
import { gsap } from '../gsap.js';
import { SCRUB } from '../config.js';
import { state } from '../state.js';
import { sfx } from '../sfx.js';

export const landingFx = {
    name: 'landing',
    sel: '.landing',
    init(body) {
        const stub = body.querySelector('.entry-stub');
        const hero = body.querySelector('.hero');
        const trust = [...body.querySelectorAll('.trust__item')];
        const cleanups = [];
        if (stub && hero) {
            gsap.set(stub, { opacity: 0, y: -60, rotation: -6 });
            const show = () => gsap.to(stub, { opacity: 1, y: 0, rotation: -3, duration: 0.9, ease: 'elastic.out(1, 0.5)', onStart: () => sfx('stamp', { soft: true }) });
            if (state.openingDone) show(); else document.addEventListener('opening:done', show, { once: true });
            cleanups.push(() => document.removeEventListener('opening:done', show));
            gsap.timeline({ scrollTrigger: { id: 'entry-stub', trigger: hero, start: 'top top', end: '+=45%', scrub: SCRUB } })
                .to(stub, { rotation: 28, y: 320, x: 40, opacity: 0, ease: 'power2.in' });
        }
        if (trust.length) {
            gsap.from(trust, {
                rotationY: -70, opacity: 0, transformPerspective: 1000, transformOrigin: '0% 50%', duration: 1, ease: 'power3.out', stagger: 0.14,
                scrollTrigger: { id: 'trust', trigger: trust[0].parentElement, start: 'top 82%', once: true }, clearProps: 'transform',
            });
        }
        return () => cleanups.forEach((f) => f());
    },
};
