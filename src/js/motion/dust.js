// Sahne tozu: canvas parçacıkları, spot içinde parlar. Yalnız hero görünürken + sekme aktifken çalışır.
import { gsap } from '../gsap.js';
import { state } from '../state.js';

export const dust = {
    name: 'dust',
    sel: '.hero .dust',
    needs: () => !navigator.connection?.saveData,
    init(canvas, c) {
        const hero = canvas.closest('.hero');
        const g = canvas.getContext('2d');
        if (!hero || !g) return;
        const N = c.desktop ? 140 : 40;
        const dpr = Math.min(1.5, window.devicePixelRatio || 1);
        const frameMin = c.desktop ? 0 : 1000 / 30;
        let w = 0, h = 0, parts = [], raf = 0, running = false, visible = true, last = 0;

        const spawn = (anywhere) => ({
            x: Math.random() * w,
            y: anywhere ? Math.random() * h : h + 8,
            r: 0.6 + Math.random() * 1.6,
            vy: -(0.08 + Math.random() * 0.22),
            vx: (Math.random() - 0.5) * 0.12,
            ph: Math.random() * Math.PI * 2,
            a: 0.25 + Math.random() * 0.5,
        });
        const resize = () => {
            w = hero.clientWidth; h = hero.clientHeight;
            canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
            g.setTransform(dpr, 0, 0, dpr, 0, 0);
            parts = Array.from({ length: N }, () => spawn(true));
        };
        const step = (t) => {
            raf = 0;
            if (!running) return;
            if (t - last < frameMin) { raf = requestAnimationFrame(step); return; }
            last = t;
            g.clearRect(0, 0, w, h);
            const sx = w / 2 + state.spot.x, sy = h * 0.46 + state.spot.y, R = Math.min(w, h) * 0.32;
            for (const p of parts) {
                p.ph += 0.01;
                p.x += p.vx + Math.sin(p.ph) * 0.15;
                p.y += p.vy;
                if (p.y < -10 || p.x < -10 || p.x > w + 10) Object.assign(p, spawn(false));
                const lit = Math.max(0, 1 - Math.hypot(p.x - sx, p.y - sy) / R);
                g.beginPath();
                g.arc(p.x, p.y, p.r * (0.8 + 0.5 * lit), 0, Math.PI * 2);
                g.fillStyle = `rgba(255,230,180,${(p.a * (0.25 + 0.75 * lit)).toFixed(3)})`;
                g.fill();
            }
            raf = requestAnimationFrame(step);
        };
        const start = () => {
            if (running || !visible || document.hidden || !state.openingDone) return;
            running = true; last = 0;
            gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 1.6, overwrite: 'auto' });
            raf = requestAnimationFrame(step);
        };
        const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };
        const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); }, { threshold: 0.02 });
        const onVis = () => (document.hidden ? stop() : start());
        const ro = new ResizeObserver(resize);
        io.observe(hero);
        ro.observe(hero);
        document.addEventListener('visibilitychange', onVis);
        document.addEventListener('opening:done', start);
        resize();
        start();
        return () => {
            stop(); io.disconnect(); ro.disconnect();
            document.removeEventListener('visibilitychange', onVis);
            document.removeEventListener('opening:done', start);
            g.clearRect(0, 0, w, h);
        };
    },
};
