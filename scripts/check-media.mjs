// Beklenen medya dosyalarını public/media ile karşılaştırır; eksikleri listeler (yalnızca uyarı).
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const expected = JSON.parse(readFileSync(resolve(root, 'src/data/media.json'), 'utf8'));
const missing = expected.filter(f => !existsSync(resolve(root, 'public/media', f)));

if (missing.length === 0) {
    console.log('[media] tüm görseller mevcut');
} else {
    console.warn(`[media] ${missing.length}/${expected.length} görsel eksik (site fallback ile yayınlanabilir):`);
    missing.forEach(f => console.warn('   - ' + f));
}
