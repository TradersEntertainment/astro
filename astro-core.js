/* ============================================================
   Özlem · Astroloji — paylaşılan astronomi çekirdeği
   index, rapor ve diğer sayfalar bu modülü kullanır.
   ============================================================ */

import * as Astronomy from 'astronomy-engine';

export const SIGNS = ["Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak", "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"];
export const SIGN_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
export const PLANET_GLYPHS = { "Güneş": "☉", "Ay": "☽", "Merkür": "☿", "Venüs": "♀", "Mars": "♂", "Jüpiter": "♃", "Satürn": "♄" };
export const MONTHS_TR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

/* Geleneksel burç anahtarları — ön okuma metinleri için */
export const SIGN_LORE = {
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

/* ---------- 81 il merkezi koordinatı ---------- */

export const CITIES = {
    adana: [37.00, 35.32, "Adana"], adiyaman: [37.76, 38.28, "Adıyaman"], afyonkarahisar: [38.76, 30.54, "Afyonkarahisar"],
    agri: [39.72, 43.05, "Ağrı"], amasya: [40.65, 35.83, "Amasya"], ankara: [39.93, 32.86, "Ankara"],
    antalya: [36.90, 30.71, "Antalya"], artvin: [41.18, 41.82, "Artvin"], aydin: [37.85, 27.84, "Aydın"],
    balikesir: [39.65, 27.89, "Balıkesir"], bilecik: [40.15, 29.98, "Bilecik"], bingol: [38.88, 40.50, "Bingöl"],
    bitlis: [38.40, 42.11, "Bitlis"], bolu: [40.74, 31.61, "Bolu"], burdur: [37.72, 30.29, "Burdur"],
    bursa: [40.18, 29.07, "Bursa"], canakkale: [40.15, 26.41, "Çanakkale"], cankiri: [40.60, 33.62, "Çankırı"],
    corum: [40.55, 34.95, "Çorum"], denizli: [37.77, 29.09, "Denizli"], diyarbakir: [37.91, 40.24, "Diyarbakır"],
    edirne: [41.68, 26.56, "Edirne"], elazig: [38.68, 39.22, "Elazığ"], erzincan: [39.75, 39.49, "Erzincan"],
    erzurum: [39.90, 41.27, "Erzurum"], eskisehir: [39.78, 30.52, "Eskişehir"], gaziantep: [37.07, 37.38, "Gaziantep"],
    giresun: [40.91, 38.39, "Giresun"], gumushane: [40.46, 39.48, "Gümüşhane"], hakkari: [37.57, 43.74, "Hakkâri"],
    hatay: [36.20, 36.16, "Hatay"], antakya: [36.20, 36.16, "Hatay"], isparta: [37.76, 30.55, "Isparta"],
    mersin: [36.80, 34.63, "Mersin"], istanbul: [41.01, 28.98, "İstanbul"], izmir: [38.42, 27.14, "İzmir"],
    kars: [40.60, 43.10, "Kars"], kastamonu: [41.38, 33.78, "Kastamonu"], kayseri: [38.73, 35.49, "Kayseri"],
    kirklareli: [41.74, 27.23, "Kırklareli"], kirsehir: [39.15, 34.16, "Kırşehir"], kocaeli: [40.77, 29.94, "Kocaeli"],
    izmit: [40.77, 29.94, "Kocaeli"], konya: [37.87, 32.48, "Konya"], kutahya: [39.42, 29.98, "Kütahya"],
    malatya: [38.35, 38.31, "Malatya"], manisa: [38.61, 27.43, "Manisa"], kahramanmaras: [37.58, 36.93, "Kahramanmaraş"],
    maras: [37.58, 36.93, "Kahramanmaraş"], mardin: [37.31, 40.74, "Mardin"], mugla: [37.22, 28.36, "Muğla"],
    mus: [38.75, 41.49, "Muş"], nevsehir: [38.62, 34.71, "Nevşehir"], nigde: [37.97, 34.68, "Niğde"],
    ordu: [40.98, 37.88, "Ordu"], rize: [41.02, 40.52, "Rize"], sakarya: [40.77, 30.40, "Sakarya"],
    adapazari: [40.77, 30.40, "Sakarya"], samsun: [41.29, 36.33, "Samsun"], siirt: [37.93, 41.94, "Siirt"],
    sinop: [42.03, 35.15, "Sinop"], sivas: [39.75, 37.02, "Sivas"], tekirdag: [40.98, 27.51, "Tekirdağ"],
    tokat: [40.31, 36.55, "Tokat"], trabzon: [41.00, 39.72, "Trabzon"], tunceli: [39.11, 39.55, "Tunceli"],
    sanliurfa: [37.16, 38.79, "Şanlıurfa"], urfa: [37.16, 38.79, "Şanlıurfa"], usak: [38.68, 29.41, "Uşak"],
    van: [38.49, 43.38, "Van"], yozgat: [39.82, 34.81, "Yozgat"], zonguldak: [41.45, 31.79, "Zonguldak"],
    aksaray: [38.37, 34.03, "Aksaray"], bayburt: [40.26, 40.22, "Bayburt"], karaman: [37.18, 33.22, "Karaman"],
    kirikkale: [39.85, 33.51, "Kırıkkale"], batman: [37.88, 41.13, "Batman"], sirnak: [37.52, 42.46, "Şırnak"],
    bartin: [41.64, 32.34, "Bartın"], ardahan: [41.11, 42.70, "Ardahan"], igdir: [39.92, 44.04, "Iğdır"],
    yalova: [40.65, 29.27, "Yalova"], karabuk: [41.20, 32.62, "Karabük"], kilis: [36.72, 37.12, "Kilis"],
    osmaniye: [37.07, 36.25, "Osmaniye"], duzce: [40.84, 31.16, "Düzce"]
};

/* Türkçe karakterleri katlayarak anahtar üret: "Şanlıurfa, TR" -> "sanliurfa" */
export function foldCity(input) {
    return (input || '')
        .split(',')[0]
        .toLocaleLowerCase('tr')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ı/g, 'i')
        .replace(/[^a-z]/g, '');
}

export function findCity(input) {
    const key = foldCity(input);
    const hit = CITIES[key];
    if (hit) return { lat: hit[0], lon: hit[1], name: hit[2], found: true };
    return { lat: 41.01, lon: 28.98, name: "İstanbul", found: false };
}

/* ---------- Temel hesaplar ---------- */

export function signFromDegree(deg) {
    return SIGNS[Math.floor(deg / 30) % 12];
}

function geoLongitude(body, astroTime) {
    let lon = 0;
    try { lon = Astronomy.Ecliptic(Astronomy.GeoVector(body, astroTime, true)).elon; }
    catch (e) { if (body === 'Moon') lon = Astronomy.EclipticGeoMoon(astroTime).elon; }
    return (isNaN(lon) || lon === undefined) ? 0 : lon;
}

export function ascendantDegree(astroTime, coords) {
    const gmst = Astronomy.SiderealTime(astroTime);
    let lstDeg = (gmst * 15 + coords.lon) % 360;
    if (lstDeg < 0) lstDeg += 360;
    const epsDeg = 23.4392911, rad = Math.PI / 180;
    const y = Math.cos(lstDeg * rad);
    const x = -(Math.sin(lstDeg * rad) * Math.cos(epsDeg * rad) + Math.tan(coords.lat * rad) * Math.sin(epsDeg * rad));
    let ascDeg = Math.atan2(y, x) / rad;
    return ((ascDeg % 360) + 360) % 360;
}

/* Doğum haritası: tarih (YYYY-MM-DD), saat (HH:MM), şehir metni */
export function computeChart(dateStr, timeStr, cityInput) {
    const city = findCity(cityInput);
    const d = new Date(`${dateStr}T${timeStr}:00+03:00`);
    const astroTime = new Astronomy.AstroTime(d);

    const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    const trNames = ['Güneş', 'Ay', 'Merkür', 'Venüs', 'Mars', 'Jüpiter', 'Satürn'];
    const planets = [];
    const elementCount = { "Ateş": 0, "Toprak": 0, "Hava": 0, "Su": 0 };
    const signElements = ["Ateş", "Toprak", "Hava", "Su", "Ateş", "Toprak", "Hava", "Su", "Ateş", "Toprak", "Hava", "Su"];

    let sunSign = "", moonSign = "";
    bodies.forEach((p, i) => {
        const lon = geoLongitude(p, astroTime);
        const signIndex = Math.floor(lon / 30) % 12;
        if (p === 'Sun') sunSign = signFromDegree(lon);
        if (p === 'Moon') moonSign = signFromDegree(lon);
        elementCount[signElements[signIndex]] += 1;
        planets.push({ name: trNames[i], degree: lon });
    });

    const ascDeg = ascendantDegree(astroTime, city);
    const ascSign = signFromDegree(ascDeg);

    const total = bodies.length;
    const elements = {};
    for (const el of Object.keys(elementCount)) elements[el] = Math.round((elementCount[el] / total) * 100);
    const dominant = Object.keys(elements).reduce((a, b) => elements[a] > elements[b] ? a : b);

    return { sunSign, moonSign, ascSign, elements, dominant, planets, ascDeg, city };
}

/* Şu anki gökyüzü (hero usturlabı vb. için) */
export function currentSky(date, coords) {
    const astroTime = new Astronomy.AstroTime(date);
    const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    const trNames = ['Güneş', 'Ay', 'Merkür', 'Venüs', 'Mars', 'Jüpiter', 'Satürn'];
    const planets = bodies.map((p, i) => ({ name: trNames[i], degree: geoLongitude(p, astroTime) }));
    return { planets, ascDeg: ascendantDegree(astroTime, coords) };
}

/* ---------- Ay evresi ---------- */

export function moonPhaseLabel(date) {
    let phase;
    try { phase = Astronomy.MoonPhase(new Astronomy.AstroTime(date)); }
    catch (e) { return ''; }
    const idx = Math.floor(((phase + 22.5) % 360) / 45);
    const names = ["Yeni Ay", "Büyüyen Hilal", "İlk Dördün", "Şişkin Ay", "Dolunay", "Küçülen Ay", "Son Dördün", "Balzamik Ay"];
    return names[idx];
}

export function moonIconSVG(date) {
    let phase;
    try { phase = Astronomy.MoonPhase(new Astronomy.AstroTime(date)); } // 0 yeni, 90 ilk dördün, 180 dolunay
    catch (e) { return ''; }

    const r = 7, cx = 9, cy = 9;
    const rad = phase * Math.PI / 180;
    const rx = Math.abs(Math.cos(rad)) * r;
    const waxing = phase <= 180;
    const gibbous = (1 - Math.cos(rad)) / 2 > 0.5;
    const side = waxing ? 1 : 0;
    const term = gibbous ? (1 - side) : side;
    const lit = `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${side} ${cx} ${cy + r} A ${rx} ${r} 0 0 ${term} ${cx} ${cy - r} Z`;

    return `<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" style="vertical-align:-3px">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(38,34,25,0.15)"/>
        <path d="${lit}" fill="#8f7431"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#262219" stroke-width="0.8"/>
    </svg>`;
}

/* ---------- Almanak: bu ayın gökyüzü takvimi ---------- */

const QUARTER_NAMES = ["Yeni Ay", "İlk Dördün", "Dolunay", "Son Dördün"];

export function monthAlmanac(year, monthIdx) {
    const events = [];
    const start = new Date(year, monthIdx, 1, 0, 0, 0);
    const end = new Date(year, monthIdx + 1, 1, 0, 0, 0);

    /* Ay evreleri */
    try {
        let mq = Astronomy.SearchMoonQuarter(new Astronomy.AstroTime(new Date(start.getTime() - 86400000)));
        for (let guard = 0; guard < 8 && mq && mq.time.date < end; guard++) {
            const d = mq.time.date;
            if (d >= start) {
                let detail = '';
                if (mq.quarter === 0 || mq.quarter === 2) {
                    const moonLon = geoLongitude('Moon', mq.time);
                    detail = `${signFromDegree(moonLon)} burcunda`;
                }
                events.push({ date: d, label: QUARTER_NAMES[mq.quarter], detail, kind: 'moon' });
            }
            mq = Astronomy.NextMoonQuarter(mq);
        }
    } catch (e) { console.error('Almanak (ay):', e); }

    /* Güneş burç değiştirmesi */
    try {
        const t0 = new Astronomy.AstroTime(start);
        const sunLon = geoLongitude('Sun', t0);
        const nextCusp = (Math.floor(sunLon / 30) + 1) * 30 % 360;
        const hit = Astronomy.SearchSunLongitude(nextCusp, t0, 40);
        if (hit && hit.date < end) {
            events.push({ date: hit.date, label: `Güneş ${signFromDegree(nextCusp + 1)} burcuna girer`, detail: '', kind: 'sun' });
        }
    } catch (e) { console.error('Almanak (güneş):', e); }

    /* Retrolar: Merkür, Venüs, Mars — günlük tarama */
    const retro = [];
    ['Mercury', 'Venus', 'Mars'].forEach((body, bi) => {
        const trName = ['Merkür', 'Venüs', 'Mars'][bi];
        try {
            const scanStart = new Date(start.getTime() - 45 * 86400000);
            const scanEnd = new Date(end.getTime() + 45 * 86400000);
            let prev = null, wasRetro = null, retroFrom = null;
            for (let t = scanStart.getTime(); t <= scanEnd.getTime(); t += 86400000) {
                const lon = geoLongitude(body, new Astronomy.AstroTime(new Date(t)));
                if (prev !== null) {
                    let dlon = lon - prev;
                    if (dlon > 180) dlon -= 360;
                    if (dlon < -180) dlon += 360;
                    const isRetro = dlon < 0;
                    if (wasRetro === false && isRetro) retroFrom = new Date(t);
                    if (wasRetro === true && !isRetro && retroFrom) {
                        retro.push({ name: trName, from: retroFrom, to: new Date(t - 86400000) });
                        retroFrom = null;
                    }
                    wasRetro = isRetro;
                }
                prev = lon;
            }
            if (retroFrom) retro.push({ name: trName, from: retroFrom, to: null });
        } catch (e) { console.error('Almanak (retro):', e); }
    });
    const monthRetros = retro.filter(r => r.from < end && (!r.to || r.to >= start));

    events.sort((a, b) => a.date - b.date);
    return { events, retros: monthRetros };
}

/* ---------- El yazması üslubunda harita SVG'si ---------- */

const INK = "#262219";
const INK_SOFT = "rgba(38,34,25,0.45)";
const INK_FAINT = "rgba(38,34,25,0.18)";
const GOLD = "#8f7431";
const MADDER = "#93341f";

export function mkCircle(cx, cy, r, s, f, w) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    e.setAttribute("cx", cx); e.setAttribute("cy", cy); e.setAttribute("r", r);
    e.setAttribute("stroke", s); e.setAttribute("fill", f); e.setAttribute("stroke-width", w);
    return e;
}
export function mkLine(x1, y1, x2, y2, s, w = 0.6) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", "line");
    e.setAttribute("x1", x1); e.setAttribute("y1", y1); e.setAttribute("x2", x2); e.setAttribute("y2", y2);
    e.setAttribute("stroke", s); e.setAttribute("stroke-width", w);
    return e;
}
export function mkText(x, y, c, col, sz, a) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", "text");
    e.setAttribute("x", x); e.setAttribute("y", y);
    e.setAttribute("fill", col); e.setAttribute("font-size", sz); e.setAttribute("text-anchor", a);
    e.setAttribute("dominant-baseline", "middle");
    e.style.fontFamily = "'Cormorant Garamond', serif";
    e.textContent = c;
    return e;
}

export function buildChartSVG(planetsData, ascDeg) {
    const w = 500, h = 500, cx = w / 2, cy = h / 2, r = 180;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const vs = "︎";

    const corners = [[26, 26], [w - 26, 26], [26, h - 26], [w - 26, h - 26]];
    corners.forEach(([x, y]) => {
        const star = mkText(x, y, "✳" + vs, MADDER, "12px", "middle");
        star.setAttribute("opacity", "0.7");
        svg.append(star);
    });

    svg.append(mkCircle(cx, cy, r + 46, INK_FAINT, "none", 1));
    svg.append(mkCircle(cx, cy, r + 20, INK, "none", 1.2));
    svg.append(mkCircle(cx, cy, r, INK_SOFT, "none", 0.7));
    svg.append(mkCircle(cx, cy, r - 50, INK_FAINT, "none", 0.7));
    svg.append(mkCircle(cx, cy, 3, INK, INK, 0));
    svg.append(mkCircle(cx, cy, 8, INK_SOFT, "none", 0.7));

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
        svg.append(mkText(tx, ty, SIGN_GLYPHS[i] + vs, GOLD, "17px", "middle"));
    }

    const ascRad = ascDeg * Math.PI / 180;
    svg.append(mkLine(cx + Math.cos(ascRad) * (r - 50), cy + Math.sin(ascRad) * (r - 50), cx + Math.cos(ascRad) * (r + 20), cy + Math.sin(ascRad) * (r + 20), MADDER, 1.1));
    const ascLbl = mkText(cx + Math.cos(ascRad) * (r - 64), cy + Math.sin(ascRad) * (r - 64), "ASC", MADDER, "9px", "middle");
    ascLbl.style.fontFamily = "'Jost', sans-serif";
    ascLbl.setAttribute("letter-spacing", "1.5");
    svg.append(ascLbl);

    const plotted = [];
    planetsData.forEach((p, idx) => {
        const sym = PLANET_GLYPHS[p.name] || "✶";
        const aRad = p.degree * Math.PI / 180;
        const pr = r - 26 - (idx % 3) * 14;
        const px = cx + Math.cos(aRad) * pr, py = cy + Math.sin(aRad) * pr;
        plotted.push({ x: px, y: py, a: p.degree });

        svg.append(mkLine(cx + Math.cos(aRad) * (r - 4), cy + Math.sin(aRad) * (r - 4), cx + Math.cos(aRad) * r, cy + Math.sin(aRad) * r, INK, 1));
        svg.append(mkText(px, py, sym + vs, INK, "18px", "middle"));
    });

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

    return svg;
}
