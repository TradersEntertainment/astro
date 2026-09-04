# Görsel Varlıklar — Üretim Kılavuzu

Dekorun tamamı (perde, proscenium, rampa ışıkları, spot, toz, maskeler, biletler, tabela)
kodla çizilir; **insan içeren görseller** bu belgeye göre AI ile üretilir ve `public/media/`
içine konur. Görseller yokken site fallback kompozisyonlarıyla eksiksiz görünür; dosyalar
eklendiğinde otomatik devreye girer.

## Kurallar

- Çocuklar **jenerik**; arkadan, profilden veya geniş plan. Kameraya bakan yakın portre **yok**.
- Her çocuk sahnesinde kadrajda bir yetişkin eğitmen bulunur.
- Özlem **asla AI ile üretilmez** — gerçek portre kullanılır.
- AI görseller arayüzde "Temsili görsel" ibaresiyle gösterilir (kodda hazır).
- Gerçek, izinli atölye fotoğrafları gelirse aynı dosya adlarıyla AI görsellerin yerini alır.
- Belgesel-fotoğraf estetiği; karikatür, maske, kostüm, sahne makyajı, yazı/logo yok.

## Stil kilidi (her prompt'un sonuna aynen eklenir)

```
editorial documentary photograph, 35mm lens, f/2.8 shallow depth of field, warm tungsten stage key light from upper left, deep bordeaux and navy shadows, muted Kodak Portra colour grade, fine film grain, minimalist black-box studio with wooden floor and dark velvet backdrop, clean composition with negative space --style raw --s 50
```

Negatif (Midjourney `--no` / diğer araçlarda negatif prompt):

```
--no text, letters, signage, logos, watermarks, masks, face paint, clown makeup, costumes, glitter, cartoon, illustration, oversaturation, distorted hands, extra limbs, celebrities, real-person likeness, brand names
```

## Dosyalar

| Dosya (`public/media/`) | Nerede | Oran / boyut | Prompt (stil kilidi eklenir) |
|---|---|---|---|
| `hero-stage-1920.webp`, `-1280.webp`, `-768.webp` | Açılış, perde arkası | 16:9 — 1920/1280/768 px genişlik | `empty small black-box theatre stage seen from the audience, single warm spotlight pool on worn wooden floorboards, faint haze in the beam, dark navy velvet backdrop with subtle vertical folds, no people, no props, cinematic negative space --ar 16:9` |
| `hero-stage-portrait-1080.webp` | Açılış (mobil) | 3:4 — 1080×1440 | aynı prompt `--ar 3:4` |
| `cocuk-atolye-1600.webp`, `-1200`, `-800` | Çocuk & Genç bileti | 4:3 | `six children aged 7 to 10 standing in a loose circle playing a warm-up drama game, seen from behind and in profile, arms raised mid-gesture, a female adult instructor with her back to the camera at the far side of the circle, black-box studio with wooden floor, warm spotlight from above --ar 4:3` |
| `genc-atolye-1600.webp`, `-1200`, `-800` | 12–15 paneli (opsiyonel; şu an kullanılmıyor) | 4:3 | `five teenagers aged 12 to 15 in an improvisation exercise, one speaking in profile with an open-hand gesture, others listening seen from behind, adult facilitator at the edge of the frame, small studio stage, warm key light --ar 4:3` |
| `yetiskin-atolye-1600.webp`, `-1200`, `-800` | Yetişkin bileti | 4:3 | `four adults in pairs doing a two-person improvisation exercise in an evening drama workshop, seen from the side and behind, relaxed posture, practical tungsten lamps, dark velvet backdrop, wooden floor --ar 4:3` |
| `egitmenlik-1600.webp`, `-1200`, `-800` | Eğitmenlik bileti | 4:3 | `a semicircle of adult teacher trainees seated on wooden chairs with open blank notebooks, a facilitator standing in profile explaining with a calm gesture, drama studio, warm stage light, seen from behind the group --ar 4:3` |
| `landing-hero-1080.webp` | Reklam landing'i | 4:5 — 1080×1350 | `a single child aged about 9 seen from behind at three-quarter angle standing in a warm spotlight pool on a small wooden stage, storytelling gesture with open hands, dark navy velvet backdrop, cinematic negative space above --ar 4:5` |
| `cocuk-figur.webp` (opsiyonel) | Hero ön plan kesme | 3:4, alfa | `a single child aged about 9 seen from behind at three-quarter angle, storytelling gesture, full body, plain flat grey background, even soft light --ar 3:4` → arka plan kaldırılır, PNG→WebP alfa |
| `sahne-arkasi-1600.webp` (opsiyonel) | Eğitmen bölümü arka planı | 16:10 | `theatre backstage detail: coiled hemp ropes on a wooden rail, a stepladder, a single bare work lamp, dark velvet folds, no people --ar 16:10` |
| `doku-ahsap-2048.webp` (opsiyonel) | Sahne zemini dokusu | 2:1, döşenebilir | `old worn wooden stage floorboards texture, top-down, seamless tileable, warm brown tones, subtle scuffs --ar 2:1 --tile` |

## v3 için opsiyonel ek görseller

| Dosya | Yer | Prompt (stil kilidi + negatif eklenir) |
|---|---|---|
| `salon-koltuklar-1920.webp`, `-1280.webp` (16:9) | Açılışın ilk karesi: seyirci salonu (yoksa koltuk siluetleri) | `rows of empty red velvet theatre seats seen from the back of a dark auditorium, seats in soft-focus foreground, closed bordeaux stage curtain far away lit by a single warm spotlight, house lights dimming, no people --ar 16:9` |
| `doku-kadife-1024.webp` (1:1, döşenebilir) | Final tam kapanış / sayfa geçişi perdesi dokusu | `close-up of deep bordeaux velvet theatre curtain fabric with soft vertical pleats, warm side light catching the nap, seamless tileable texture, no people --ar 1:1 --tile` |
| `sahne-arkasi-1600.webp` (16:10) | Eğitmen bölümü paralaks arka planı | `theatre backstage detail: coiled hemp ropes on a wooden rail, a stepladder, a single bare work lamp, dark velvet folds, no people --ar 16:10` |

Opsiyonel videolar (sessiz, döngü, ≤ 1.5 MB, 1280×720 WebM/MP4; `prefers-reduced-motion`'da oynatılmaz):

| Dosya | Yer | Prompt (video aracı için) |
|---|---|---|
| `hero-haze-720.webm` (6–8 sn döngü) | Hero arka planı: spot içinde süzülen sis | `static camera, empty small black-box theatre stage, single warm spotlight beam from upper left, slow drifting stage haze and dust motes in the beam, dark velvet backdrop, no people, seamless loop, no camera movement, cinematic, 24fps` |
| `perde-sway-720.webm` (6 sn döngü) | Final kapalı perde: hafif dalgalanan kadife | `static close shot of a closed deep bordeaux velvet theatre curtain, pleats swaying very gently as if from a draft, warm side light, seamless loop, no camera movement, no people` |

## Dışa aktarma

- WebP, kalite 78–82; meta veriler silinir. Squoosh veya `sharp` ile boyutlandırın.
- `srcset` boyutları: bilet görselleri 800 / 1200 / 1600; hero 768 / 1280 / 1920 + portre 1080.
- Bütçe: hero ≤ 180 kB, bilet görselleri ≤ 90 kB, landing ≤ 120 kB.
- Dosya adları `src/data/media.json` ile birebir aynı olmalı; `npm run check:media` doğrular.

## Müşteriden gelecek (AI değil)

- MEB belge taraması (≥ 2000 px, düz, gölgesiz) → `belge-meb.webp` (3:4)
- Özlem portresi (1200×1500, nötr fon, gerçek fotoğraf) → `ozlem-portre-1200.webp`
- Marka adı (ve varsa logo), WhatsApp numarası, Instagram adresi, şehir, belge numarası
- Özgeçmiş metni, dönem takvimi satırları
- KVKK aydınlatma / veli açık rıza metinleri (avukat onaylı)
