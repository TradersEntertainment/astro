// Gişe panosu (Solari): başlık ve hücreler harf harf çevrilerek gelir; dönerken rastgele glifler geçer.
// Erişilebilirlik: özgün metin görsel olarak gizli bir span'da kalır, flap'ler aria-hidden.
import { gsap } from '../gsap.js';
import { state } from '../state.js';
import { sfx } from '../sfx.js';

const GLYPHS = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789:—()';
const rnd = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

function buildCell(cell, perCell = false) {
    const text = cell.textContent.trim();
    if (!text) return [];
    const original = cell.innerHTML;
    cell.dataset.original = original;
    cell.innerHTML = '';
    const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = text;
    const wrap = document.createElement('span'); wrap.className = 'flaps'; wrap.setAttribute('aria-hidden', 'true');
    const flaps = [];
    if (perCell || text.length > 14) {
        const f = document.createElement('span'); f.className = 'flap flap--word'; f.dataset.final = text; f.textContent = text; wrap.appendChild(f); flaps.push(f);
    } else {
        for (const ch of text) {
            const f = document.createElement('span');
            const space = ch === ' ';
            f.className = 'flap' + (space ? ' flap--space' : '');
            f.dataset.final = space ? ' ' : ch;
            f.textContent = f.dataset.final;
            wrap.appendChild(f);
            if (!space) flaps.push(f);
        }
    }
    cell.append(sr, wrap);
    return flaps;
}

export const board = {
    name: 'board',
    sel: '.board',
    init(table, c, ctx) {
        let built = false, killed = false, tl = null;
        const cells = [...table.querySelectorAll('th, td')];
        const restore = () => { cells.forEach((cell) => { if (cell.dataset.original != null) { cell.innerHTML = cell.dataset.original; delete cell.dataset.original; } }); table.classList.remove('board--flap'); table.querySelector('colgroup')?.remove(); table.style.tableLayout = ''; table.style.width = ''; };

        const flip = (flaps, stagger = 0.012) => {
            const dur = 0.42;
            const timeline = gsap.timeline();
            flaps.forEach((f) => { f.dataset.settled = ''; });
            timeline.from(flaps, { scaleY: 0.04, transformOrigin: '50% 50%', duration: dur, stagger, ease: 'power2.out' }, 0);
            let lastSfx = 0, lastWrite = -1;
            timeline.eventCallback('onUpdate', () => {
                const t = timeline.time();
                if (t - lastWrite < 0.05 && t < timeline.duration()) return;
                lastWrite = t;
                flaps.forEach((f, i) => {
                    const start = i * stagger;
                    if (t < start) return;
                    if (t < start + dur * 0.7) { f.textContent = rnd(); }
                    else if (f.dataset.settled !== '1') { f.dataset.settled = '1'; f.textContent = f.dataset.final; }
                });
                if (t - lastSfx > 0.09) { lastSfx = t; sfx('flap'); }
            });
            timeline.eventCallback('onComplete', () => flaps.forEach((f) => { f.textContent = f.dataset.final; }));
            return timeline;
        };

        const build = () => {
            if (built || killed) return;
            built = true;
            ctx.add(() => {
                // sütun genişliklerini önce ölç → flap'ler yazı değiştirirken tablo yeniden akmaz
                const firstRow = table.querySelector('tr');
                if (firstRow) {
                    const widths = [...firstRow.children].map((c) => c.getBoundingClientRect().width);
                    const cg = document.createElement('colgroup');
                    widths.forEach((w) => { const col = document.createElement('col'); col.style.width = `${Math.ceil(w)}px`; cg.appendChild(col); });
                    table.prepend(cg);
                    table.style.tableLayout = 'fixed';
                    table.style.width = `${Math.ceil(widths.reduce((a, b) => a + b, 0))}px`;
                }
                table.classList.add('board--flap');
                const flaps = cells.flatMap((cell) => buildCell(cell, !!c.mobile));
                tl = gsap.timeline({ scrollTrigger: { id: 'board', trigger: table, start: 'top 80%', once: true } });
                tl.add(flip(flaps, c.mobile ? 0.05 : 0.012));
                // gerçek veri geldiğinde: document.dispatchEvent(new CustomEvent('board:update', { detail: { cell, text } }))
                state.boardUpdate = (cell, text) => {
                    cell.textContent = text;
                    const fl = buildCell(cell, !!c.mobile);
                    if (fl.length) flip(fl, 0.03);
                };
            });
        };
        const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { io.disconnect(); build(); } }, { rootMargin: '900px 0px' });
        io.observe(table);
        const onUpdate = (e) => { const { cell, text } = e.detail || {}; if (cell && state.boardUpdate) state.boardUpdate(cell, text); };
        document.addEventListener('board:update', onUpdate);
        return () => {
            killed = true; io.disconnect();
            document.removeEventListener('board:update', onUpdate);
            if (tl) { tl.progress(1); tl.kill(); }
            state.boardUpdate = null;
            restore();
        };
    },
};
