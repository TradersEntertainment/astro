// wa.me bağlantıları: güvenli hedef, reklam kampanyası etiketi (utm_campaign / utm_content), tıklama olayı.
export function initWhatsApp() {
    let campaign = '';
    try {
        const p = new URLSearchParams(location.search);
        campaign = (p.get('utm_campaign') || p.get('utm_content') || '')
            .replace(/[^\w\- çğıöşüÇĞİÖŞÜ]/g, '').trim().slice(0, 40);
    } catch { /* yok */ }

    document.querySelectorAll('a[href^="https://wa.me/"]').forEach((a) => {
        a.target = '_blank';
        a.rel = 'noopener';
        if (campaign) {
            const tag = encodeURIComponent(`[Reklam: ${campaign}] `);
            a.href = a.href.replace(/(\?text=)/, `$1${tag}`);
        }
        a.addEventListener('click', () => {
            (window.dataLayer ||= []).push({ event: 'wa_click', page: location.pathname, campaign });
            document.dispatchEvent(new CustomEvent('wa:click', { detail: { href: a.href } }));
        });
    });
}
