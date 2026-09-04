// Orkestra: gsap.matchMedia bağlamı içinde modülleri başlatır; tercih değişince geri alır / yeniden kurar.
// Modül: { name, sel?, needs?(conditions), init(root, conditions, ctx) → cleanup? }
import { gsap, ScrollTrigger } from '../gsap.js';
import { isReduced, onMotionChange } from '../prefs.js';
import { BP_DESKTOP } from '../config.js';

const html = document.documentElement;
let mm = null;
let current = [];

function run(modules) {
    mm = gsap.matchMedia();
    mm.add({
        desktop: `(min-width: ${BP_DESKTOP}px)`,
        mobile: `(max-width: ${BP_DESKTOP - 1}px)`,
        fine: '(hover: hover) and (pointer: fine)',
    }, (ctx) => {
        const c = ctx.conditions;
        const cleanups = [];
        for (const m of modules) {
            const root = m.sel ? document.querySelector(m.sel) : document;
            if (!root || (m.needs && !m.needs(c))) continue;
            try {
                const cl = m.init(root, c, ctx);
                if (typeof cl === 'function') cleanups.push(cl);
            } catch (err) {
                console.error(`[motion] ${m.name || m.sel}`, err);
            }
        }
        return () => cleanups.forEach((f) => { try { f(); } catch { /* yok */ } });
    });
    html.classList.add('motion-ready');
}

export function startMotion(modules) {
    current = modules;
    try {
        if (!isReduced()) run(modules);
    } catch (err) {
        console.error('[motion] başlatılamadı, statik moda düşülüyor', err);
        html.dataset.motion = 'reduced';
    }
    onMotionChange((reduced) => {
        if (reduced) { mm?.revert(); mm = null; }
        else if (!mm) run(current);
        requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    let t;
    const refresh = () => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 220); };
    document.addEventListener('layout:change', refresh);
    addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
}
