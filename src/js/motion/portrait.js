// Eğitmen: portre kemerindeki mini perde girişte açılır; kulis fotoğrafı (varsa) hafif paralaks yapar.
import { gsap } from '../gsap.js';
import { SCRUB } from '../config.js';
import { sfx } from '../sfx.js';

export const portrait = {
    name: 'portrait',
    sel: '#egitmen',
    init(sec) {
        const legs = [...sec.querySelectorAll('.mini-curtain__leg')];
        const media = sec.querySelector('.tutor__portrait .media');
        const back = sec.querySelector('.media--backstage');
        if (legs.length && media) {
            gsap.set(legs, { xPercent: 0 });
            gsap.timeline({ scrollTrigger: { id: 'mini-curtain', trigger: media, start: 'top 72%', once: true }, onStart: () => sfx('curtain', { small: true }) })
                .to(legs, { xPercent: (i) => (i ? 104 : -104), duration: 1.5, ease: 'power3.inOut' }, 0.15);
        }
        if (back) {
            gsap.fromTo(back, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { id: 'backstage', trigger: sec, start: 'top bottom', end: 'bottom top', scrub: SCRUB } });
        }
    },
};
