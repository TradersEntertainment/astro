// Komedi ↔ trajedi maskesi: çizilir (DrawSVG), kaydırmayla trajediye dönüşür (MorphSVG, tembel),
// jant ışığı çevresinde gezer, okuma ışığı Özlem'in katharsis paragrafını kelime kelime aydınlatır,
// figür 3D döner, koni okunan paragrafa bakar, sahne notları raptiyeli kartlar gibi salınarak gelir, kıvılcımlar süzülür.
import { gsap, SplitText } from '../gsap.js';
import { SCRUB } from '../config.js';
import { createParticles } from './particles.js';

export const masks = {
    name: 'masks',
    sel: '.method',
    init(method, c, ctx) {
        const svg = method.querySelector('#mask-svg');
        if (!svg) return;
        const figure = method.querySelector('.method__figure');
        const allPaths = [...svg.querySelectorAll('#mask path')];
        const rim = svg.querySelector('.mask-rim');
        const paths = allPaths.filter((p) => p !== rim);
        const ribbons = [...svg.querySelectorAll('.mask-ribbon')];
        const cone = svg.querySelector('.mask-cone');
        const group = svg.querySelector('#mask');
        const anchor = method.querySelector('[data-morph-anchor]');
        const text = method.querySelector('.method__text');
        const points = [...method.querySelectorAll('.method__point')];
        const sparksCanvas = method.querySelector('.sparks');

        gsap.set(paths, { drawSVG: '0%', fillOpacity: 0 });
        if (rim) gsap.set(rim, { drawSVG: '0% 8%', opacity: 0 });
        gsap.set(ribbons, { drawSVG: '0%' });
        if (cone) gsap.set(cone, { opacity: 0, scaleY: 0.3, transformOrigin: '50% 0%' });

        // 3D dönüş (scrub) — masaüstü ±12°, mobil ±6°
        if (figure) {
            gsap.fromTo(figure, { rotationY: c.desktop ? -14 : -6, transformPerspective: 900 }, {
                rotationY: c.desktop ? 10 : 6, ease: 'none',
                scrollTrigger: { id: 'mask-3d', trigger: method, start: 'top 80%', end: 'bottom 20%', scrub: SCRUB },
            });
        }
        // Koni okunan paragrafa döner (yalnız sticky düzen: masaüstü)
        if (cone && text && c.desktop) {
            gsap.fromTo(cone, { rotation: -9 }, { rotation: 9, ease: 'none', scrollTrigger: { id: 'mask-cone', trigger: text, start: 'top 70%', end: 'bottom 60%', scrub: SCRUB } });
        }
        // Sahne notları: raptiyeden salınarak gelir
        if (points.length) {
            gsap.from(points, {
                rotation: -8, y: 34, opacity: 0, transformOrigin: '14px 0px', duration: 1.3, ease: 'elastic.out(1, 0.45)', stagger: 0.12,
                scrollTrigger: { id: 'mask-notes', trigger: points[0].parentElement, start: 'top 85%', once: true },
                clearProps: 'transform',
            });
        }
        // Kıvılcımlar
        let sparks = null;
        if (sparksCanvas && figure && !navigator.connection?.saveData) {
            sparks = createParticles(sparksCanvas, figure, {
                count: c.desktop ? 30 : 12, fps: c.desktop ? 0 : 30, color: '255,200,120', size: [0.8, 2.4], vy: [-0.45, -0.15], vx: 0.25, sway: 0.25, fade: true,
                region: (w, h) => ({ x: w * 0.2, y: h * 0.1, w: w * 0.6, h: h * 0.75 }),
            });
            sparks?.start();
        }

        let killed = false;
        let split = null;
        const build = (hasMorph) => {
            if (killed) return;
            ctx.add(() => {
                const draw = gsap.timeline({ scrollTrigger: { id: 'mask-draw', trigger: method, start: 'top 75%', end: 'top 20%', scrub: SCRUB } });
                if (cone) draw.to(cone, { opacity: 0.6, scaleY: 1, duration: 1, ease: 'none' }, 0);
                draw.to(paths, { drawSVG: '0% 100%', duration: 1, stagger: 0.08, ease: 'none' }, 0.1)
                    .to(paths, { fillOpacity: 1, duration: 0.6, ease: 'none' }, 0.7)
                    .to(ribbons, { drawSVG: '0% 100%', duration: 0.8, stagger: 0.1, ease: 'none' }, 0.5);
                if (rim) draw.to(rim, { opacity: 1, duration: 0.3, ease: 'none' }, 1.2);

                if (anchor) {
                    const morph = gsap.timeline({ scrollTrigger: { id: 'mask-morph', trigger: anchor, start: 'top 85%', end: 'bottom 40%', scrub: SCRUB } });
                    // okuma ışığı: kelimeler .3 → 1
                    let words = null;
                    try { split = SplitText.create(anchor, { type: 'words', wordsClass: 'w', aria: 'auto' }); words = split.words; } catch { /* yok */ }
                    if (words?.length) morph.fromTo(words, { opacity: 0.3 }, { opacity: 1, duration: 1, stagger: 0.02, ease: 'none' }, 0);
                    const D = Math.max(1, morph.duration());
                    if (hasMorph) {
                        allPaths.forEach((p) => { const t = p.dataset.t; if (t) morph.to(p, { morphSVG: { shape: t }, duration: D * 0.6, ease: 'power1.inOut' }, 0); });
                    }
                    if (rim) morph.fromTo(rim, { drawSVG: '0% 8%' }, { drawSVG: '92% 100%', duration: D, ease: 'none' }, 0);
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
        return () => { killed = true; io.disconnect(); sparks?.destroy(); if (split) { split.revert(); split = null; } };
    },
};
