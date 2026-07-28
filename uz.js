/* ============================================================
   Uzmanlık Alanları sayfası — hafif etkileşim katmanı
   ============================================================ */

import { MONTHS_TR, moonPhaseLabel, moonIconSVG } from './astro-core.js';

document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();

    const dateEl = document.getElementById('masthead-date');
    if (dateEl) dateEl.textContent = `${now.getDate()} ${MONTHS_TR[now.getMonth()]} ${now.getFullYear()}`;

    document.querySelectorAll('[data-moon-phase]').forEach(el => { el.textContent = moonPhaseLabel(now); });

    const moonIconHost = document.getElementById('moon-icon');
    if (moonIconHost) moonIconHost.innerHTML = moonIconSVG(now);

    /* Kademeli görünürlük animasyonu */
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('revealed'), i * 90);
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));
});
