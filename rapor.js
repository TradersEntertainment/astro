/* ============================================================
   Gökyüzü Raporu şablonu — dahili araç mantığı
   ============================================================ */

import { MONTHS_TR, computeChart, buildChartSVG } from './astro-core.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rapor-form');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('r-name').value.trim();
        const date = document.getElementById('r-date').value;
        const time = document.getElementById('r-time').value;
        const city = document.getElementById('r-city').value.trim();
        const session = document.getElementById('r-session').value;

        let c;
        try { c = computeChart(date, time, city); }
        catch (err) {
            console.error(err);
            alert('Hesaplama başarısız — bilgileri denetleyin.');
            return;
        }

        document.getElementById('rp-client').textContent = name;

        const d = new Date(`${date}T${time}:00`);
        document.getElementById('rp-birth').textContent =
            `${d.getDate()} ${MONTHS_TR[d.getMonth()]} ${d.getFullYear()} · ${time} · ${c.city.name}`;

        document.getElementById('rp-sun').textContent = c.sunSign;
        document.getElementById('rp-moon').textContent = c.moonSign;
        document.getElementById('rp-asc').textContent = c.ascSign;

        const chartHost = document.getElementById('rp-chart');
        chartHost.innerHTML = '';
        chartHost.append(buildChartSVG(c.planets, c.ascDeg));

        if (session) {
            const s = new Date(`${session}T12:00:00`);
            document.getElementById('rp-session-line').textContent =
                `Seans tarihi: ${s.getDate()} ${MONTHS_TR[s.getMonth()]} ${s.getFullYear()}`;
        }

        const note = document.getElementById('r-citynote');
        note.textContent = c.city.found ? '' : `"${city}" listede yok — İstanbul koordinatı kullanıldı.`;
    });
});
