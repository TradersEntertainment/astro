// Finale yaklaşırken salon ışıkları kısılır: sabit koyu katman son ~1.5 ekran boyunca koyulaşır, finalde çekilir.
import { gsap } from '../gsap.js';
import { SCRUB } from '../config.js';
import { state } from '../state.js';

export const houseDim = {
    name: 'houseDim',
    sel: '.finale',
    init(finale) {
        const dim = document.createElement('div');
        dim.className = 'house-dim';
        dim.setAttribute('aria-hidden', 'true');
        document.body.appendChild(dim);
        gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { id: 'house-dim', trigger: finale, start: 'top 250%', end: 'top 10%', scrub: SCRUB, onUpdate: (self) => { state.finaleNear = self.progress; } },
        })
            .to(dim, { opacity: 0.5, duration: 0.7 }, 0)
            .to(dim, { opacity: 0, duration: 0.3 }, 0.7);
        return () => { dim.remove(); state.finaleNear = 0; };
    },
};
