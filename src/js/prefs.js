// Hareket tercihi: <head> içindeki inline script ilk değeri yazar; burada anahtar + OS değişimi yönetilir.
import { MOTION_KEY } from './config.js';

const html = document.documentElement;
const osQuery = matchMedia('(prefers-reduced-motion: reduce)');
const listeners = new Set();
let buttons = [];

function stored() {
    try { return localStorage.getItem(MOTION_KEY); } catch { return null; }
}

export function isReduced() {
    return html.dataset.motion === 'reduced';
}

function syncButtons() {
    const reduced = isReduced();
    const label = reduced ? 'Animasyonları aç' : 'Animasyonları azalt';
    for (const b of buttons) {
        b.setAttribute('aria-pressed', String(reduced));
        b.setAttribute('aria-label', label);
        b.title = label;
    }
}

export function setReduced(reduced, { persist = true } = {}) {
    const next = reduced ? 'reduced' : 'full';
    if (html.dataset.motion !== next) {
        html.dataset.motion = next;
        listeners.forEach((fn) => fn(reduced));
    }
    if (persist) { try { localStorage.setItem(MOTION_KEY, next); } catch { /* özel mod */ } }
    syncButtons();
}

export function onMotionChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

export function initMotionToggles() {
    buttons = [...document.querySelectorAll('.motion-toggle')];
    buttons.forEach((b) => b.addEventListener('click', () => setReduced(!isReduced())));
    osQuery.addEventListener('change', (e) => { if (!stored()) setReduced(e.matches, { persist: false }); });
    syncButtons();
}
