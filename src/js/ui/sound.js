// Ses (opt-in, kapalı başlar): düğme tıklanınca motor tembel yüklenir ve AudioContext o hareketle açılır.
// Tercih saklanır; tekrar ziyarette ilk dokunuş/tuşla sessizce devreye girer. sfx:* olaylarını dinler.
import { SOUND_KEY } from '../config.js';
import { state } from '../state.js';

let engine = null;
let loading = null;
const buttons = [];

function stored() { try { return localStorage.getItem(SOUND_KEY) === 'on'; } catch { return false; } }
function persist(on) { try { localStorage.setItem(SOUND_KEY, on ? 'on' : 'off'); } catch { /* yok */ } }
function sync() {
    const on = state.sound.on;
    const label = on ? 'Sesi kapat' : 'Sesi aç';
    for (const b of buttons) { b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', label); b.title = label; }
}
async function ensureEngine() {
    if (engine) return engine;
    loading ||= import('./soundEngine.js').then((m) => { engine = m.createEngine(); return engine; });
    return loading;
}
async function turnOn({ replay } = {}) {
    const eng = await ensureEngine();
    await eng.resume();
    state.sound.on = true; state.sound.ready = true;
    sync();
    if (replay) {
        const hero = document.querySelector('.hero');
        const r = hero?.getBoundingClientRect();
        if (r && r.bottom > innerHeight * 0.5 && r.top < innerHeight * 0.5) state.replayOpening?.();
        else eng.play('lights');
    }
}
function turnOff() {
    state.sound.on = false;
    engine?.suspend();
    sync();
}

export function initSound() {
    buttons.push(...document.querySelectorAll('.sound-toggle'));
    if (!buttons.length) return;
    buttons.forEach((b) => b.addEventListener('click', () => {
        if (state.sound.on) { turnOff(); persist(false); }
        else { persist(true); turnOn({ replay: true }); }
    }));
    // olay köprüsü: motor varsa ve açıksa çal
    const onSfx = (e) => { if (state.sound.on && engine) engine.play(e.type.slice(4), e.detail); };
    ['knock', 'curtain', 'lights', 'stamp', 'tear', 'flap', 'seal', 'whoosh'].forEach((n) => document.addEventListener(`sfx:${n}`, onSfx));
    // tekrar ziyaret: tercih açıksa ilk gerçek etkileşimde devreye gir (autoplay politikası)
    if (stored()) {
        state.sound.on = true; sync();
        const arm = () => { turnOn(); };
        ['pointerdown', 'keydown', 'touchend'].forEach((ev) => addEventListener(ev, arm, { once: true, passive: true }));
    }
    document.addEventListener('visibilitychange', () => { if (!engine) return; document.hidden ? engine.suspend() : (state.sound.on && engine.resume()); });
}
