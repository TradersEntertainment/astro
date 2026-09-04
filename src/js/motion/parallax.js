// Hero'dan çıkış: kaydırmayla içerik yukarı kayıp söner, perde bacakları biraz daha açılır, zemin aşağı iner.
import { gsap } from '../gsap.js';

export const heroScroll = {
    name: 'heroScroll',
    sel: '.hero',
    init(hero) {
        const inner = hero.querySelector('.hero__inner');
        const legs = hero.querySelectorAll('.curtain__leg');
        const stage = hero.querySelector('.stage-bg');
        const valance = hero.querySelector('.curtain__valance');
        const frameTop = hero.querySelector('.frame__top');
        const foots = hero.querySelector('.foots');
        const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 },
        });
        if (inner) tl.to(inner, { y: -90, opacity: 0 }, 0);
        if (legs.length) tl.to(legs, { x: (i) => (i ? 70 : -70) }, 0);
        if (stage) tl.to(stage, { yPercent: 14 }, 0);
        if (valance) tl.to(valance, { yPercent: -45 }, 0);
        if (frameTop) tl.to(frameTop, { yPercent: -35 }, 0);
        if (foots) tl.to(foots, { opacity: 0 }, 0.4);
    },
};
