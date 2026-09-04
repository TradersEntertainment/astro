// Ses olayları: modüller yalnız olay atar, ui/sound.js (opt-in) dinler. Ayrışık; ses kapalıysa hiçbir şey olmaz.
export const sfx = (name, detail) => document.dispatchEvent(new CustomEvent(`sfx:${name}`, { detail }));
