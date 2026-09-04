// Fontsource woff2 dosyalarını sabit adlarla public/fonts/ altına kopyalar (preload için kararlı yol).
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'public/fonts');
mkdirSync(out, { recursive: true });

const files = [
    ['@fontsource/fraunces/files/fraunces-latin-600-normal.woff2', 'fraunces-600.woff2'],
    ['@fontsource/fraunces/files/fraunces-latin-ext-600-normal.woff2', 'fraunces-600-ext.woff2'],
    ['@fontsource/fraunces/files/fraunces-latin-600-italic.woff2', 'fraunces-600i.woff2'],
    ['@fontsource/fraunces/files/fraunces-latin-ext-600-italic.woff2', 'fraunces-600i-ext.woff2'],
    ['@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2', 'figtree-var.woff2'],
    ['@fontsource-variable/figtree/files/figtree-latin-ext-wght-normal.woff2', 'figtree-var-ext.woff2'],
];

let copied = 0;
for (const [src, dst] of files) {
    const from = resolve(root, 'node_modules', src);
    if (!existsSync(from)) { console.warn(`[fonts] eksik: ${src}`); continue; }
    copyFileSync(from, resolve(out, dst));
    copied++;
}
console.log(`[fonts] ${copied}/${files.length} dosya kopyalandı → public/fonts`);
