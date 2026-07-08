# Yayına Alma Rehberi

Site statik bir Vite projesidir; Vercel veya Netlify'da ücretsiz barındırılır.

## Vercel (önerilen)

1. [vercel.com](https://vercel.com) → GitHub ile giriş → **Add New Project** → bu depoyu seçin.
2. Ayarlar otomatik algılanır (Framework: **Vite**, Build: `npm run build`, Output: `dist`). Değiştirmeden **Deploy** deyin.
3. **Settings → Environment Variables** altına Telegram bildirimleri için ekleyin:
   - `VITE_TG_TOKEN` — bot token'ı
   - `VITE_TG_CHAT_ID` — sohbet kimliği
   (Bunlar derleme sırasında gömülür; ekledikten sonra **Redeploy** gerekir.)
4. **Settings → Domains** → alan adını (ör. `ozlemastroloji.com`) bağlayın; DNS yönergelerini izleyin.

## Netlify (alternatif)

1. [netlify.com](https://netlify.com) → **Add new site → Import an existing project** → depo seçin.
2. Build: `npm run build`, Publish directory: `dist`.
3. Ortam değişkenleri: **Site settings → Environment variables** (yukarıdakiyle aynı adlar).

## Yayın sonrası kontrol listesi

- [ ] `index.html` içindeki `og:image` ve `twitter:image` değerlerini tam URL yapın:
  `/og-kart.png` → `https://ALANADINIZ.com/og-kart.png`
  (paylaşım kartları ancak tam URL ile çalışır) ve bir `og:url` etiketi ekleyin.
- [ ] WhatsApp numarasını güncelleyin: `main.js` içindeki `WHATSAPP_NUMBER` + HTML'deki `wa.me` bağlantıları + `hediye.html` alt bilgisi.
- [ ] Footer'daki Instagram bağlantısını gerçek profille değiştirin.
- [ ] Hakkında bölümündeki portreyi gerçek fotoğrafla değiştirin.
- [ ] Paylaşım kartını test edin: [opengraph.xyz](https://www.opengraph.xyz) veya WhatsApp'ta kendinize link atın.

## Dahili araçlar (sitede menüde görünmez)

- `/rapor.html` — seans sonrası PDF raporu: bilgileri girin, harita otomatik çizilir,
  metin alanlarına tıklayıp yazın, **Yazdır / PDF** ile kaydedin.
- `/hediye.html` — hediye sertifikası: alanları doldurun, yazdırın.

Her iki sayfa da `noindex` işaretlidir; arama motorlarına kapalıdır.
