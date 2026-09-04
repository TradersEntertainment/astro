// Eksik görselleri tasarlanmış fallback'e düşürür (kırık görsel simgesi asla görünmez).
export function initMedia() {
    const mark = (img) => img.closest('.media, [data-media]')?.classList.add('media--missing');
    document.querySelectorAll('.media img, [data-media] img').forEach((img) => {
        if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) mark(img);
        img.addEventListener('error', () => mark(img), { once: true });
    });
}
