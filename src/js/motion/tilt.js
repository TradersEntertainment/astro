// Bilet 3D eğimi: masaüstünde imleçle (parlama dahil); dokunmatikte kaydırma hızıyla yatar,
// Android'de cihaz eğimi (izin gerektirmez) yana eğer. Dağıtım bitmeden devreye girmez.
import { gsap } from '../gsap.js';
import { state } from '../state.js';

export const tilt = {
    name: 'tilt',
    sel: '.tickets',
    init(wrap, c) {
        const tickets = [...wrap.querySelectorAll('.ticket')];
        if (!tickets.length) return;
        const cleanups = [];
        let armed = false;
        const arm = () => { armed = true; gsap.set(tickets, { transformPerspective: 900 }); };
        if (state.ticketsDealt) arm(); else document.addEventListener('tickets:dealt', arm, { once: true });

        if (c.fine && c.desktop) {
            tickets.forEach((t) => {
                const main = t.querySelector('.ticket__main') || t;
                const rx = gsap.quickTo(t, 'rotationX', { duration: 0.5, ease: 'power3' });
                const ry = gsap.quickTo(t, 'rotationY', { duration: 0.5, ease: 'power3' });
                const move = (e) => {
                    if (!armed || t.classList.contains('is-open')) return;
                    const r = t.getBoundingClientRect();
                    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
                    rx((0.5 - py) * 8); ry((px - 0.5) * 8);
                    main.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
                    main.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
                    main.style.setProperty('--glare', '1');
                };
                const leave = () => { rx(0); ry(0); main.style.setProperty('--glare', '0'); };
                const onToggle = (e) => { if (e.detail.ticket === t) leave(); };
                t.addEventListener('pointermove', move, { passive: true });
                t.addEventListener('pointerleave', leave);
                document.addEventListener('ticket:toggle', onToggle);
                cleanups.push(() => {
                    t.removeEventListener('pointermove', move); t.removeEventListener('pointerleave', leave); document.removeEventListener('ticket:toggle', onToggle);
                    ['--gx', '--gy', '--glare'].forEach((p) => main.style.removeProperty(p));
                });
            });
        } else {
            const rx = tickets.map((t) => gsap.quickTo(t, 'rotationX', { duration: 0.6, ease: 'power2' }));
            const ry = tickets.map((t) => gsap.quickTo(t, 'rotationY', { duration: 0.9, ease: 'power2' }));
            let gy = 0, inView = false;
            const io = new IntersectionObserver(([en]) => { inView = en.isIntersecting; }, { threshold: 0.05 });
            io.observe(wrap);
            cleanups.push(() => io.disconnect());
            const tick = () => {
                if (!armed || !inView) return;
                const v = -state.dir * state.speed * 7;
                tickets.forEach((t, i) => { rx[i](t.classList.contains('is-open') ? 0 : v); ry[i](gy); });
            };
            gsap.ticker.add(tick);
            cleanups.push(() => gsap.ticker.remove(tick));
            if ('DeviceOrientationEvent' in window && typeof DeviceOrientationEvent.requestPermission !== 'function') {
                const onOri = (e) => { if (e.gamma != null) gy = gsap.utils.clamp(-5, 5, e.gamma / 6); };
                addEventListener('deviceorientation', onOri, { passive: true });
                cleanups.push(() => removeEventListener('deviceorientation', onOri));
            }
        }
        return () => { document.removeEventListener('tickets:dealt', arm); cleanups.forEach((f) => f()); };
    },
};
