// Web Audio sentez motoru — dosya yok. Tüm sesler kısa, yumuşak, -18 dB ana kazanç; hız sınırı var.
export function createEngine() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return { play() {}, resume: async () => {}, suspend() {} };
    const ctx = new AC();
    const master = ctx.createGain(); master.gain.value = 0.12; master.connect(ctx.destination);
    let noiseBuf = null;
    const noise = () => {
        if (!noiseBuf) {
            noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
            const d = noiseBuf.getChannelData(0);
            for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        }
        const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true; return src;
    };
    const env = (node, t, a, peak, d, sustain = 0) => {
        const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(peak, t + a);
        g.gain.exponentialRampToValueAtTime(Math.max(0.0001, sustain), t + a + d);
        node.connect(g); g.connect(master); return g;
    };
    const tone = (t, f0, f1, dur, type = 'sine', peak = 1) => {
        const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
        env(o, t, 0.005, peak, dur); o.start(t); o.stop(t + dur + 0.05);
    };
    const hiss = (t, dur, { type = 'bandpass', f0 = 800, f1 = 800, q = 1, peak = 0.6, a = 0.02 } = {}) => {
        const n = noise(); const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q;
        f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + dur);
        n.connect(f); env(f, t, a, peak, dur - a); n.start(t); n.stop(t + dur + 0.05);
    };
    const sounds = {
        knock(t) { tone(t, 90, 42, 0.28, 'sine', 1); hiss(t, 0.06, { type: 'bandpass', f0: 380, f1: 200, q: 2, peak: 0.5, a: 0.003 }); },
        curtain(t, d) { const dur = d?.small ? 0.7 : 1.6; hiss(t, dur, { type: 'lowpass', f0: 500, f1: 260, q: 0.7, peak: d?.small ? 0.25 : 0.45, a: dur * 0.4 }); hiss(t, dur, { type: 'bandpass', f0: 1200, f1: 400, q: 1.2, peak: 0.12, a: dur * 0.3 }); },
        lights(t) { tone(t, 140, 110, 0.14, 'sine', 0.5); hiss(t + 0.05, 0.25, { type: 'highpass', f0: 2500, f1: 4000, peak: 0.08 }); },
        stamp(t, d) { tone(t, 110, 50, 0.18, 'sine', d?.soft ? 0.5 : 1); hiss(t, 0.05, { type: 'lowpass', f0: 900, f1: 300, peak: 0.5, a: 0.003 }); },
        tear(t) { hiss(t, 0.38, { type: 'highpass', f0: 700, f1: 3200, q: 0.8, peak: 0.5, a: 0.01 }); hiss(t, 0.2, { type: 'bandpass', f0: 2400, f1: 900, q: 3, peak: 0.25, a: 0.005 }); },
        flap(t) { hiss(t, 0.025, { type: 'highpass', f0: 2200, f1: 2200, peak: 0.18, a: 0.002 }); },
        seal(t) { tone(t, 80, 45, 0.22, 'sine', 0.9); tone(t + 0.04, 330, 300, 0.35, 'triangle', 0.12); },
        whoosh(t) { hiss(t, 0.55, { type: 'bandpass', f0: 500, f1: 1600, q: 1.5, peak: 0.3, a: 0.2 }); },
    };
    const last = {};
    const minGap = { flap: 0.05, knock: 0.2, curtain: 0.5, whoosh: 0.4, stamp: 0.1, seal: 0.2, tear: 0.2, lights: 0.5 };
    return {
        play(name, detail) {
            const fn = sounds[name]; if (!fn || ctx.state !== 'running') return;
            const t = ctx.currentTime;
            if (last[name] != null && t - last[name] < (minGap[name] || 0.05)) return;
            last[name] = t;
            try { fn(t + 0.01, detail); } catch { /* yok */ }
        },
        resume: () => ctx.resume(),
        suspend: () => ctx.suspend(),
        get state() { return ctx.state; },
    };
}
