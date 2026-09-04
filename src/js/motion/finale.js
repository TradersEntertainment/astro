// Perde çağrısı: bacaklar kenardan gelir (CTA görünür), sonra içerik solar ve perde tamamen kapanır,
// kapalı perdeye amblem altın iplikle işlenir, marka adı belirir. Masaüstünde sahne sabitlenir.
import { gsap } from '../gsap.js';
import { SCRUB } from '../config.js';
import { sfx } from '../sfx.js';

export const finale = {
    name: 'finale',
    sel: '.finale',
    init(sec, c) {
        const l = sec.querySelector('.curtain__leg--l');
        const r = sec.querySelector('.curtain__leg--r');
        if (!l || !r) return;
        const inner = sec.querySelector('.finale__inner');
        const call = sec.querySelector('.finale__call');
        const emblem = call ? [...call.querySelectorAll('.em')] : [];
        const brand = call ? call.querySelector('.finale__brand') : null;
        const brandName = call ? call.querySelector('.finale__brand-name') : null;
        const midTo = c.desktop ? 58 : 82;

        gsap.set(l, { xPercent: -100, x: 0 });
        gsap.set(r, { xPercent: 100, x: 0 });
        if (call) gsap.set(call, { autoAlpha: 0, z: 0.01 });
        if (emblem.length) gsap.set(emblem, { drawSVG: '0%' });
        if (brand) gsap.set(brand, { opacity: 0, y: 14 });
        if (brandName) gsap.set(brandName, { letterSpacing: '0.4em' });

        const wrap = sec.closest('.finale-wrap');
        const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: c.desktop && wrap
                ? { id: 'finale', trigger: wrap, start: 'top top', end: 'bottom bottom', scrub: SCRUB }
                : { id: 'finale', trigger: sec, start: 'top 85%', end: 'bottom bottom', scrub: SCRUB },
        });
        let chased = false;
        let closed = false;
        // 0–.35: bacaklar orta açıklığa gelir (CTA görünür)
        tl.to(l, { xPercent: -midTo, duration: 0.35 }, 0)
          .to(r, { xPercent: midTo, duration: 0.35 }, 0)
          .call(() => { if (!chased) { chased = true; document.dispatchEvent(new Event('marquee:chase')); } }, null, 0.05)
          // .35–.7: içerik solar, perde tamamen kapanır
          .call(() => { if (!closed) { closed = true; sfx('curtain'); } }, null, 0.36);
        if (inner) tl.to(inner, { autoAlpha: 0, duration: 0.2 }, 0.36);
        tl.to(l, { xPercent: 0, duration: 0.34, ease: 'power1.inOut' }, 0.36)
          .to(r, { xPercent: 0, duration: 0.34, ease: 'power1.inOut' }, 0.36);
        // .7–1: amblem işlenir, marka adı belirir
        if (call) tl.set(call, { autoAlpha: 1 }, 0.69);
        if (emblem.length) tl.to(emblem, { drawSVG: '0% 100%', duration: 0.24, stagger: 0.01 }, 0.7);
        if (brand) tl.to(brand, { opacity: 1, y: 0, duration: 0.14 }, 0.84);
        if (brandName) tl.to(brandName, { letterSpacing: '0.06em', duration: 0.16 }, 0.84);
    },
};
