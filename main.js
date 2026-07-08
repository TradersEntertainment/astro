/* ============================================================
   Özlem · Astroloji — etkileşim katmanı
   ============================================================ */

/* Fontlar (self-host: dış CDN bağımlılığı yok) */
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/jost/300.css';
import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import '@fontsource/spectral/300.css';
import '@fontsource/spectral/400.css';
import '@fontsource/spectral/300-italic.css';
import '@fontsource/spectral/400-italic.css';

import * as Astronomy from 'astronomy-engine';

const SIGNS = ["Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak", "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"];
const SIGN_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const PLANET_GLYPHS = { "Güneş": "☉", "Ay": "☽", "Merkür": "☿", "Venüs": "♀", "Mars": "♂", "Jüpiter": "♃", "Satürn": "♄" };

/* Geleneksel burç anahtarları — ön okuma metni için */
const SIGN_LORE = {
    "Koç":     { ruler: "Mars",    element: "Ateş",   mode: "Öncü",     keys: "girişim, cesaret ve doğrudanlık" },
    "Boğa":    { ruler: "Venüs",   element: "Toprak", mode: "Sabit",    keys: "istikrar, duyusallık ve sahiplenme" },
    "İkizler": { ruler: "Merkür",  element: "Hava",   mode: "Değişken", keys: "merak, iletişim ve çok yönlülük" },
    "Yengeç":  { ruler: "Ay",      element: "Su",     mode: "Öncü",     keys: "duyarlılık, koruma ve aidiyet" },
    "Aslan":   { ruler: "Güneş",   element: "Ateş",   mode: "Sabit",    keys: "yaratıcılık, onur ve kendini ifade" },
    "Başak":   { ruler: "Merkür",  element: "Toprak", mode: "Değişken", keys: "çözümleme, düzen ve incelik" },
    "Terazi":  { ruler: "Venüs",   element: "Hava",   mode: "Öncü",     keys: "denge, estetik ve ortaklık" },
    "Akrep":   { ruler: "Mars",    element: "Su",     mode: "Sabit",    keys: "yoğunluk, dönüşüm ve kararlılık" },
    "Yay":     { ruler: "Jüpiter", element: "Ateş",   mode: "Değişken", keys: "anlam arayışı, genişleme ve açık sözlülük" },
    "Oğlak":   { ruler: "Satürn",  element: "Toprak", mode: "Öncü",     keys: "disiplin, sorumluluk ve ustalık" },
    "Kova":    { ruler: "Satürn",  element: "Hava",   mode: "Sabit",    keys: "özgünlük, toplumsal bakış ve bağımsızlık" },
    "Balık":   { ruler: "Jüpiter", element: "Su",     mode: "Değişken", keys: "sezgi, empati ve hayal gücü" }
};

const WHATSAPP_NUMBER = "905000000000";

/* ---------- Telegram bildirimi (yalnızca önemli olaylar) ---------- */

const TG_CONFIG = {
    token: import.meta.env.VITE_TG_TOKEN,
    chatId: import.meta.env.VITE_TG_CHAT_ID
};

async function sendTelegramNotification(message) {
    if (!TG_CONFIG.token || !TG_CONFIG.chatId) return;
    try {
        await fetch(`https://api.telegram.org/bot${TG_CONFIG.token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TG_CONFIG.chatId, text: message, parse_mode: 'HTML' })
        });
    } catch (e) { console.error('TG Log Error:', e); }
}

let cachedUserData = null;

async function logUserAction(action, details = {}) {
    try {
        if (!cachedUserData) {
            const ipRes = await fetch('https://ipapi.co/json/').catch(() => null);
            cachedUserData = ipRes ? await ipRes.json() : { ip: 'Bilinmiyor' };
        }
        const ipData = cachedUserData;
        const getDevice = () => {
            const ua = navigator.userAgent;
            if (ua.indexOf("iPhone") !== -1) return "iPhone";
            if (ua.indexOf("Android") !== -1) return "Android";
            if (ua.indexOf("Windows") !== -1) return "Windows";
            if (ua.indexOf("Macintosh") !== -1) return "Mac";
            return "Bilinmiyor";
        };

        let message = `<b>☽ Özlem Astroloji</b>\n━━━━━━━━━━━━━━━━\n`;
        message += `<b>Eylem:</b> ${action}\n`;
        message += `<b>IP:</b> <code>${ipData.ip}</code>\n`;
        message += `<b>Konum:</b> ${ipData.city || ''} ${ipData.country_name || ''}\n`;
        message += `<b>Cihaz:</b> ${getDevice()}\n`;
        if (Object.keys(details).length > 0) {
            message += `\n<b>Detaylar:</b>\n`;
            for (const [key, value] of Object.entries(details)) {
                message += `• ${key}: <code>${value}</code>\n`;
            }
        }
        sendTelegramNotification(message);
    } catch (e) { console.error('Logging Error:', e); }
}

/* ---------- Ay evresi ---------- */

function moonPhaseLabel(date) {
    const synodic = 29.530588;
    const knownNewMoon = 947178840; // 2000-01-06 yeni ayı (Unix sn)
    const days = ((date.getTime() / 1000 - knownNewMoon) / 86400) % synodic;
    const idx = Math.floor((days / synodic) * 8) % 8;
    const names = ["Yeni Ay", "Büyüyen Hilal", "İlk Dördün", "Şişkin Ay", "Dolunay", "Küçülen Ay", "Son Dördün", "Balzamik Ay"];
    return names[idx];
}

/* ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    logUserAction('Siteye giriş');

    /* --- Masthead: tarih ve ay evresi --- */
    const now = new Date();
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const dateEl = document.getElementById('masthead-date');
    if (dateEl) dateEl.textContent = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    document.querySelectorAll('[data-moon-phase]').forEach(el => { el.textContent = moonPhaseLabel(now); });

    /* --- WhatsApp bağlantılarını izle --- */
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
        a.addEventListener('click', () => {
            const label = (a.dataset.waLabel || a.textContent || 'WhatsApp').trim().split('\n')[0];
            logUserAction('WhatsApp tıklaması', { Bağlam: label });
        });
    });

    /* --- Yüklenemeyen levha görsellerini gizle --- */
    document.querySelectorAll('figure.plate img').forEach(img => {
        const hide = () => { const fig = img.closest('figure.plate'); if (fig) fig.style.display = 'none'; };
        img.addEventListener('error', hide);
        if (img.complete && img.naturalWidth === 0) hide();
    });

    /* --- Görünürlük animasyonu (kademeli) --- */
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('revealed'), i * 90);
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

    /* --- Gezinme: etkin bölüm vurgusu --- */
    const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
    const sectionsById = navLinks
        .map(a => document.getElementById(a.getAttribute('href').slice(1)))
        .filter(Boolean);
    const navObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sectionsById.forEach(s => navObs.observe(s));

    /* --- SSS --- */
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

    /* --- Yazı okuma modali --- */
    const readerModal = document.getElementById('reader-modal');
    const readerBody = document.getElementById('reader-body');

    function openArticle(row) {
        const tpl = document.getElementById(`article-${row.dataset.articleId}`);
        if (!tpl) return;
        readerBody.innerHTML = tpl.innerHTML;
        readerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        logUserAction('Yazı okundu', { Yazı: row.querySelector('h3').textContent.trim() });
    }

    function closeReader() {
        readerModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.article-row').forEach(row => {
        row.addEventListener('click', () => openArticle(row));
        row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openArticle(row); } });
    });
    document.getElementById('reader-close').addEventListener('click', closeReader);
    readerModal.addEventListener('click', e => { if (e.target === readerModal) closeReader(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeReader(); });

    /* --- Doğum haritası --- */
    initNatalForm();

    /* --- Hero zodyak çarkı (canlı gökyüzü) --- */
    initZodiacWheel();

    /* --- Ay evresi ikonu --- */
    const moonIconHost = document.getElementById('moon-icon');
    if (moonIconHost) moonIconHost.innerHTML = moonIconSVG(now);

    /* --- Tarihçe mürekkep hattı --- */
    initTimelineRail();

    /* --- Levha vitrini --- */
    initPlateLightbox();

    /* --- Burç kartları: Babil adları --- */
    initSignCells();
});

/* ============================================================
   HERO: canlı gökyüzü usturlabı
   Bugünün gerçek gezegen konumlarını gösterir ve açılışta
   pergelle çiziliyormuş gibi kendini çizer.
   ============================================================ */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function currentSky(date, coords) {
    const astroTime = new Astronomy.AstroTime(date);
    const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    const trNames = ['Güneş', 'Ay', 'Merkür', 'Venüs', 'Mars', 'Jüpiter', 'Satürn'];
    const planets = bodies.map((p, i) => {
        let lon = 0;
        try { lon = Astronomy.Ecliptic(Astronomy.GeoVector(p, astroTime, true)).elon; }
        catch (e) { if (p === 'Moon') lon = Astronomy.EclipticGeoMoon(astroTime).elon; }
        return { name: trNames[i], degree: isNaN(lon) ? 0 : lon };
    });

    const gmst = Astronomy.SiderealTime(astroTime);
    let lstDeg = (gmst * 15 + coords.lon) % 360;
    if (lstDeg < 0) lstDeg += 360;
    const epsDeg = 23.4392911, rad = Math.PI / 180;
    const y = Math.cos(lstDeg * rad);
    const x = -(Math.sin(lstDeg * rad) * Math.cos(epsDeg * rad) + Math.tan(coords.lat * rad) * Math.sin(epsDeg * rad));
    let ascDeg = Math.atan2(y, x) / rad;
    ascDeg = ((ascDeg % 360) + 360) % 360;

    return { planets, ascDeg };
}

function initZodiacWheel() {
    const host = document.getElementById('zodiac-wheel');
    if (!host) return;

    const size = 520, c = size / 2;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("class", "wheel-svg");
    svg.setAttribute("aria-hidden", "true");

    const INK_W = "#262219";
    const INK_SOFT_W = "rgba(38,34,25,0.4)";
    const INK_FAINT_W = "rgba(38,34,25,0.16)";
    const GOLD_W = "#8f7431";
    const MADDER_W = "#93341f";

    const drawQueue = []; // [el, gecikme_ms, tür]
    const strokeDraw = (el, delay) => {
        if (el.tagName === 'circle') {
            const len = 2 * Math.PI * parseFloat(el.getAttribute('r'));
            el.style.strokeDasharray = `${len}`;
            el.style.strokeDashoffset = `${len}`;
        }
        drawQueue.push([el, delay, 'stroke']);
    };
    const fadeIn = (el, delay) => {
        el.setAttribute('opacity', '0');
        drawQueue.push([el, delay, 'fade']);
    };

    /* Halkalar — pergel çizimi */
    const rings = [
        mkCircle(c, c, 250, INK_FAINT_W, "none", 1),
        mkCircle(c, c, 236, INK_W, "none", 1.2),
        mkCircle(c, c, 178, INK_SOFT_W, "none", 0.8),
        mkCircle(c, c, 112, INK_FAINT_W, "none", 0.8),
    ];
    rings.forEach((r, i) => { svg.append(r); strokeDraw(r, 150 + i * 220); });

    const hub = mkCircle(c, c, 4, INK_W, INK_W, 0);
    const hubRing = mkCircle(c, c, 11, INK_SOFT_W, "none", 0.8);
    svg.append(hub, hubRing);
    fadeIn(hub, 950); strokeDraw(hubRing, 1000);

    /* Dönen dış çentik halkası (salt süs — astronomik kısım sabittir) */
    const rotor = document.createElementNS("http://www.w3.org/2000/svg", "g");
    rotor.setAttribute("class", "wheel-rotor");
    for (let d = 0; d < 360; d += 5) {
        const a = d * Math.PI / 180;
        const len = d % 30 === 0 ? 10 : (d % 10 === 0 ? 6 : 3.5);
        rotor.append(mkLine(c + Math.cos(a) * 238.5, c + Math.sin(a) * 238.5, c + Math.cos(a) * (238.5 + len), c + Math.sin(a) * (238.5 + len), d % 30 === 0 ? INK_SOFT_W : INK_FAINT_W, d % 30 === 0 ? 0.9 : 0.6));
    }
    svg.append(rotor);
    fadeIn(rotor, 700);

    /* El yazması üslubu: dağınık kızıl yıldızlar */
    const starPos = [[92, 120], [412, 96], [448, 300], [96, 396], [258, 62], [70, 258], [452, 190], [380, 440]];
    starPos.forEach(([x, y], i) => {
        const s = mkText(x, y, "✳", MADDER_W, "11px", "middle");
        s.setAttribute("opacity", "0");
        svg.append(s);
        drawQueue.push([s, 1900 + i * 110, 'fade-soft']);
    });

    /* Burç dilimleri ve glifler (sabit; gezegen konumlarıyla hizalı) */
    for (let i = 0; i < 12; i++) {
        const a = (i * 30) * Math.PI / 180;
        const spoke = mkLine(c + Math.cos(a) * 178, c + Math.sin(a) * 178, c + Math.cos(a) * 236, c + Math.sin(a) * 236, INK_SOFT_W, 0.8);
        svg.append(spoke);
        fadeIn(spoke, 900 + i * 45);

        const ga = (i * 30 + 15) * Math.PI / 180;
        const gx = c + Math.cos(ga) * 207, gy = c + Math.sin(ga) * 207;
        const glyph = mkText(gx, gy, SIGN_GLYPHS[i] + "︎", GOLD_W, "23px", "middle");
        svg.append(glyph);
        fadeIn(glyph, 1350 + i * 55);
    }

    /* Bugünün gökyüzü: gerçek gezegen konumları + İstanbul yükseleni */
    let sky = null;
    try { sky = currentSky(new Date(), { lat: 41.0082, lon: 28.9784 }); } catch (e) { console.error('Gökyüzü hesabı:', e); }

    if (sky) {
        /* Yükselen işareti */
        const aRad = sky.ascDeg * Math.PI / 180;
        const ascLine = mkLine(c + Math.cos(aRad) * 112, c + Math.sin(aRad) * 112, c + Math.cos(aRad) * 178, c + Math.sin(aRad) * 178, MADDER_W, 1.1);
        svg.append(ascLine);
        fadeIn(ascLine, 2450);
        const ascLbl = mkText(c + Math.cos(aRad) * 98, c + Math.sin(aRad) * 98, "ASC", MADDER_W, "9px", "middle");
        ascLbl.style.fontFamily = "'Jost', sans-serif";
        ascLbl.setAttribute("letter-spacing", "1.5");
        svg.append(ascLbl);
        fadeIn(ascLbl, 2550);

        /* Gezegenler — bitişik olanları farklı yarıçapa dağıt */
        const sorted = [...sky.planets].sort((a, b) => a.degree - b.degree);
        let lastDeg = -999, tier = 0;
        sorted.forEach((p, idx) => {
            tier = (p.degree - lastDeg < 14) ? (tier + 1) % 3 : 0;
            lastDeg = p.degree;
            const pr = 152 - tier * 17;
            const pa = p.degree * Math.PI / 180;
            const px = c + Math.cos(pa) * pr, py = c + Math.sin(pa) * pr;

            const mark = mkLine(c + Math.cos(pa) * 174, c + Math.sin(pa) * 174, c + Math.cos(pa) * 178, c + Math.sin(pa) * 178, INK_W, 1);
            svg.append(mark);
            fadeIn(mark, 2100 + idx * 130);

            const pt = mkText(px, py, (PLANET_GLYPHS[p.name] || "✶") + "︎", INK_W, "17px", "middle");
            svg.append(pt);
            fadeIn(pt, 2150 + idx * 130);
        });

        /* Altyazı: tarih + yükselen */
        const cap = document.getElementById('wheel-caption');
        if (cap) {
            const now = new Date();
            const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
            cap.innerHTML = `Bugünün Gökyüzü — ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}<br>İstanbul'da şu an yükselen: <span style="color:var(--madder)">${signFromDegree(sky.ascDeg)}</span>`;
        }
    }

    host.append(svg);

    /* Çizim animasyonunu başlat */
    if (REDUCED_MOTION) {
        drawQueue.forEach(([el, , type]) => {
            if (type === 'stroke') { el.style.strokeDasharray = 'none'; el.style.strokeDashoffset = '0'; }
            else el.setAttribute('opacity', el.dataset.op || (type === 'fade-soft' ? '0.55' : '1'));
        });
        return;
    }
    requestAnimationFrame(() => {
        drawQueue.forEach(([el, delay, type]) => {
            setTimeout(() => {
                if (type === 'stroke') {
                    el.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    el.style.strokeDashoffset = '0';
                } else {
                    el.style.transition = 'opacity 0.9s ease';
                    el.setAttribute('opacity', type === 'fade-soft' ? '0.55' : '1');
                }
            }, delay);
        });
    });
}

/* ============================================================
   Masthead: gerçek ay evresini çizen mürekkep ikonu
   ============================================================ */

function moonIconSVG(date) {
    let phase;
    try { phase = Astronomy.MoonPhase(date); } // 0 yeni ay, 90 ilk dördün, 180 dolunay
    catch (e) { return ''; }

    const r = 7, cx = 9, cy = 9;
    const rad = phase * Math.PI / 180;
    const rx = Math.abs(Math.cos(rad)) * r;
    const waxing = phase <= 180;
    const gibbous = (1 - Math.cos(rad)) / 2 > 0.5;

    /* Aydınlık bölge: dış yarım daire + terminatör elipsi */
    const side = waxing ? 1 : 0; // büyüyen ay sağdan aydınlanır
    const term = gibbous ? (1 - side) : side;
    const lit = `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${side} ${cx} ${cy + r} A ${rx} ${r} 0 0 ${term} ${cx} ${cy - r} Z`;

    return `<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" style="vertical-align:-3px">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(38,34,25,0.15)"/>
        <path d="${lit}" fill="#8f7431"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#262219" stroke-width="0.8"/>
    </svg>`;
}

/* ============================================================
   Tarihçe: kaydırmayla akan mürekkep hattı
   ============================================================ */

function initTimelineRail() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const rail = document.createElement('div');
    rail.className = 'rail';
    const ink = document.createElement('div');
    ink.className = 'rail-ink';
    timeline.append(rail, ink);

    if (REDUCED_MOTION) { ink.style.height = '100%'; return; }

    let ticking = false;
    const update = () => {
        const rect = timeline.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.min(1, Math.max(0, (vh * 0.72 - rect.top) / rect.height));
        ink.style.height = (progress * 100).toFixed(2) + '%';
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
}

/* ============================================================
   Levhalar: müze vitrini (lightbox)
   ============================================================ */

function initPlateLightbox() {
    const modal = document.getElementById('plate-modal');
    if (!modal) return;
    const body = document.getElementById('plate-modal-body');

    document.querySelectorAll('#figure-row figure.plate').forEach(fig => {
        fig.setAttribute('tabindex', '0');
        fig.setAttribute('role', 'button');
        const open = () => {
            const img = fig.querySelector('img');
            const cap = fig.querySelector('figcaption');
            if (!img || img.naturalWidth === 0) return;
            body.innerHTML = '';
            const frame = document.createElement('div');
            frame.className = 'pm-frame';
            const big = document.createElement('img');
            big.src = img.currentSrc || img.src;
            big.alt = img.alt;
            frame.append(big);
            const capEl = document.createElement('figcaption');
            if (cap) capEl.innerHTML = cap.innerHTML;
            body.append(frame, capEl);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            logUserAction('Levha incelendi', { Levha: (cap?.querySelector('.plate-no')?.textContent || img.alt).trim() });
        };
        fig.addEventListener('click', open);
        fig.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    const close = () => { modal.classList.remove('active'); document.body.style.overflow = ''; };
    document.getElementById('plate-modal-close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ============================================================
   Burç kataloğu: Babil adları (MUL.APIN)
   ============================================================ */

function initSignCells() {
    document.querySelectorAll('.sign-cell').forEach(cell => {
        if (!cell.querySelector('.sign-babil')) return;
        cell.setAttribute('tabindex', '0');
        cell.setAttribute('role', 'button');
        const toggle = () => {
            const wasOpen = cell.classList.contains('open');
            document.querySelectorAll('.sign-cell.open').forEach(o => o.classList.remove('open'));
            if (!wasOpen) cell.classList.add('open');
        };
        cell.addEventListener('click', toggle);
        cell.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    });
}

/* ============================================================
   ASTRONOMİK HESAP (astronomy-engine)
   ============================================================ */

const CITY_COORDS = {
    "istanbul": { lat: 41.0082, lon: 28.9784 }, "ankara": { lat: 39.9334, lon: 32.8597 }, "izmir": { lat: 38.4237, lon: 27.1428 },
    "bursa": { lat: 40.1828, lon: 29.0667 }, "antalya": { lat: 36.8969, lon: 30.7133 }, "adana": { lat: 37.0000, lon: 35.3213 },
    "konya": { lat: 37.8746, lon: 32.4833 }, "gaziantep": { lat: 37.0662, lon: 37.3833 }, "kayseri": { lat: 38.7348, lon: 35.4663 },
    "eskişehir": { lat: 39.7767, lon: 30.5206 }, "trabzon": { lat: 41.0027, lon: 39.7168 }, "samsun": { lat: 41.2867, lon: 36.3300 }
};

function signFromDegree(deg) {
    return SIGNS[Math.floor(deg / 30) % 12];
}

function computeChart(date, time, location) {
    let locKey = location.toLowerCase().split(',')[0].trim();
    let coords = CITY_COORDS[locKey] || { lat: 41.0082, lon: 28.9784 };

    const d = new Date(`${date}T${time}:00+03:00`);
    const astroTime = new Astronomy.AstroTime(d);

    const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    const trNames = ['Güneş', 'Ay', 'Merkür', 'Venüs', 'Mars', 'Jüpiter', 'Satürn'];
    const planets = [];
    const elementCount = { "Ateş": 0, "Toprak": 0, "Hava": 0, "Su": 0 };
    const signElements = ["Ateş", "Toprak", "Hava", "Su", "Ateş", "Toprak", "Hava", "Su", "Ateş", "Toprak", "Hava", "Su"];

    let sunSign = "", moonSign = "";

    bodies.forEach((p, i) => {
        let lon = 0;
        try {
            const gv = Astronomy.GeoVector(p, astroTime, true);
            const ecl = Astronomy.Ecliptic(gv);
            lon = ecl.elon;
        } catch (err) {
            if (p === 'Moon') { lon = Astronomy.EclipticGeoMoon(astroTime).elon; }
        }
        if (isNaN(lon) || lon === undefined) lon = 0;

        const signIndex = Math.floor(lon / 30) % 12;
        if (p === 'Sun') sunSign = signFromDegree(lon);
        if (p === 'Moon') moonSign = signFromDegree(lon);
        elementCount[signElements[signIndex]] += 1;
        planets.push({ name: trNames[i], degree: lon });
    });

    /* Yükselen */
    const gmst = Astronomy.SiderealTime(astroTime);
    let lstDeg = (gmst * 15 + coords.lon) % 360;
    if (lstDeg < 0) lstDeg += 360;
    const epsDeg = 23.4392911;
    const rad = Math.PI / 180;
    const y = Math.cos(lstDeg * rad);
    const x = -(Math.sin(lstDeg * rad) * Math.cos(epsDeg * rad) + Math.tan(coords.lat * rad) * Math.sin(epsDeg * rad));
    let ascDeg = Math.atan2(y, x) / rad;
    ascDeg = ((ascDeg % 360) + 360) % 360;
    const ascSign = signFromDegree(ascDeg);

    const total = bodies.length;
    const elements = {};
    for (const el of Object.keys(elementCount)) elements[el] = Math.round((elementCount[el] / total) * 100);
    const dominant = Object.keys(elements).reduce((a, b) => elements[a] > elements[b] ? a : b);

    return { sunSign, moonSign, ascSign, elements, dominant, planets, ascDeg };
}

/* Dürüst ön okuma: geleneksel anahtar kelimelerle kısa özet */
function buildReadingText(firstName, c) {
    const sun = SIGN_LORE[c.sunSign], moon = SIGN_LORE[c.moonSign], asc = SIGN_LORE[c.ascSign];
    const p1 = `Güneş'iniz ${c.sunSign} burcunda. Gelenekte Güneş, yaşam gücünün ve kimliğin göstergesidir; ${c.sunSign}, ${sun.element.toLowerCase()} elementinden ${sun.mode.toLowerCase()} nitelikte bir burçtur ve ${sun.keys} ile tanımlanır. Gazete köşelerinde okuduğunuz "burcunuz" yalnızca bu tek yerleşimdir.`;
    const p2 = `Ay'ınız ${c.moonSign} burcunda. Ay, duygusal doğayı, ihtiyaçları ve alışkanlıkları anlatır; ${c.moonSign} Ay'ı iç dünyanıza ${moon.keys} temalarını taşır. Yükseleniniz ise ${c.ascSign} — doğum anında doğu ufkunda yükselen burç. Haritanın tümünü çerçeveleyen bu nokta, dışarıya dönük yüzünüzü ve hayata giriş biçiminizi tarif eder; ${asc.keys} burada ilk elden hissedilir.`;
    const p3 = `Haritanızda ağırlıklı element ${c.dominant.toLowerCase()} görünüyor. Ancak bu özet, gezegenlerin yalnızca burç yerleşimlerine dayanan bir ilk katmandır: evler, açılar ve dönemsel döngüler okunmadan bir harita yorumlanmış sayılmaz. Derinlemesine okuma için birebir seans gerekir.`;
    return [p1, p2, p3];
}

function initNatalForm() {
    const form = document.getElementById('natal-form');
    if (!form) return;

    const placeholder = document.getElementById('chart-placeholder');
    const svgContainer = document.getElementById('chart-svg-container');
    const reading = document.getElementById('reading');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('f-name').value.trim();
        const date = document.getElementById('f-date').value;
        const time = document.getElementById('f-time').value;
        const location = document.getElementById('f-location').value.trim();

        logUserAction('Harita hesaplandı', { İsim: name, Tarih: date, Saat: time, Yer: location });

        const btn = document.getElementById('natal-submit');
        btn.textContent = 'Hesaplanıyor…';
        btn.disabled = true;

        setTimeout(() => {
            try {
                const c = computeChart(date, time, location);
                const firstName = name.split(' ')[0];

                document.getElementById('reading-title').textContent = `${firstName} için Gökyüzü Ön Okuması`;
                setSummaryCell('val-sun', c.sunSign);
                setSummaryCell('val-moon', c.moonSign);
                setSummaryCell('val-asc', c.ascSign);

                /* Element çubukları */
                const order = ["Ateş", "Toprak", "Hava", "Su"];
                const romans = ["I", "II", "III", "IV"];
                const panel = document.getElementById('elements-panel-bars');
                panel.innerHTML = '';
                order.forEach((el, i) => {
                    const v = c.elements[el] || 0;
                    const bar = document.createElement('div');
                    bar.className = 'element-bar';
                    bar.innerHTML = `
                        <div class="eb-head">
                            <span class="eb-name">${romans[i]}. ${el}</span>
                            <span class="eb-val">%${v}</span>
                        </div>
                        <div class="eb-track"><div class="eb-fill" data-w="${v}"></div></div>`;
                    panel.appendChild(bar);
                });

                /* Ön okuma metni */
                const textWrap = document.getElementById('reading-text');
                textWrap.innerHTML = buildReadingText(firstName, c).map(p => `<p>${p}</p>`).join('');

                /* Seansa yönlendirme: kişisel WhatsApp bağlantısı */
                const waText = encodeURIComponent(`Merhaba, ben ${firstName}. Sitedeki haritamda Güneş ${c.sunSign}, Ay ${c.moonSign}, Yükselen ${c.ascSign} çıktı. Derinlemesine bir seans için bilgi almak istiyorum.`);
                const waBtn = document.getElementById('reading-wa');
                waBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

                /* Harita çizimi */
                renderChartSVG(c.planets, c.ascDeg);
                placeholder.style.display = 'none';
                svgContainer.style.display = 'block';

                reading.style.display = 'block';
                requestAnimationFrame(() => {
                    reading.querySelectorAll('.eb-fill').forEach(f => { f.style.width = f.dataset.w + '%'; });
                });
                setTimeout(() => reading.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
            } catch (error) {
                console.error("Hesaplama hatası:", error);
                alert("Hesaplama sırasında bir sorun oluştu. Lütfen bilgileri denetleyip tekrar deneyin.");
            } finally {
                btn.textContent = 'Haritayı Çiz';
                btn.disabled = false;
            }
        }, 400);
    });
}

function setSummaryCell(id, sign) {
    const el = document.getElementById(id);
    const glyph = SIGN_GLYPHS[SIGNS.indexOf(sign)] || '';
    el.innerHTML = `<span class="rs-glyph">${glyph}︎</span>${sign}`;
}

/* ---------- El yazması üslubunda harita çizimi ---------- */

const INK = "#262219";
const INK_SOFT = "rgba(38,34,25,0.45)";
const INK_FAINT = "rgba(38,34,25,0.18)";
const GOLD = "#8f7431";
const MADDER = "#93341f";
const LAPIS = "#2c4a6e";

function renderChartSVG(planetsData, ascDeg) {
    const container = document.getElementById('chart-svg-container');
    container.innerHTML = '';
    const w = 500, h = 500, cx = w / 2, cy = h / 2, r = 180;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const vs = "︎"; // emoji yerine metin glifleri

    /* Kenar süsü: köşelere küçük kızıl yıldızlar (el yazması üslubu) */
    const corners = [[26, 26], [w - 26, 26], [26, h - 26], [w - 26, h - 26]];
    corners.forEach(([x, y]) => {
        const star = mkText(x, y, "✳" + vs, MADDER, "12px", "middle");
        star.setAttribute("opacity", "0.7");
        svg.append(star);
    });

    /* Halkalar */
    svg.append(mkCircle(cx, cy, r + 46, INK_FAINT, "none", 1));
    svg.append(mkCircle(cx, cy, r + 20, INK, "none", 1.2));
    svg.append(mkCircle(cx, cy, r, INK_SOFT, "none", 0.7));
    svg.append(mkCircle(cx, cy, r - 50, INK_FAINT, "none", 0.7));

    /* Merkez: küçük güneş işareti */
    svg.append(mkCircle(cx, cy, 3, INK, INK, 0));
    svg.append(mkCircle(cx, cy, 8, INK_SOFT, "none", 0.7));

    /* 12 hane ve burç glifleri */
    for (let i = 0; i < 12; i++) {
        const a = i * 30;
        const aRad = a * Math.PI / 180;
        svg.append(mkLine(cx + Math.cos(aRad) * (r - 50), cy + Math.sin(aRad) * (r - 50), cx + Math.cos(aRad) * (r + 20), cy + Math.sin(aRad) * (r + 20), INK_FAINT, 0.8));

        for (let dg = 0; dg < 30; dg += 5) {
            const da = (a + dg) * Math.PI / 180;
            const tLen = dg % 10 === 0 ? 7 : 4;
            svg.append(mkLine(cx + Math.cos(da) * (r + 20), cy + Math.sin(da) * (r + 20), cx + Math.cos(da) * (r + 20 + tLen), cy + Math.sin(da) * (r + 20 + tLen), INK_SOFT, 0.6));
        }

        const ta = a + 15, tx = cx + Math.cos(ta * Math.PI / 180) * (r + 33), ty = cy + Math.sin(ta * Math.PI / 180) * (r + 33);
        const txt = mkText(tx, ty, SIGN_GLYPHS[i] + vs, GOLD, "17px", "middle");
        svg.append(txt);
    }

    /* Yükselen işareti */
    const ascRad = ascDeg * Math.PI / 180;
    svg.append(mkLine(cx + Math.cos(ascRad) * (r - 50), cy + Math.sin(ascRad) * (r - 50), cx + Math.cos(ascRad) * (r + 20), cy + Math.sin(ascRad) * (r + 20), MADDER, 1.1));
    const ascLbl = mkText(cx + Math.cos(ascRad) * (r - 64), cy + Math.sin(ascRad) * (r - 64), "ASC", MADDER, "9px", "middle");
    ascLbl.style.fontFamily = "'Jost', sans-serif";
    ascLbl.setAttribute("letter-spacing", "1.5");
    svg.append(ascLbl);

    /* Gezegenler */
    const plotted = [];
    planetsData.forEach((p, idx) => {
        const sym = PLANET_GLYPHS[p.name] || "✶";
        const aRad = p.degree * Math.PI / 180;
        const pr = r - 26 - (idx % 3) * 14; // üst üste binmeyi azaltan kademeli yarıçap
        const px = cx + Math.cos(aRad) * pr, py = cy + Math.sin(aRad) * pr;
        plotted.push({ x: px, y: py, a: p.degree });

        svg.append(mkLine(cx + Math.cos(aRad) * (r - 4), cy + Math.sin(aRad) * (r - 4), cx + Math.cos(aRad) * r, cy + Math.sin(aRad) * r, INK, 1));
        const pt = mkText(px, py, sym + vs, INK, "18px", "middle");
        svg.append(pt);
    });

    /* Açılar: üçgen lapis, kare kızıl, karşıt altın */
    for (let i = 0; i < plotted.length; i++) {
        for (let j = i + 1; j < plotted.length; j++) {
            let diff = Math.abs(plotted[i].a - plotted[j].a);
            if (diff > 180) diff = 360 - diff;
            let color = null;
            if (Math.abs(diff - 120) < 8) color = "rgba(44,74,110,0.4)";
            else if (Math.abs(diff - 90) < 8) color = "rgba(147,52,31,0.4)";
            else if (Math.abs(diff - 180) < 8) color = "rgba(143,116,49,0.5)";
            if (color) svg.append(mkLine(plotted[i].x, plotted[i].y, plotted[j].x, plotted[j].y, color, 0.8));
        }
    }

    container.append(svg);
}

function mkCircle(cx, cy, r, s, f, w) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    e.setAttribute("cx", cx); e.setAttribute("cy", cy); e.setAttribute("r", r);
    e.setAttribute("stroke", s); e.setAttribute("fill", f); e.setAttribute("stroke-width", w);
    return e;
}
function mkLine(x1, y1, x2, y2, s, w = 0.6) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", "line");
    e.setAttribute("x1", x1); e.setAttribute("y1", y1); e.setAttribute("x2", x2); e.setAttribute("y2", y2);
    e.setAttribute("stroke", s); e.setAttribute("stroke-width", w);
    return e;
}
function mkText(x, y, c, col, sz, a) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", "text");
    e.setAttribute("x", x); e.setAttribute("y", y);
    e.setAttribute("fill", col); e.setAttribute("font-size", sz); e.setAttribute("text-anchor", a);
    e.setAttribute("dominant-baseline", "middle");
    e.style.fontFamily = "'Cormorant Garamond', serif";
    e.textContent = c;
    return e;
}
