// Masthead durumları (hero üstünde şeffaf → krem), mobil menü, ilerleme çizgisi, yapışkan mobil CTA.
// GSAP'a bağımlı değil; azaltılmış hareket modunda da çalışır.
import { BP_DESKTOP, MASTHEAD_H } from '../config.js';

export function initNav() {
    const masthead = document.getElementById('masthead');
    if (!masthead) return;
    const nav = document.getElementById('nav');
    const toggle = masthead.querySelector('.nav-toggle');
    const rail = masthead.querySelector('.rail');
    const hero = document.querySelector('.hero');
    const finale = document.querySelector('.finale');
    const ctaBar = document.getElementById('cta-bar');

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

    let solid = null;
    let barVisible = null;
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
        if (rail) {
            const max = document.documentElement.scrollHeight - vh;
            const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
            rail.style.transform = `scaleX(${p.toFixed(4)})`;
        }
        if (ctaBar) {
            const finaleTop = finale ? finale.getBoundingClientRect().top : Infinity;
            const want = heroBottom < vh * 0.4 && finaleTop > vh * 0.55;
            if (want !== barVisible) { barVisible = want; ctaBar.classList.toggle('cta-bar--visible', want); }
        }
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request);
    document.addEventListener('layout:change', request);
    update();
}
