// Masaüstü + hassas işaretçi: spot havuzu imleci izler, koni hafif döner; 2.2 sn boşta başlığa döner.
import { gsap } from '../gsap.js';
import { state } from '../state.js';

export const spotlight = {
    name: 'spotlight',
    sel: '.hero',
    needs: (c) => c.desktop && c.fine,
    init(hero) {
        const pool = hero.querySelector('.spot-pool');
        const cone = hero.querySelector('.spot-cone');
        if (!pool) return;
        const toX = gsap.quickTo(pool, 'x', { duration: 0.7, ease: 'power3' });
        const toY = gsap.quickTo(pool, 'y', { duration: 0.7, ease: 'power3' });
        const toRot = cone ? gsap.quickTo(cone, 'rotation', { duration: 0.9, ease: 'power2' }) : null;
        let idle = 0;
        let inView = true;

        const home = () => {
            toX(0); toY(0); toRot?.(0);
            Object.assign(state.spot, { x: 0, y: 0, active: false });
        };
        const onMove = (e) => {
            if (!inView) return;
            const r = hero.getBoundingClientRect();
            const dx = gsap.utils.clamp(-r.width * 0.42, r.width * 0.42, e.clientX - (r.left + r.width / 2));
            const dy = gsap.utils.clamp(-r.height * 0.36, r.height * 0.36, e.clientY - (r.top + r.height * 0.46));
            toX(dx); toY(dy); toRot?.((dx / r.width) * 14);
            Object.assign(state.spot, { x: dx, y: dy, active: true });
            clearTimeout(idle);
            idle = setTimeout(home, 2200);
        };
        const onLeave = () => { clearTimeout(idle); idle = setTimeout(home, 600); };
        hero.addEventListener('pointermove', onMove, { passive: true });
        hero.addEventListener('pointerleave', onLeave);
        const io = new IntersectionObserver(([en]) => { inView = en.isIntersecting; if (!inView) home(); }, { threshold: 0.05 });
        io.observe(hero);
        return () => {
            hero.removeEventListener('pointermove', onMove);
            hero.removeEventListener('pointerleave', onLeave);
            clearTimeout(idle);
            io.disconnect();
            home();
        };
    },
};
