// Modüller arası paylaşılan hafif durum
export const state = {
    openingDone: false,
    openingTl: null,
    replayOpening: null,            // opening.js doldurur: () => Promise
    spot: { x: 0, y: 0, active: false },
    velocity: 0,                    // ham px/sn (ScrollTrigger.getVelocity)
    speed: 0,                       // yumuşatılmış, 0..1 (|velocity| / 3000, sönümlü)
    dir: 0,                         // -1 yukarı, 1 aşağı
    sound: { on: false, ready: false },
};
