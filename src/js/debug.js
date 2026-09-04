// ?debug → window.__drama ile açılış zaman çizelgesinde gezinme (ekran görüntüsü/inceleme için)
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
    };
    console.info('[drama] debug: __drama.seek(saniye) · __drama.finish() · __drama.state');
}
