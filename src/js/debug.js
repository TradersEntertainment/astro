// ?debug → window.__drama: açılış zaman çizelgesinde gezinme, sahneye atlama, ScrollTrigger'lara erişim
import { DEBUG } from './config.js';
import { gsap, ScrollTrigger } from './gsap.js';
import { state } from './state.js';

export function initDebug() {
    if (!DEBUG) return;
    window.__drama = {
        gsap, ScrollTrigger, state,
        seek(t) { const tl = state.openingTl; if (!tl) return; tl.pause(); tl.seek(t, false); },
        play() { state.openingTl?.play(); },
        finish() { state.openingTl?.progress(1); },
        replay() { return state.replayOpening?.(); },
        // Bir seçiciye anında kaydır (pin ara parçaları dahil), ScrollTrigger'ı güncelle
        jump(sel, offset = 0) {
            const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
            if (!el) return false;
            window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - offset, behavior: 'instant' });
            ScrollTrigger.update();
            return true;
        },
        // Belirli bir ScrollTrigger'ı ilerleme değerine götür (0..1) — pin'li sahneler için
        st(id, progress) {
            const t = ScrollTrigger.getById(id);
            if (!t) return null;
            if (typeof progress === 'number') {
                window.scrollTo({ top: t.start + (t.end - t.start) * progress, behavior: 'instant' });
                ScrollTrigger.update();
            }
            return t;
        },
        pins() { return ScrollTrigger.getAll().filter((t) => t.pin).map((t) => t.vars.id || t.trigger?.id); },
        ids() { return ScrollTrigger.getAll().map((t) => t.vars.id || '(no id)'); },
    };
    console.info('[drama] debug: __drama.seek(s) · finish() · replay() · jump(sel) · st(id, p) · pins() · ids()');
}
