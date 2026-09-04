// Sahneye giriş: hero sabitlenir; kaydırdıkça kamera sahneye ilerler (zemin/arka plan büyür,
// proscenium ve perde dışarı açılır, rampa ışıkları batar), sonra sahne kenarının altından sonraki bölüm gelir.
import { gsap, ScrollTrigger } from '../gsap.js';
import { SCRUB } from '../config.js';

export const dolly = {
    name: 'dolly',
    sel: '.hero',
    init(hero, c) {
        const q = (s) => hero.querySelector(s);
        const qa = (s) => [...hero.querySelectorAll(s)];
        const inner = q('.hero__inner');
        const legs = qa('.curtain__leg');
        const layers = qa('.stage-bg > *');
        const valance = q('.curtain__valance');
        const frameTop = q('.frame__top');
        const sides = qa('.frame__side');
        const foots = q('.foots');
        const cone = q('.spot-cone');
        const wash = q('.foot-wash');

        const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
                id: 'dolly', trigger: hero, start: 'top top',
                end: c.desktop ? '+=110%' : '+=70%',
                pin: true, pinSpacing: true, anticipatePin: 1, scrub: SCRUB,
                onUpdate: (self) => hero.classList.toggle('is-scrolled', self.progress > 0.03),
            },
        });
        if (layers.length) tl.to(layers, { scale: 1.35, transformOrigin: '50% 70%' }, 0);
        if (legs.length) tl.to(legs, { x: (i) => (i ? 1 : -1) * hero.clientWidth * 0.12 }, 0);
        if (sides.length) tl.to(sides, { x: (i) => (i ? 1 : -1) * 64 }, 0);
        if (frameTop) tl.to(frameTop, { yPercent: -100 }, 0);
        if (valance) tl.to(valance, { yPercent: -110 }, 0);
        if (cone) tl.to(cone, { y: -140 }, 0);
        if (inner) tl.to(inner, { y: -140, opacity: 0, duration: 0.6 }, 0);
        if (foots) tl.to(foots, { y: 40, opacity: 0, duration: 0.5 }, 0.4);
        if (wash) tl.to(wash, { y: 60, duration: 0.6 }, 0.4);

        // Derin bağlantı: pin ara parçası eklendikten sonra hedefe git (tarayıcı parça yokken zıplamış olabilir)
        if (location.hash.length > 1) {
            const target = document.querySelector(location.hash);
            if (target && target !== hero) requestAnimationFrame(() => { ScrollTrigger.refresh(); target.scrollIntoView({ behavior: 'instant', block: 'start' }); });
        }
        return () => hero.classList.remove('is-scrolled');
    },
};
