// Belge: çerçeve altın iplikle çizilir, rozet mum mühür gibi bastırılır (mürekkep yayılır), altın parıltı süpürür.
import { gsap } from '../gsap.js';
import { SCRUB } from '../config.js';
import { sfx } from '../sfx.js';

export const certificate = {
    name: 'certificate',
    sel: '#egitmen',
    init(sec) {
        const cert = sec.querySelector('.cert');
        const rect = sec.querySelector('.cert__rect');
        const rosette = sec.querySelector('.cert .rosette');
        const thumb = sec.querySelector('.cert__thumb');
        const portraitMedia = sec.querySelector('.tutor__portrait .media');
        if (rect) gsap.set(rect, { drawSVG: '0%' });
        if (rosette) gsap.set(rosette, { scale: 1.7, opacity: 0, rotation: -20, transformOrigin: '50% 50%' });
        if (cert) {
            const tl = gsap.timeline({ scrollTrigger: { id: 'cert', trigger: cert, start: 'top 82%', once: true } });
            if (rect) tl.to(rect, { drawSVG: '0% 100%', duration: 1.4, ease: 'power2.inOut' }, 0);
            if (rosette) {
                tl.to(rosette, { scale: 1, opacity: 1, rotation: 0, duration: 0.42, ease: 'power4.in', onStart: () => sfx('seal') }, 0.7);
                if (thumb) tl.fromTo(thumb, { '--bloom': 0.9 }, { '--bloom': 0, duration: 1.1, ease: 'power2.out' }, 1.12);
            }
            tl.fromTo(cert, { '--shine': '-140%' }, { '--shine': '420%', duration: 1.3, ease: 'power2.inOut' }, 1.2);
        }
        if (portraitMedia) {
            gsap.fromTo(portraitMedia, { scale: 1.08 }, {
                scale: 1, ease: 'none', transformOrigin: '50% 50%',
                scrollTrigger: { id: 'portrait-scale', trigger: portraitMedia, start: 'top 90%', end: 'bottom 35%', scrub: SCRUB },
            });
        }
    },
};
