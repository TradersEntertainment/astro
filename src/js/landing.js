import { initMotionToggles } from './prefs.js';
import { initNav } from './ui/nav.js';
import { initFaq } from './ui/faq.js';
import { initMedia } from './ui/media.js';
import { initWhatsApp } from './ui/whatsapp.js';
import { startMotion } from './motion/index.js';
import { opening } from './motion/opening.js';
import { velocity } from './motion/velocity.js';
import { dolly } from './motion/dolly.js';
import { spotlight } from './motion/spotlight.js';
import { dust } from './motion/dust.js';
import { reveals } from './motion/reveals.js';
import { marquee } from './motion/marquee.js';
import { wipes } from './motion/wipes.js';
import { finale } from './motion/finale.js';
import { initDebug } from './debug.js';

initMotionToggles();
initNav();
initFaq();
initMedia();
initWhatsApp();
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

startMotion([velocity, opening, dolly, spotlight, dust, reveals, wipes, marquee, finale]);
initDebug();
