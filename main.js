/* ============================================================
   ( AKADEMİ ADI ) — Yaratıcı Drama Akademisi
   Hafif etkileşim katmanı
   ============================================================ */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {

    /* Perde açılışı */
    const hero = document.getElementById('hero');
    if (hero) {
        if (REDUCED_MOTION) hero.classList.add('open');
        else setTimeout(() => hero.classList.add('open'), 350);
    }

    /* Kademeli görünürlük */
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('revealed'), i * 80);
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

    /* SSS akordeonu */
    document.querySelectorAll('.faq-q').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const answer = item.querySelector('.faq-a');
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.faq-item.active').forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-a').style.maxHeight = null;
            });
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* Yıl */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
