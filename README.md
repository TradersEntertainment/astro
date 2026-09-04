# ( AKADEMİ ADI ) — Yaratıcı Drama Akademisi (v2 "Tiyatro Gecesi")

Astroloji sitesinden tamamen bağımsız, tek sayfalık akademi sitesi. Bu branch
(`drama-site-v2`) kendi başına bir Vite projesidir; `main` ile ortak dosyası yoktur.
v1 sade sürüm `drama-site` branch'inde durur.

Sayfa bir tiyatro gecesi gibi akar: salon ışıkları kısılır, spot yanar, perde açılır;
her bölüm bir "Perde"dir (Programlar → Yöntem → Formatlar → Eğitmen → Gişe → SSS → Final).
Ana ürün çocuk & genç yaratıcı drama; yetişkin ve eğitmenlik hatları ikincil. Dönüşüm:
Instagram reklamı → site → **Ücretsiz Tanışma Dersi** (WhatsApp).

## Geliştirme

```bash
npm install
npm run dev       # geliştirme (fontlar public/fonts/ içine kopyalanır)
npm run build     # dist/ — önce eksik medya raporu, sonra yer tutucu sayımı
npm run preview   # dist/ önizleme
```

Sayfalar: `index.html` (ana sayfa), `landing.html` (reklam için menüsüz tek CTA, `noindex`),
`kvkk.html` (KVKK / veli onamı yer tutucuları, `noindex`).

`?debug=1` ile açılırsa `window.__drama.seek(saniye)` / `__drama.finish()` açılış zaman
çizelgesini kontrol eder (ekran görüntüsü ve inceleme için).

## Vercel'e bağlama (ikinci proje)

1. Vercel → **Add New Project** → aynı GitHub deposunu seçin.
2. **Production Branch** olarak `drama-site-v2` seçin (Settings → Git).
3. Framework: Vite (otomatik). Build `npm run build`, çıktı `dist`.
4. Bu projeye kendi alan adını bağlayın; `index.html` / `landing.html` içindeki
   `https://ALANADI.com/` canonical/OG adreslerini gerçek alan adıyla değiştirin.

Aynı depodan iki bağımsız site yayınlanır: `main` → astroloji, `drama-site-v2` → drama akademisi.

## Görseller

Site görseller **yokken de eksiksiz** görünür (her figürün tasarlanmış bir fallback'i var).
Görseller hazır olunca `public/media/` içine `src/data/media.json` listesindeki adlarla
kopyalayın; başka bir değişiklik gerekmez. Üretim promptları ve kurallar: **`ASSETS.md`**.
`npm run check:media` eksikleri listeler.

## Hareket ve erişilebilirlik

- GSAP (ScrollTrigger, SplitText, DrawSVG; MorphSVG tembel yüklenir). Toplam JS ≈ 66 kB gz.
- Açılış ilk kullanıcı girdisinde hızlanır; aynı oturumda tekrar ziyarette 2.5× hızlı oynar.
- OS "hareketi azalt" tercihi ve masthead/footer'daki anahtar (`localStorage: akademi:motion`)
  animasyonları kapatır; perde açık, tüm içerik görünür. JS yüklenmezse de içerik hiç kapanmaz.
- Klavye: atla bağlantısı, bilet/SSS `aria-expanded`, belge `<dialog>` (Esc + odak geri).

## Yayın öncesi doldurulacak yer tutucular

`npm run build` sonunda sayım yazdırılır.

- `( AKADEMİ ADI )` — marka adı (tüm sayfalarda aynı token)
- `( BELGE NO )` — MEB belge numarası; `public/media/belge-meb.webp` belge taraması
- `( ÖZGEÇMİŞ … )` — eğitmen özgeçmişi; `ozlem-portre-1200.webp` gerçek portre
- `( ŞEHİR )`, takvim satırlarındaki `( gün — saat )` / `( tarih )` / `( kişi )`
- `905000000000` — gerçek WhatsApp numarası (tüm `wa.me` bağlantıları)
- Footer/landing Instagram `href="#"`
- `kvkk.html` — `( HUKUKİ METİN … )` blokları avukat onaylı metinlerle, `( TELEFON )`, `( E-POSTA )`, `( TARİH )`
- `https://ALANADI.com/` — canonical / OG adresleri; `public/og-drama.png` marka adı girildikten sonra yeniden üretilebilir

## Dosya yapısı

```
index.html · landing.html · kvkk.html · vite.config.js · ASSETS.md
public/   favicon.svg · og-drama.png · robots.txt · fonts/ (build'de kopyalanır) · media/ (görseller)
scripts/  copy-fonts.mjs · check-media.mjs · check-placeholders.mjs
src/styles/ tokens · base · components · decor · scenes · landing · kvkk
src/js/   main.js · landing.js · config · prefs · state · gsap · debug
          ui/     nav · tickets · faq · media · dialog · whatsapp
          motion/ index (orkestra) · opening · parallax · spotlight · dust · reveals
                  sceneLabels · tickets · masks · formats · certificate · marquee · finale
```
