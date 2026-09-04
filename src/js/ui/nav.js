// Masthead durumları (hero üstünde şeffaf → krem), mobil menü, ışık çubuğu (sahne başına lamba), yapışkan mobil CTA.
// GSAP'a bağımlı değil; azaltılmış hareket modunda da çalışır.
import { BP_DESKTOP, MASTHEAD_H } from '../config.js';

export function initNav() {
    const masthead = document.getElementById('masthead');
    if (!masthead) return;
    const nav = document.getElementById('nav');
    const toggle = masthead.querySelector('.nav-toggle');
    const lightbar = masthead.querySelector('.lightbar');
    const hero = document.querySelector('.hero');
    const finale = document.querySelector('.finale');
    const ctaBar = document.getElementById('cta-bar');
    const scenes = [...document.querySelectorAll('.scene')];

    if (nav && toggle) {
        const setOpen = (open) => {
            nav.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
        };
        toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
        nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
        });
        matchMedia(`(min-width: ${BP_DESKTOP}px)`).addEventListener('change', (e) => { if (e.matches) setOpen(false); });
    }

    // Işık çubuğu: her .scene için bir lamba
    let cells = [];
    if (lightbar && scenes.length) {
        lightbar.innerHTML = scenes.map(() => '<li></li>').join('');
        cells = [...lightbar.children];
    }

    let solid = null;
    let barVisible = null;
    let active = -1;
    let ticking = false;
    const update = () => {
        ticking = false;
        const vh = innerHeight;
        const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
        const wantSolid = heroBottom <= MASTHEAD_H;
        if (wantSolid !== solid) {
            solid = wantSolid;
            masthead.classList.toggle('masthead--solid', solid);
            masthead.classList.toggle('masthead--over', !solid);
        }
        if (cells.length) {
            let last = -1;
            scenes.forEach((s, i) => { if (s.getBoundingClientRect().top <= vh * 0.5) last = i; });
            if (last !== active) {
                active = last;
                cells.forEach((c, i) => { c.classList.toggle('is-lit', i <= last); c.classList.toggle('is-active', i === last); });
            }
        }
        if (ctaBar) {
            const finaleRect = finale ? finale.getBoundingClientRect() : null;
            const inFinale = finaleRect ? finaleRect.top <= vh * 0.55 && finaleRect.bottom > vh * 0.85 : false;
            const want = heroBottom < vh * 0.4 && !inFinale;
            if (want !== barVisible) { barVisible = want; ctaBar.classList.toggle('cta-bar--visible', want); }
        }
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request);
    document.addEventListener('layout:change', request);
    update();
}
