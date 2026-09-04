// Açılış: salon ışıkları → spot → başlık → perde açılır → lede/CTA → rampa ışıkları → toz.
import { gsap, SplitText } from '../gsap.js';
import { state } from '../state.js';
import { OPENING_SEEN_KEY, DEBUG } from '../config.js';

const q = (r, s) => r.querySelector(s);
const qa = (r, s) => [...r.querySelectorAll(s)];

const fontsReady = () => new Promise((res) => {
    let done = false;
    const go = () => { if (!done) { done = true; res(); } };
    (document.fonts?.ready || Promise.resolve()).then(go, go);
    setTimeout(go, 900);
});

export const opening = {
    name: 'opening',
    sel: '.hero',
    init(hero, c) {
        const legL = q(hero, '.curtain__leg--l'), legR = q(hero, '.curtain__leg--r');
        const pleats = qa(hero, '.curtain__pleats'), shades = qa(hero, '.curtain__shade');
        const tassels = qa(hero, '.tassel');
        const cone = q(hero, '.spot-cone'), pool = q(hero, '.spot-pool');
        const stage = q(hero, '.stage-bg');
        const tag = q(hero, '.hero__tag'), h1 = q(hero, 'h1'), lede = q(hero, '.hero__lede');
        const ctas = qa(hero, '.hero__ctas > *'), hint = q(hero, '.hero__hint');
        const glows = qa(hero, '.lamp__glow'), wash = q(hero, '.foot-wash');
        const openTo = c.desktop ? 88 : 94;

        gsap.set([legL, legR], { xPercent: 0, x: 0 });
        gsap.set(pleats, { scaleX: 1 });
        gsap.set(shades, { opacity: 0 });
        if (cone) gsap.set(cone, { opacity: 0, scaleY: 0.2, transformOrigin: '50% 0%' });
        if (pool) gsap.set(pool, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.2, opacity: 0 });
        if (stage) gsap.set(stage, { scale: 1.08, transformOrigin: '50% 60%' });
        gsap.set([tag, lede, ...ctas, hint].filter(Boolean), { opacity: 0, y: 22 });
        if (h1) gsap.set(h1, { opacity: 0 });
        gsap.set(glows, { xPercent: -50, yPercent: 50, x: 0, y: 0, scale: 0.5, opacity: 0 });
        if (wash) gsap.set(wash, { opacity: 0 });

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
        state.openingTl = tl;
        let split = null;
        let killed = false;
        let fast = false;
        let finished = false;
        let bob = null;

        const finish = () => {
            if (finished) return;
            finished = true;
            state.openingDone = true;
            try { sessionStorage.setItem(OPENING_SEEN_KEY, '1'); } catch { /* yok */ }
            if (split && !DEBUG) { split.revert(); split = null; }
            if (hint) bob = gsap.to(hint, { y: 6, duration: 1.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
            document.dispatchEvent(new Event('opening:done'));
        };

        const build = () => {
            if (cone) tl.to(cone, { opacity: 1, scaleY: 1, duration: 1.1, ease: 'power2.out' }, 0);
            if (pool) tl.to(pool, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, 0);
            if (tag) tl.to(tag, { opacity: 1, y: 0, duration: 0.6 }, 0.1);
            if (h1) {
                try {
                    split = SplitText.create(h1, { type: 'lines', mask: 'lines', linesClass: 'hero-line' });
                    tl.from(split.lines, { yPercent: 115, duration: 1, stagger: 0.09 }, 0.15);
                } catch {
                    tl.from(h1, { y: 24, duration: 0.9 }, 0.15);
                }
                tl.set(h1, { opacity: 1 }, 0.15);
            }
            tl.to([legL, legR], { xPercent: (i) => (i ? openTo : -openTo), duration: 1.8, ease: 'power3.inOut' }, 0.6)
              .to(pleats, { scaleX: 0.42, duration: 1.8, ease: 'power3.inOut' }, 0.6)
              .to(shades, { opacity: 0.55, duration: 1.4 }, 0.8);
            if (stage) tl.to(stage, { scale: 1, duration: 2.4, ease: 'power2.out' }, 0.6);
            if (tassels.length) {
                tl.fromTo(tassels, { rotation: -7 }, { rotation: 7, duration: 0.55, yoyo: true, repeat: 5, ease: 'sine.inOut', stagger: 0.05, transformOrigin: '50% 0%' }, 0.7)
                  .to(tassels, { rotation: 0, duration: 0.6, ease: 'sine.out' }, '>');
            }
            if (lede) tl.to(lede, { opacity: 1, y: 0, duration: 0.8 }, 1.4);
            if (ctas.length) tl.to(ctas, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 1.7);
            if (glows.length) tl.to(glows, { keyframes: { opacity: [0, 1, 0.55, 1], scale: [0.5, 1.08, 1, 1] }, duration: 0.8, stagger: { each: 0.07, from: 'center' } }, 2.0);
            if (wash) tl.to(wash, { opacity: 0.7, duration: 1.2 }, 2.1);
            if (hint) tl.to(hint, { opacity: 1, y: 0, duration: 0.6 }, 2.3);
            tl.add(finish, 2.7);
        };

        const seen = (() => { try { return sessionStorage.getItem(OPENING_SEEN_KEY) === '1'; } catch { return false; } })();
        const inputs = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
        const skip = () => { fast = true; if (tl.isActive()) tl.timeScale(6); };

        if (state.openingDone) {
            // kırılma noktası değişti: tekrar oynatma, son duruma git
            build();
            tl.progress(1);
        } else {
            inputs.forEach((ev) => addEventListener(ev, skip, { passive: true }));
            fontsReady().then(() => {
                if (killed) return;
                build();
                tl.timeScale(fast ? 6 : seen ? 2.5 : 1).play();
            });
        }

        return () => {
            killed = true;
            inputs.forEach((ev) => removeEventListener(ev, skip));
            bob?.kill();
            tl.kill();
            if (split) { split.revert(); split = null; }
            if (state.openingTl === tl) state.openingTl = null;
        };
    },
};
