// Modüller arası paylaşılan hafif durum (açılış bitti mi, spot nerede, debug için zaman çizelgesi)
export const state = {
    openingDone: false,
    openingTl: null,
    spot: { x: 0, y: 0, active: false },
};
