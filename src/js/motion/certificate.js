// Eğitmen: portre yumuşak yaklaşır; belge çerçevesi çizilir, rozet yerine oturur.
import { gsap } from '../gsap.js';

export const certificate = {
    name: 'certificate',
    sel: '#egitmen',
    init(sec) {
        const cert = sec.querySelector('.cert');
        const rect = sec.querySelector('.cert__rect');
        const rosette = sec.querySelector('.cert .rosette');
        const portrait = sec.querySelector('.tutor__portrait .media');
        if (rect) gsap.set(rect, { drawSVG: '0%' });
        if (rosette) gsap.set(rosette, { scale: 0, rotation: -30, transformOrigin: '50% 50%' });
        if (cert) {
            const tl = gsap.timeline({ scrollTrigger: { trigger: cert, start: 'top 82%', once: true } });
            if (rect) tl.to(rect, { drawSVG: '0% 100%', duration: 1.4, ease: 'power2.inOut' }, 0);
            if (rosette) tl.to(rosette, { scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.6)' }, 0.6);
        }
        if (portrait) {
            gsap.fromTo(portrait, { scale: 1.08 }, {
                scale: 1, ease: 'none', transformOrigin: '50% 50%',
                scrollTrigger: { trigger: portrait, start: 'top 90%', end: 'bottom 35%', scrub: true },
            });
        }
    },
};
