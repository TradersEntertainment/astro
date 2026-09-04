// Site geneli takip spotu: masaüstünde imleci izler (hero dışında; koyu bölümlerde daha parlak, finalde boşta CTA'ya döner),
// dokunmatikte kaydırma yönüne göre süzülür ve yalnız koyu bölümlerde görünür.
import { gsap } from '../gsap.js';
import { state } from '../state.js';

export const followSpot = {
    name: 'followSpot',
    init(root, c) {
        const light = document.createElement('div');
        light.className = 'cursor-light';
        light.setAttribute('aria-hidden', 'true');
        document.body.appendChild(light);
        gsap.set(light, { xPercent: -50, yPercent: -50, x: innerWidth / 2, y: innerHeight / 2 });
        const toX = gsap.quickTo(light, 'x', { duration: 0.8, ease: 'power3' });
        const toY = gsap.quickTo(light, 'y', { duration: 0.8, ease: 'power3' });
        const hero = document.querySelector('.hero');
        const finale = document.querySelector('.finale');
        const darks = [...document.querySelectorAll('.on-dark')];
        let heroIn = true, darkIn = 0, finaleIn = false, idle = 0;
        const cleanups = [];
        const sync = () => { light.classList.toggle('is-on', !heroIn); light.classList.toggle('is-bright', darkIn > 0); };
        const ioHero = hero && new IntersectionObserver(([en]) => { heroIn = en.isIntersecting; sync(); }, { threshold: 0.15 });
        ioHero?.observe(hero);
        const ioDark = new IntersectionObserver((ens) => { ens.forEach((en) => { darkIn += en.isIntersecting ? 1 : -1; }); darkIn = Math.max(0, darkIn); sync(); }, { threshold: 0.2 });
        darks.forEach((d) => ioDark.observe(d));
        const ioFin = finale && new IntersectionObserver(([en]) => { finaleIn = en.isIntersecting; }, { threshold: 0.3 });
        ioFin?.observe(finale);
        cleanups.push(() => { ioHero?.disconnect(); ioDark.disconnect(); ioFin?.disconnect(); });

        if (c.fine && c.desktop) {
            const homeToCta = () => {
                if (!finaleIn) return;
                const cta = finale.querySelector('.btn');
                const r = cta?.getBoundingClientRect();
                if (r) { toX(r.left + r.width / 2); toY(r.top + r.height / 2); }
            };
            const onMove = (e) => { toX(e.clientX); toY(e.clientY); clearTimeout(idle); idle = setTimeout(homeToCta, 2000); };
            addEventListener('pointermove', onMove, { passive: true });
            cleanups.push(() => { removeEventListener('pointermove', onMove); clearTimeout(idle); });
        } else {
            let y = innerHeight * 0.5;
            const tick = () => {
                if (!light.classList.contains('is-on')) return;
                const target = innerHeight * (0.5 + state.dir * state.speed * 0.22);
                y += (target - y) * 0.08;
                toX(innerWidth / 2); toY(y);
            };
            gsap.ticker.add(tick);
            cleanups.push(() => gsap.ticker.remove(tick));
            // dokunmatikte yalnız koyu bölümlerde görünür
            const syncTouch = () => light.classList.toggle('is-on', !heroIn && darkIn > 0);
            const io2 = new IntersectionObserver(() => setTimeout(syncTouch, 0), { threshold: 0.2 });
            darks.forEach((d) => io2.observe(d)); hero && io2.observe(hero);
            cleanups.push(() => io2.disconnect());
        }
        sync();
        return () => { cleanups.forEach((f) => f()); light.remove(); };
    },
};
