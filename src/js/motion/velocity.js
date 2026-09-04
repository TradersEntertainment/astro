// Kaydırma hızı omurgası: tek ScrollTrigger → state.velocity/dir; ticker'da sönümlü state.speed (0..1)
// ve html --speed özel özelliği (saf CSS tüketiciler: marka işareti, ışık çubuğu, lambalar).
import { gsap, ScrollTrigger } from '../gsap.js';
import { state } from '../state.js';

export const velocity = {
    name: 'velocity',
    init() {
        const targets = [document.getElementById('masthead'), document.querySelector('.hero')].filter(Boolean);
        let lastCssT = 0;
        let target = 0;
        let lastCss = -1;
        ScrollTrigger.create({
            id: 'velocity',
            start: 0, end: 'max',
            onUpdate: (self) => {
                const v = self.getVelocity();
                state.velocity = v;
                state.dir = v > 0 ? 1 : v < 0 ? -1 : state.dir;
                target = Math.min(1, Math.abs(v) / 3000);
            },
        });
        const tick = (t, dt) => {
            // hızlı yükselir, yavaş söner
            const k = target > state.speed ? 0.35 : Math.min(1, dt / 420);
            state.speed += (target - state.speed) * k;
            target *= 0.8;
            if (state.speed < 0.002) state.speed = 0;
            const css = Math.round(state.speed * 20) / 20;
            if (css !== lastCss && t - lastCssT > 45) { lastCss = css; lastCssT = t; targets.forEach((el) => el.style.setProperty('--speed', String(css))); }
        };
        gsap.ticker.add(tick);
        return () => { gsap.ticker.remove(tick); state.speed = 0; targets.forEach((el) => el.style.removeProperty('--speed')); };
    },
};
