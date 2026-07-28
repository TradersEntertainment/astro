# ( AKADEMİ ADI ) — Yaratıcı Drama Akademisi

Astroloji sitesinden tamamen bağımsız, tek sayfalık akademi sitesi.
Bu branch (`drama-site`) kendi başına bir Vite projesidir; ana branch'lerle
ortak dosyası yoktur.

## Geliştirme

```bash
npm install
npm run dev      # geliştirme
npm run build    # dist/ çıktısı
```

## Vercel'e bağlama (ikinci proje)

1. Vercel → **Add New Project** → aynı GitHub deposunu seçin.
2. **Production Branch** olarak `drama-site` seçin (Settings → Git).
3. Framework: Vite (otomatik algılanır). Build `npm run build`, çıktı `dist`.
4. Bu projeye kendi alan adını bağlayın (ör. `dramaakademi.com`).

Böylece aynı depodan iki bağımsız site yayınlanır: `main` → astroloji,
`drama-site` → drama akademisi.

## Yayın öncesi doldurulacak yer tutucular

- `( AKADEMİ ADI )` — marka adı (tüm dosyalarda aynı token)
- `( BELGE NO )` — MEB belge numarası + Eğitmen bölümüne belge görseli
- `( ÖZGEÇMİŞ ... )` — eğitmen özgeçmişi + gerçek portre
- `( ŞEHİR )`, takvim satırlarındaki `( gün/tarih/kişi )`
- `905000000000` — gerçek WhatsApp numarası (tüm `wa.me` bağlantıları)
- Footer'daki Instagram `#` bağlantısı ve KVKK/Veli Onamı metin sayfası
- `og:image`/`og:url` — yayında tam URL

## Sprint 2 (planlandı)

Instagram reklamları için menüsüz landing varyantı, Meta Pixel + çerez
onayı, KVKK/veli onam metinleri, story/OG şablon üretimi.
