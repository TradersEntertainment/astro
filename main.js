/* ============================================================
   Özlem · Astroloji — ana sayfa etkileşim katmanı
   Astronomik hesaplar: ./astro-core.js
   ============================================================ */

import {
    SIGNS, SIGN_GLYPHS, PLANET_GLYPHS, SIGN_LORE, MONTHS_TR,
    signFromDegree, computeChart, currentSky,
    moonPhaseLabel, moonIconSVG, monthAlmanac,
    buildChartSVG, mkCircle, mkLine, mkText
} from './astro-core.js';

const WHATSAPP_NUMBER = "905000000000";
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/* ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    logUserAction('Siteye giriş');

    /* --- Masthead: tarih ve ay evresi --- */
    const now = new Date();
    const dateEl = document.getElementById('masthead-date');
    if (dateEl) dateEl.textContent = `${now.getDate()} ${MONTHS_TR[now.getMonth()]} ${now.getFullYear()}`;
    document.querySelectorAll('[data-moon-phase]').forEach(el => { el.textContent = moonPhaseLabel(now); });

    const moonIconHost = document.getElementById('moon-icon');
    if (moonIconHost) moonIconHost.innerHTML = moonIconSVG(now);

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
        if (img.complete && img.naturalWidth === 0 && img.src) hide();
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

    /* --- Modüller --- */
    initNatalForm();
    initZodiacWheel();
    initTimelineRail();
    initPlateLightbox();
    initSignCells();
    initAlmanac(now);
});

/* ============================================================
   ALMANAK — bu ayın gökyüzü takvimi (otomatik hesaplanır)
   ============================================================ */

function fmtDay(d) { return `${d.getDate()} ${MONTHS_TR[d.getMonth()]}`; }

function initAlmanac(now) {
    const host = document.getElementById('almanac-list');
    if (!host) return;

    const title = document.getElementById('almanac-month');
    if (title) title.textContent = `${MONTHS_TR[now.getMonth()]} ${now.getFullYear()}`;

    let data;
    try { data = monthAlmanac(now.getFullYear(), now.getMonth()); }
    catch (e) {
        console.error('Almanak hesaplanamadı:', e);
        host.innerHTML = '<p class="form-smallprint">Almanak şu anda hesaplanamıyor.</p>';
        return;
    }

    host.innerHTML = '';
    data.events.forEach(ev => {
        const row = document.createElement('div');
        row.className = 'almanac-row';
        const isToday = ev.date.getDate() === now.getDate() && ev.date.getMonth() === now.getMonth();
        row.innerHTML = `
            <span class="al-date">${fmtDay(ev.date)}${isToday ? ' <span class="al-today">✳&#xFE0E; bugün</span>' : ''}</span>
            <span class="al-event">${ev.label}</span>
            <span class="al-detail">${ev.detail || ''}</span>`;
        host.appendChild(row);
    });

    const retroHost = document.getElementById('almanac-retro');
    if (retroHost) {
        if (data.retros.length === 0) {
            retroHost.innerHTML = `<span class="al-ok">Bu ay Merkür, Venüs ve Mars düz seyirde — retro yok.</span>`;
        } else {
            retroHost.innerHTML = data.retros.map(r => {
                const to = r.to ? fmtDay(r.to) : 'ay sonunu aşıyor';
                return `<span class="al-retro">℞&#xFE0E; ${r.name} retrosu: ${fmtDay(r.from)} – ${to}</span>`;
            }).join('<br>');
        }
    }
}

/* ============================================================
   DOĞUM HARİTASI FORMU
   ============================================================ */

/* Dürüst ön okuma: geleneksel anahtar kelimelerle kısa özet */
function buildReadingText(firstName, c) {
    const sun = SIGN_LORE[c.sunSign], moon = SIGN_LORE[c.moonSign], asc = SIGN_LORE[c.ascSign];
    const p1 = `Güneş'iniz ${c.sunSign} burcunda. Gelenekte Güneş, yaşam gücünün ve kimliğin göstergesidir; ${c.sunSign}, ${sun.element.toLowerCase()} elementinden ${sun.mode.toLowerCase()} nitelikte bir burçtur ve ${sun.keys} ile tanımlanır. Gazete köşelerinde okuduğunuz "burcunuz" yalnızca bu tek yerleşimdir.`;
    const p2 = `Ay'ınız ${c.moonSign} burcunda. Ay, duygusal doğayı, ihtiyaçları ve alışkanlıkları anlatır; ${c.moonSign} Ay'ı iç dünyanıza ${moon.keys} temalarını taşır. Yükseleniniz ise ${c.ascSign} — doğum anında doğu ufkunda yükselen burç. Haritanın tümünü çerçeveleyen bu nokta, dışarıya dönük yüzünüzü ve hayata giriş biçiminizi tarif eder; ${asc.keys} burada ilk elden hissedilir.`;
    const p3 = `Haritanızda ağırlıklı element ${c.dominant.toLowerCase()} görünüyor. Ancak bu özet, gezegenlerin yalnızca burç yerleşimlerine dayanan bir ilk katmandır: evler, açılar ve dönemsel döngüler okunmadan bir harita yorumlanmış sayılmaz. Derinlemesine okuma için birebir seans gerekir.`;
    return [p1, p2, p3];
}

let lastReading = null; // story görseli için

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
                lastReading = { firstName, c };

                document.getElementById('reading-title').textContent = `${firstName} için Gökyüzü Ön Okuması`;
                setSummaryCell('val-sun', c.sunSign);
                setSummaryCell('val-moon', c.moonSign);
                setSummaryCell('val-asc', c.ascSign);

                /* Şehir bulunamadıysa dürüstçe belirt */
                const cityNote = document.getElementById('city-note');
                if (cityNote) {
                    cityNote.textContent = c.city.found
                        ? ''
                        : `"${location}" il listesinde bulunamadı; yükselen, İstanbul koordinatlarıyla hesaplandı. En yakın il merkezini yazarsanız sonuç kesinleşir.`;
                }

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
                document.getElementById('reading-wa').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

                /* Harita çizimi */
                svgContainer.innerHTML = '';
                svgContainer.append(buildChartSVG(c.planets, c.ascDeg));
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

    /* Story görseli indirme */
    const dlBtn = document.getElementById('story-download');
    if (dlBtn) {
        dlBtn.addEventListener('click', async () => {
            if (!lastReading) return;
            dlBtn.textContent = 'Hazırlanıyor…';
            try {
                await document.fonts.ready;
                await document.fonts.load('34px "Astro Symbols"', '✳♈').catch(() => {});
                const url = drawStoryImage(lastReading.firstName, lastReading.c);
                const a = document.createElement('a');
                a.href = url;
                a.download = `gokyuzu-portresi-${lastReading.firstName.toLocaleLowerCase('tr')}.png`;
                a.click();
                logUserAction('Story görseli indirildi', { İsim: lastReading.firstName });
            } catch (e) {
                console.error('Görsel oluşturulamadı:', e);
            }
            dlBtn.textContent = 'Görseli İndir';
        });
    }
}

function setSummaryCell(id, sign) {
    const el = document.getElementById(id);
    const glyph = SIGN_GLYPHS[SIGNS.indexOf(sign)] || '';
    el.innerHTML = `<span class="rs-glyph">${glyph}︎</span>${sign}`;
}

/* ============================================================
   STORY GÖRSELİ — 1080×1920 parşömen kartı (canvas)
   ============================================================ */

function drawStoryImage(firstName, c) {
    const W = 1080, H = 1920;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');

    const PAPER = '#f3ecdd', INK = '#262219', INK_SOFT = '#58503e',
          GOLD = '#8f7431', MADDER = '#93341f';

    /* Zemin + ince doku */
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.035;
    for (let i = 0; i < 2600; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? INK : GOLD;
        ctx.fillRect(Math.random() * W, Math.random() * H, 1.4, 1.4);
    }
    ctx.globalAlpha = 1;

    /* Çift çerçeve */
    ctx.strokeStyle = INK; ctx.lineWidth = 3;
    ctx.strokeRect(54, 54, W - 108, H - 108);
    ctx.strokeStyle = 'rgba(38,34,25,0.3)'; ctx.lineWidth = 1;
    ctx.strokeRect(74, 74, W - 148, H - 148);

    /* Köşe yıldızları */
    ctx.fillStyle = MADDER;
    ctx.font = '34px "Astro Symbols", "Cormorant Garamond", serif';
    ctx.textAlign = 'center';
    [[100, 116], [W - 100, 116], [100, H - 96], [W - 100, H - 96]].forEach(([x, y]) => ctx.fillText('✳', x, y));

    /* Üst başlık */
    ctx.fillStyle = INK;
    ctx.font = '400 46px "Jost", sans-serif';
    ctx.save();
    ctx.letterSpacing = '18px';
    ctx.fillText('( SİTE ADI )', W / 2, 210); // SİTE ADI: marka adı kesinleşince değiştirin
    ctx.restore();
    ctx.fillStyle = GOLD;
    ctx.font = '400 24px "Jost", sans-serif';
    ctx.fillText('A S T R O L O J İ  ·  D A N I Ş M A N L I K', W / 2, 262);

    /* Ayraç */
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(W / 2 - 90, 320); ctx.lineTo(W / 2 + 90, 320); ctx.stroke();

    /* Başlık */
    ctx.fillStyle = INK_SOFT;
    ctx.font = 'italic 42px "Cormorant Garamond", serif';
    ctx.fillText('Gökyüzü Portresi', W / 2, 420);
    ctx.fillStyle = INK;
    ctx.font = '600 88px "Cormorant Garamond", serif';
    ctx.fillText(firstName, W / 2, 530);

    /* Üç yerleşim */
    const rows = [
        ['Güneş', c.sunSign], ['Ay', c.moonSign], ['Yükselen', c.ascSign]
    ];
    rows.forEach(([label, sign], i) => {
        const y = 740 + i * 300;
        ctx.fillStyle = MADDER;
        ctx.font = '400 30px "Jost", sans-serif';
        ctx.save(); ctx.letterSpacing = '12px';
        ctx.fillText(label.toLocaleUpperCase('tr'), W / 2, y);
        ctx.restore();
        ctx.fillStyle = MADDER;
        ctx.font = '90px "Astro Symbols", "Cormorant Garamond", serif';
        ctx.fillText(SIGN_GLYPHS[SIGNS.indexOf(sign)] + '︎', W / 2 - 150, y + 120);
        ctx.fillStyle = INK;
        ctx.font = '500 96px "Cormorant Garamond", serif';
        ctx.textAlign = 'left';
        ctx.fillText(sign, W / 2 - 70, y + 122);
        ctx.textAlign = 'center';
        if (i < 2) {
            ctx.strokeStyle = 'rgba(38,34,25,0.18)';
            ctx.beginPath(); ctx.moveTo(W / 2 - 240, y + 200); ctx.lineTo(W / 2 + 240, y + 200); ctx.stroke();
        }
    });

    /* Alt kapanış */
    ctx.fillStyle = INK_SOFT;
    ctx.font = 'italic 34px "Cormorant Garamond", serif';
    ctx.fillText('Astroloji, burçlardan ibaret değildir.', W / 2, 1700);
    ctx.fillStyle = GOLD;
    ctx.font = '400 24px "Jost", sans-serif';
    ctx.save(); ctx.letterSpacing = '8px';
    ctx.fillText('DOĞUM HARİTANIZI ÇİZDİRİN', W / 2, 1762);
    ctx.restore();

    return cv.toDataURL('image/png');
}

/* ============================================================
   HERO: canlı gökyüzü usturlabı
   ============================================================ */

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

    const drawQueue = [];
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

    const rotor = document.createElementNS("http://www.w3.org/2000/svg", "g");
    rotor.setAttribute("class", "wheel-rotor");
    for (let d = 0; d < 360; d += 5) {
        const a = d * Math.PI / 180;
        const len = d % 30 === 0 ? 10 : (d % 10 === 0 ? 6 : 3.5);
        rotor.append(mkLine(c + Math.cos(a) * 238.5, c + Math.sin(a) * 238.5, c + Math.cos(a) * (238.5 + len), c + Math.sin(a) * (238.5 + len), d % 30 === 0 ? INK_SOFT_W : INK_FAINT_W, d % 30 === 0 ? 0.9 : 0.6));
    }
    svg.append(rotor);
    fadeIn(rotor, 700);

    const starPos = [[92, 120], [412, 96], [448, 300], [96, 396], [258, 62], [70, 258], [452, 190], [380, 440]];
    starPos.forEach(([x, y], i) => {
        const s = mkText(x, y, "✳︎", MADDER_W, "11px", "middle");
        s.setAttribute("opacity", "0");
        svg.append(s);
        drawQueue.push([s, 1900 + i * 110, 'fade-soft']);
    });

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

    let sky = null;
    try { sky = currentSky(new Date(), { lat: 41.0082, lon: 28.9784 }); } catch (e) { console.error('Gökyüzü hesabı:', e); }

    if (sky) {
        const aRad = sky.ascDeg * Math.PI / 180;
        const ascLine = mkLine(c + Math.cos(aRad) * 112, c + Math.sin(aRad) * 112, c + Math.cos(aRad) * 178, c + Math.sin(aRad) * 178, MADDER_W, 1.1);
        svg.append(ascLine);
        fadeIn(ascLine, 2450);
        const ascLbl = mkText(c + Math.cos(aRad) * 98, c + Math.sin(aRad) * 98, "ASC", MADDER_W, "9px", "middle");
        ascLbl.style.fontFamily = "'Jost', sans-serif";
        ascLbl.setAttribute("letter-spacing", "1.5");
        svg.append(ascLbl);
        fadeIn(ascLbl, 2550);

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

        const cap = document.getElementById('wheel-caption');
        if (cap) {
            const now = new Date();
            cap.innerHTML = `Bugünün Gökyüzü — ${now.getDate()} ${MONTHS_TR[now.getMonth()]} ${now.getFullYear()}<br>İstanbul'da şu an yükselen: <span style="color:var(--madder)">${signFromDegree(sky.ascDeg)}</span>`;
        }
    }

    host.append(svg);

    if (REDUCED_MOTION) {
        drawQueue.forEach(([el, , type]) => {
            if (type === 'stroke') { el.style.strokeDasharray = 'none'; el.style.strokeDashoffset = '0'; }
            else el.setAttribute('opacity', type === 'fade-soft' ? '0.55' : '1');
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
