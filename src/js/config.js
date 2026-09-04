export const WA_NUMBER = '905000000000';
export const MOTION_KEY = 'akademi:motion';
export const SOUND_KEY = 'akademi:sound';
export const OPENING_SEEN_KEY = 'akademi:opening';
export const BP_DESKTOP = 900;
export const MASTHEAD_H = 68;
export const DEBUG = /[?&]debug(=|&|$)/.test(location.search);
// Playwright'ta deterministik olsun diye debug'da scrub gecikmesiz
export const SCRUB = DEBUG ? true : 0.8;
