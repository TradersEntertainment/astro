// Açılış (tam gösteri ~6 sn): salon ışıkları kısılır → 3 vuruş → kamera sahneye ilerler → spot → başlık →
// perde açılır → tül kalkar → lede/CTA → rampa ışıkları → toz. İlk girdide 6×, tekrar ziyarette 2.5×.
import { gsap } from '../gsap.js';
import { state } from '../state.js';
import { sfx } from '../sfx.js';
import { OPENING_SEEN_KEY } from '../config.js';

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
        const legs = [legL, legR].filter(Boolean);
        const pleats = qa(hero, '.curtain__pleats'), shades = qa(hero, '.curtain__shade');
        const tassels = qa(hero, '.tassel');
        const cone = q(hero, '.spot-cone'), pool = q(hero, '.spot-pool');
        const stage = q(hero, '.stage-bg');
        const house = q(hero, '.house'), wash = q(hero, '.house-wash'), scrim = q(hero, '.scrim');
        const tag = q(hero, '.hero__tag'), h1 = q(hero, 'h1'), lede = q(hero, '.hero__lede');
        const ctas = qa(hero, '.hero__ctas > *'), hint = q(hero, '.hero__hint');
        const glows = qa(hero, '.lamp__glow'), footWash = q(hero, '.foot-wash');
        const replayBtn = q(hero, '.replay');
        const openTo = c.desktop ? 88 : 94;

        gsap.set(legs, { xPercent: 0, x: 0, y: 0 });
        gsap.set(pleats, { scaleX: 1 });
        gsap.set(shades, { opacity: 0 });
        if (cone) gsap.set(cone, { opacity: 0, scaleY: 0.2, transformOrigin: '50% 0%' });
        if (pool) gsap.set(pool, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.2, opacity: 0 });
        if (stage) gsap.set(stage, { scale: 1.08, transformOrigin: '50% 60%' });
        if (house) gsap.set(house, { scale: 1, y: 0, autoAlpha: 1, transformOrigin: '50% 38%' });
        if (wash) gsap.set(wash, { opacity: 1 });
        if (scrim) gsap.set(scrim, { yPercent: 0 });
        gsap.set([tag, lede, ...ctas, hint].filter(Boolean), { opacity: 0, y: 22 });
        if (h1) gsap.set(h1, { opacity: 0, y: 26, scale: 1.04, transformOrigin: '50% 60%' });
        gsap.set(glows, { xPercent: -50, yPercent: 50, x: 0, y: 0, scale: 0.5, opacity: 0 });
        if (footWash) gsap.set(footWash, { opacity: 0 });

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
        state.openingTl = tl;
        let killed = false;
        let fast = false;
        let finished = false;
        let bob = null;

        const finish = () => {
            hero.classList.add('is-done');
            bob?.kill();
            if (hint) bob = gsap.to(hint, { y: 6, duration: 1.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
            if (finished) return;
            finished = true;
            state.openingDone = true;
            try { sessionStorage.setItem(OPENING_SEEN_KEY, '1'); } catch { /* yok */ }
            document.dispatchEvent(new Event('opening:done'));
        };

        const build = () => {
            // 0.0 salon ışıkları kısılır; kamera sahneye ilerler
            if (wash) tl.to(wash, { opacity: 0, duration: 1.0, ease: 'power1.inOut' }, 0);
            if (house) {
                tl.to(house, { scale: 1.55, duration: 2.4, ease: 'power2.in' }, 0)
                  .to(house, { autoAlpha: 0, duration: 0.7, ease: 'power1.inOut' }, 1.75);
            }
            // 1.0 / 1.35 / 1.7 — üç vuruş (les trois coups)
            [1.0, 1.35, 1.7].forEach((t) => {
                if (wash) tl.to(wash, { opacity: 0.35, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.out' }, t);
                if (house) tl.to(house, { y: 3, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.out' }, t);
                if (legs.length) tl.to(legs, { y: 2, duration: 0.08, yoyo: true, repeat: 1 }, t);
                tl.call(() => sfx('knock'), null, t);
            });
            // 2.1 spot iris, 2.2 kicker, 2.3 başlık
            if (cone) tl.to(cone, { opacity: 1, scaleY: 1, duration: 1.1, ease: 'power2.out' }, 2.1);
            if (pool) tl.to(pool, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, 2.1);
            if (tag) tl.to(tag, { opacity: 1, y: 0, duration: 0.6 }, 0.3);
            if (h1) tl.to(h1, { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out' }, 0.45);
            // 2.8 perde açılır
            tl.call(() => sfx('curtain'), null, 2.8);
            if (legs.length) tl.to(legs, { xPercent: (i) => (i ? openTo : -openTo), duration: 1.8, ease: 'power3.inOut' }, 2.8);
            tl.to(pleats, { scaleX: 0.42, duration: 1.8, ease: 'power3.inOut' }, 2.8)
              .to(shades, { opacity: 0.55, duration: 1.4 }, 3.0);
            if (stage) tl.to(stage, { scale: 1, duration: 2.4, ease: 'power2.out' }, 2.8);
            if (tassels.length) {
                tl.fromTo(tassels, { rotation: -7 }, { rotation: 7, duration: 0.55, yoyo: true, repeat: 5, ease: 'sine.inOut', stagger: 0.05, transformOrigin: '50% 0%' }, 2.9)
                  .to(tassels, { rotation: 0, duration: 0.6, ease: 'sine.out' }, '>');
            }
            // 3.6 tül perde kalkar
            if (scrim) tl.to(scrim, { yPercent: -100, duration: 1.4, ease: 'power2.inOut' }, 3.6);
            // 4.2 lede, 4.5 CTA, 4.9 rampa ışıkları, 5.6 ipucu
            if (lede) tl.to(lede, { opacity: 1, y: 0, duration: 0.8 }, 4.2);
            if (ctas.length) tl.to(ctas, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 4.5);
            if (glows.length) tl.to(glows, { keyframes: { opacity: [0, 1, 0.55, 1], scale: [0.5, 1.08, 1, 1] }, duration: 0.8, stagger: { each: 0.07, from: 'center' } }, 4.9);
            tl.call(() => sfx('lights'), null, 4.9);
            if (footWash) tl.to(footWash, { opacity: 0.7, duration: 1.2 }, 5.0);
            if (hint) tl.to(hint, { opacity: 1, y: 0, duration: 0.6 }, 5.6);
            tl.add(finish, 5.9);
        };

        const seen = (() => { try { return sessionStorage.getItem(OPENING_SEEN_KEY) === '1'; } catch { return false; } })();
        const inputs = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
        const skip = () => { fast = true; if (tl.isActive()) tl.timeScale(6); };

        const replay = () => {
            if (killed || tl.duration() === 0) return;
            hero.classList.remove('is-done');
            bob?.kill(); bob = null;
            window.scrollTo({ top: 0, behavior: 'instant' });
            tl.timeScale(1).restart();
        };
        state.replayOpening = replay;
        replayBtn?.addEventListener('click', replay);

        if (state.openingDone) {
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
            replayBtn?.removeEventListener('click', replay);
            if (state.replayOpening === replay) state.replayOpening = null;
            bob?.kill();
            tl.kill();
            if (state.openingTl === tl) state.openingTl = null;
            hero.classList.remove('is-done');
        };
    },
};
