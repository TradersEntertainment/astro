// dist/*.html içinde kalan yer tutucuları sayar — yayın öncesi kontrol listesi.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');
if (!existsSync(dist)) { console.log('[placeholders] dist yok'); process.exit(0); }

const tokens = ['( AKADEMİ ADI )', '( BELGE NO )', '( ŞEHİR )', '905000000000', 'href="#"', '( HUKUKİ METİN', '( TELEFON )', '( E-POSTA )', '( TARİH )'];
const files = readdirSync(dist).filter(f => f.endsWith('.html'));
console.log('[placeholders] yayın öncesi doldurulacaklar:');
for (const t of tokens) {
    let n = 0;
    for (const f of files) n += (readFileSync(resolve(dist, f), 'utf8').split(t).length - 1);
    if (n) console.log(`   ${String(n).padStart(3)} × ${t}`);
}
