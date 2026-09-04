# ( AKADEMİ ADI ) — Yaratıcı Drama Akademisi (v3 "Animasyonu Abartalım")

Astroloji sitesinden tamamen bağımsız, tek sayfalık akademi sitesi. Bu branch
(`drama-site-v3`) kendi başına bir Vite projesidir; `main` ile ortak dosyası yoktur.
Sürümler: `drama-site` (v1 sade), `drama-site-v2` (sinematik), `drama-site-v3` (bu dal —
v2 + 30 ek sahne efekti, ses, sayfa geçişi).

Sayfa bir tiyatro gecesi gibi akar: salon ışıkları kısılır, üç vuruş, kamera sahneye ilerler,
perde ve tül açılır; her bölüm bir "Perde"dir ve **her kaydırmada bir şey olur**.

## Geliştirme

```bash
npm install
npm run dev       # geliştirme (fontlar public/fonts/ içine kopyalanır)
npm run build     # dist/ — önce eksik medya raporu, sonra yer tutucu sayımı
npm run preview   # dist/ önizleme
```

Sayfalar: `index.html` (ana sayfa), `landing.html` (reklam için menüsüz tek CTA, `noindex`),
`kvkk.html` (KVKK / veli onamı yer tutucuları, `noindex`).

### Debug yardımcıları (`?debug=1`)

```js
__drama.seek(2.8)          // açılış zaman çizelgesinde saniyeye git
__drama.finish()           // açılışı bitir
__drama.replay()           // açılışı yeniden oynat
__drama.jump('#takvim')    // bölüme anında kaydır
__drama.st('dolly', 0.5)   // bir ScrollTrigger'ı ilerleme değerine götür
__drama.ids() / pins()     // ScrollTrigger kimlikleri / pin'liler
```
`?debug=1&off=board,tilt` belirli modülleri kapatır (`off=all` hepsini) — performans ayıklama için.
Debug'da tüm scrub'lar gecikmesizdir (`SCRUB`), böylece ekran görüntüleri deterministiktir.

## Vercel'e bağlama (ikinci proje)

1. Vercel → **Add New Project** → aynı GitHub deposunu seçin.
2. **Production Branch** olarak `drama-site-v3` seçin (Settings → Git).
3. Framework: Vite (otomatik). Build `npm run build`, çıktı `dist`.
4. Alan adını bağlayın; `index.html` / `landing.html` içindeki `https://ALANADI.com/` canonical/OG adreslerini değiştirin.

## Sahne efektleri (v3)

| Bölüm | Efektler |
|---|---|
| Açılış | salon ışıkları kısılır, seyirci koltukları (foto veya siluet), üç vuruş, kamera sahneye ilerler, afiş kartı başlık, perde, tül, rampa ışıkları, toz; yeniden oynat düğmesi |
| Sahneye giriş | hero sabitlenir (masaüstü +110 %, mobil +70 %), kaydırdıkça zemin büyür, proscenium/perde dışarı açılır, sahne kenarı |
| Masthead | sahne başına lamba (ışık çubuğu), marka işareti kaydırma hızıyla parlar, ses düğmesi, hareket anahtarı |
| Program notu | öğeler raylardan gelir, MEB rozeti mühürlenir |
| Programlar | biletler gişeden yay çizerek gelir (MotionPath), "İlk ders ücretsiz" damgası, 3D eğim + parlama (dokunmatikte kaydırma hızı / Android cihaz eğimi), koçan gerçekten yırtılır, panel katlanarak açılır, görselde spot süpürmesi |
| Bölüm geçişi | koyu bölümlere bordo perde silmesi |
| Yöntem | maske çizilir → trajediye dönüşür, katharsis paragrafında kelime kelime okuma ışığı, altın jant ışığı gezer, figür 3D döner, koni okunan paragrafa bakar, raptiyeli notlar salınır, kıvılcımlar |
| Formatlar | kaydırmayla geçen spot yıkaması; ışık üstündeki kart yanar, "Yakında" nabız atar |
| Eğitmen | portre kemerinde mini perde, kulis fotoğrafı paralaksı, belge çerçevesi çizilir, mum mühür + mürekkep, altın parıltı |
| Gişe | Solari (split-flap) panosu — harf harf çevrilir; ekran okuyucu/kopyalama için özgün metin korunur; `board:update` olayı ile gerçek veri aynı efektle gelir; adımlar çizilir, numaralar damgalanır |
| SSS | öğeler sağ/soldan kayar, cevap açılırken ışık iner, "+" yaylanır |
| Final | salon ışıkları kısılır, tabela hızlanır, perde önce orta açıklığa gelir (CTA), sonra tamamen kapanır; amblem altın iplikle işlenir, marka adı belirir (masaüstünde sticky sahne) |
| Footer | fuaye avize bokeh'i, WhatsApp düğmesi |
| Site geneli | takip spotu (imleç / kaydırma), sayfalar arası perde geçişi (View Transitions), opt-in ses |

### Ses (opt-in)

Ses dosyası yoktur; her şey Web Audio ile sentezlenir (üç vuruş, perde, ışıklar, damga,
yırtılma, flap, mühür, süpürme). Kapalı başlar; masthead'deki düğme ile açılır ve tercih
`localStorage: akademi:sound` içinde saklanır. Tarayıcı politikası gereği ses ancak bir
etkileşimden sonra çalar: düğmeye basınca (hero görünüyorsa) açılış sesle yeniden oynar;
tekrar ziyarette ilk dokunuş/tuşla sessizce devreye girer.

### Erişilebilirlik ve performans

- OS "hareketi azalt" + kalıcı anahtar (`akademi:motion`): tüm dekor gizlenir, perde açık,
  pano düz tablo, sayfa geçişi atlanır. JS gelmezse `<head>` 5 sn içinde aynı duruma düşer.
- Klavye: atla bağlantısı, bilet/SSS `aria-expanded`, belge `<dialog>`, ses/hareket düğmeleri `aria-pressed`.
- Ölçüm (Playwright, Chromium): 0 konsol hatası; eager JS ≈ 70 kB gz, tembel chunk'lar
  (MorphSVG, MotionPath, ses) ≈ 9 kB; CSS ≈ 11 kB gz; ScrollTrigger 14; LCP ≈ 0.9 s (h1);
  CLS 0 (kaydırma dahil); mobil 4× CPU kısıtlamasında uzun kare oranı ≈ 6 %.
- Mobilde pahalı karışım/filtre/bulanıklıklar kapalıdır; parçacıklar 40/12, 30 fps, görünürken.

## Görseller

Site görseller yokken de eksiksiz görünür. Görselleri `src/data/media.json` listesindeki adlarla
`public/media/` içine koyun; `npm run check:media` eksikleri gösterir. Promptlar: **`ASSETS.md`**.
v3 için opsiyonel ek görseller: `salon-koltuklar-1920/1280.webp` (açılış salonu),
`doku-kadife-1024.webp` (kapalı perde dokusu), `sahne-arkasi-1600.webp` (eğitmen arka planı).

## Yayın öncesi doldurulacak yer tutucular

`npm run build` sonunda sayım yazdırılır: `( AKADEMİ ADI )`, `( BELGE NO )`, `( ŞEHİR )`,
`( ÖZGEÇMİŞ … )`, takvim satırları, `905000000000`, Instagram `#`, `kvkk.html` metinleri,
`https://ALANADI.com/`; gerçek portre ve belge taraması.

## Dosya yapısı

```
index.html · landing.html · kvkk.html · vite.config.js · ASSETS.md
public/   favicon.svg · og-drama.png · robots.txt · fonts/ · media/
scripts/  copy-fonts.mjs · check-media.mjs · check-placeholders.mjs
src/styles/ tokens · base · components · decor · scenes · fx (v3 efekt katmanı) · landing · kvkk
src/js/   main.js · landing.js · config · prefs · state · sfx · gsap · debug
          ui/     nav (ışık çubuğu, CTA) · tickets · faq · media · dialog · whatsapp · sound · soundEngine
          motion/ index (orkestra) · velocity · opening · dolly · spotlight · dust · particles · reveals
                  sceneLabels · notu · tickets · tilt · wipes · masks · formats · formatsWash · portrait
                  certificate · board · steps · faq · houseDim · marquee · finale · followSpot · landing
```
