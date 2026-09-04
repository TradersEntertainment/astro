// Genel parçacık motoru: toz (hero) ve kıvılcım (maske) aynı çekirdeği kullanır.
// opts: { count, color:'r,g,b', size:[min,max], vy:[min,max], vx, sway, spawn:'anywhere'|'bottom', light?:()=>({x,y,r}) , fps }
import { gsap } from '../gsap.js';

export function createParticles(canvas, host, opts) {
    const g = canvas.getContext('2d');
    if (!g) return null;
    const o = { count: 40, color: '255,230,180', size: [0.6, 2.2], vy: [-0.3, -0.08], vx: 0.12, sway: 0.15, spawn: 'anywhere', fps: 0, region: null, ...opts };
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const frameMin = o.fps ? 1000 / o.fps : 0;
    let w = 0, h = 0, parts = [], raf = 0, running = false, visible = true, last = 0;

    const spawn = (anywhere) => {
        const reg = o.region ? o.region(w, h) : { x: 0, y: 0, w, h };
        return {
            x: reg.x + Math.random() * reg.w,
            y: anywhere ? reg.y + Math.random() * reg.h : reg.y + reg.h + 6,
            r: o.size[0] + Math.random() * (o.size[1] - o.size[0]),
            vy: o.vy[0] + Math.random() * (o.vy[1] - o.vy[0]),
            vx: (Math.random() - 0.5) * o.vx,
            ph: Math.random() * Math.PI * 2,
            a: 0.25 + Math.random() * 0.5,
            life: 1,
        };
    };
    const resize = () => {
        w = host.clientWidth; h = host.clientHeight;
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        parts = Array.from({ length: o.count }, () => spawn(true));
    };
    const step = (t) => {
        raf = 0;
        if (!running) return;
        if (t - last < frameMin) { raf = requestAnimationFrame(step); return; }
        last = t;
        g.clearRect(0, 0, w, h);
        const L = o.light ? o.light(w, h) : null;
        const reg = o.region ? o.region(w, h) : { x: 0, y: 0, w, h };
        for (const p of parts) {
            p.ph += 0.01;
            p.x += p.vx + Math.sin(p.ph) * o.sway;
            p.y += p.vy;
            if (p.y < reg.y - 10 || p.x < reg.x - 10 || p.x > reg.x + reg.w + 10) Object.assign(p, spawn(false));
            let lit = 1;
            if (L) lit = Math.max(0, 1 - Math.hypot(p.x - L.x, p.y - L.y) / L.r);
            const alpha = p.a * (L ? 0.25 + 0.75 * lit : 1) * (o.fade ? Math.min(1, (p.y - reg.y) / (reg.h * 0.35)) : 1);
            g.beginPath();
            g.arc(p.x, p.y, p.r * (0.8 + 0.5 * lit), 0, Math.PI * 2);
            g.fillStyle = `rgba(${o.color},${Math.max(0, alpha).toFixed(3)})`;
            g.fill();
        }
        raf = requestAnimationFrame(step);
    };
    const api = {
        start() {
            if (running || !visible || document.hidden) return;
            running = true; last = 0;
            gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 1.4, overwrite: 'auto' });
            raf = requestAnimationFrame(step);
        },
        stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; },
        destroy() { api.stop(); io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', onVis); g.clearRect(0, 0, w, h); },
        get visible() { return visible; },
    };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? (o.gate ? o.gate() && api.start() : api.start()) : api.stop(); }, { threshold: 0.02 });
    const onVis = () => (document.hidden ? api.stop() : (o.gate ? o.gate() && api.start() : api.start()));
    const ro = new ResizeObserver(resize);
    io.observe(host); ro.observe(host);
    document.addEventListener('visibilitychange', onVis);
    resize();
    return api;
}
