// Komedi ↔ trajedi maskesi: DrawSVG ile çizilir, kaydırmayla MorphSVG (tembel yüklenir) trajediye dönüşür.
import { gsap } from '../gsap.js';

export const masks = {
    name: 'masks',
    sel: '.method',
    init(method, c, ctx) {
        const svg = method.querySelector('#mask-svg');
        if (!svg) return;
        const paths = [...svg.querySelectorAll('#mask path')];
        const ribbons = [...svg.querySelectorAll('.mask-ribbon')];
        const cone = svg.querySelector('.mask-cone');
        const group = svg.querySelector('#mask');
        const anchor = method.querySelector('[data-morph-anchor]') || method;

        gsap.set(paths, { drawSVG: '0%', fillOpacity: 0 });
        gsap.set(ribbons, { drawSVG: '0%' });
        if (cone) gsap.set(cone, { opacity: 0, scaleY: 0.3, transformOrigin: '50% 0%' });

        let killed = false;
        const build = (hasMorph) => {
            if (killed) return;
            ctx.add(() => {
                const draw = gsap.timeline({ scrollTrigger: { trigger: method, start: 'top 75%', end: 'top 20%', scrub: 0.8 } });
                if (cone) draw.to(cone, { opacity: 0.6, scaleY: 1, duration: 1, ease: 'none' }, 0);
                draw.to(paths, { drawSVG: '0% 100%', duration: 1, stagger: 0.08, ease: 'none' }, 0.1)
                    .to(paths, { fillOpacity: 1, duration: 0.6, ease: 'none' }, 0.7)
                    .to(ribbons, { drawSVG: '0% 100%', duration: 0.8, stagger: 0.1, ease: 'none' }, 0.5);
                if (hasMorph) {
                    const morph = gsap.timeline({ scrollTrigger: { trigger: anchor, start: 'top 85%', end: 'top 30%', scrub: 0.8 } });
                    paths.forEach((p) => {
                        const target = p.dataset.t;
                        if (target) morph.to(p, { morphSVG: { shape: target }, duration: 1, ease: 'power1.inOut' }, 0);
                    });
                }
                if (group) gsap.to(group, { y: -6, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
            });
        };

        const io = new IntersectionObserver(([en]) => {
            if (!en.isIntersecting) return;
            io.disconnect();
            import('gsap/MorphSVGPlugin')
                .then(({ MorphSVGPlugin }) => { gsap.registerPlugin(MorphSVGPlugin); build(true); })
                .catch(() => build(false));
        }, { rootMargin: '900px 0px' });
        io.observe(method);
        return () => { killed = true; io.disconnect(); };
    },
};
