// Sahne tozu: hero'da spot içinde parlayan parçacıklar; açılış bitince başlar, hero görünmüyorken durur.
import { state } from '../state.js';
import { createParticles } from './particles.js';

export const dust = {
    name: 'dust',
    sel: '.hero .dust',
    needs: () => !navigator.connection?.saveData,
    init(canvas, c) {
        const hero = canvas.closest('.hero');
        if (!hero) return;
        const p = createParticles(canvas, hero, {
            count: c.desktop ? 140 : 40, fps: c.desktop ? 0 : 30, color: '255,230,180',
            light: (w, h) => ({ x: w / 2 + state.spot.x, y: h * 0.46 + state.spot.y, r: Math.min(w, h) * 0.32 }),
            gate: () => state.openingDone,
        });
        if (!p) return;
        const onDone = () => p.start();
        if (state.openingDone) p.start(); else document.addEventListener('opening:done', onDone, { once: true });
        return () => { document.removeEventListener('opening:done', onDone); p.destroy(); };
    },
};
