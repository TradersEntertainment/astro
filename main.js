const zodiacSymbols = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const planetSymbols = {Güneş:"☉",Ay:"☽",Merkür:"☿",Venüs:"♀",Mars:"♂",Jüpiter:"♃",Satürn:"♄",Uranüs:"♅",Neptün:"♆",Plüton:"♇"};

// --- Telegram Logger ---
const TG_CONFIG = {
    token: import.meta.env.VITE_TG_TOKEN,
    chatId: import.meta.env.VITE_TG_CHAT_ID
};

async function sendTelegramNotification(message) {
    if (!TG_CONFIG.token || !TG_CONFIG.chatId) return; 
    try {
        await fetch(`https://api.telegram.org/bot${TG_CONFIG.token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TG_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
    } catch (e) { console.error('TG Log Error:', e); }
}

let cachedUserData = null;

async function logUserAction(action, details = {}) {
    try {
        if (!cachedUserData) {
            const ipRes = await fetch('https://ipapi.co/json/').catch(() => null);
            cachedUserData = ipRes ? await ipRes.json() : { ip: 'Bilinmiyor' };
        }
        const ipData = cachedUserData;
        
        const timestamp = new Date().toLocaleString('tr-TR');
        const userAgent = navigator.userAgent;
        const screen = `${window.innerWidth}x${window.innerHeight}`;
        const ref = document.referrer || 'Direkt';
        
        // Cihaz ve Tarayıcı Tespiti
        const getDevice = () => {
            const ua = navigator.userAgent;
            if (ua.indexOf("iPhone") != -1) return "iPhone 📱";
            if (ua.indexOf("Android") != -1) return "Android 🤖";
            if (ua.indexOf("Windows") != -1) return "Windows 💻";
            if (ua.indexOf("Macintosh") != -1) return "Mac 🖥️";
            return "Bilinmiyor ❓";
        };

        let message = `<b>🌟 AstroCelestial Bildirimi</b>\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `<b>Eylem:</b> ${action}\n`;
        message += `<b>IP:</b> <code>${ipData.ip}</code>\n`;
        message += `<b>Konum:</b> ${ipData.city || ''} ${ipData.country_name || ''}\n`;
        message += `<b>Cihaz:</b> ${getDevice()}\n`;
        message += `<b>Ekran:</b> ${screen}\n`;
        
        if (Object.keys(details).length > 0) {
            message += `\n<b>📝 Detaylar:</b>\n`;
            for (const [key, value] of Object.entries(details)) {
                message += `• ${key}: <code>${value}</code>\n`;
            }
        }
        
        sendTelegramNotification(message);
    } catch (e) { console.error('Logging Error:', e); }
}

document.addEventListener('click', (e) => {
    const x = Math.round(e.pageX);
    const y = Math.round(e.pageY);
    
    // En yakın tıklanabilir elementi bul (button veya link)
    const interactiveEl = e.target.closest('button, a, .service-card, .blog-card, .theme-swatch');
    
    if (interactiveEl) {
        // Buton metnini veya başlığını al
        let label = interactiveEl.innerText.trim().split('\n')[0];
        if (!label && interactiveEl.getAttribute('aria-label')) label = interactiveEl.getAttribute('aria-label');
        if (!label) label = interactiveEl.tagName.toLowerCase();
        
        logUserAction('Etkileşim', { 
            Buton: label,
            Konum: `X:${x}, Y:${y}` 
        });
    } else {
        // Boş yere tıklandıysa sadece koordinat (Isı haritası için)
        logUserAction('Tıklama', { 
            Konum: `X:${x}, Y:${y}` 
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
  logUserAction('Siteye Giriş Yapıldı');
  // --- Loader ---
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 2200);

  // --- Dynamic Tab Title ---
  const originalTitle = document.title;
  window.addEventListener('blur', () => {
    const phases = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
    const phaseIdx = Math.floor((((new Date().getTime()/1000 - 947178840) / 86400) % 29.53) / 29.53 * 8) % 8;
    document.title = `Yıldızlar Sizi Bekliyor ${phases[phaseIdx]}...`;
  });
  window.addEventListener('focus', () => {
    document.title = originalTitle;
  });

  // --- Blog Side Panel ---


  const blogPanel = document.getElementById('blog-side-panel');
  const blogPanelClose = document.getElementById('blog-side-close');
  // Removed automatic popup to improve mobile UX as per user request
  // setTimeout(() => blogPanel.classList.add('visible'), 4000);

  // --- Blog Logic ---
  const blogPosts = {
    "pluto-kova": {
      title: "Plüton Kova Burcunda: Yeni Bir Çağın Başlangıcı",
      category: "Astroloji Eğitimi",
      content: `
        <p>Güneş sistemimizin en uzak ve en gizemli gezegeni Plüton, Kova burcuna geçiş yaparak yaklaşık 20 yıl sürecek yeni bir dönemi başlattı. Bu geçiş, sadece bireysel hayatlarımızı değil, tüm kolektif bilinci derinden sarsacak ve dönüştürecek bir güce sahip.</p>
        <p>Kova burcu; teknoloji, toplumsal özgürlükler, inovasyon ve kolektif hareketler ile ilişkilendirilir. Plüton ise ölüm, yeniden doğum ve köklü değişimleri temsil eder. Bu iki enerjinin birleşimi, bildiğimiz dünyanın sınırlarını zorlayan bir teknolojik devrim ve toplumsal uyanış vaat ediyor.</p>
        <blockquote>"Gelecek artık kapımızda değil, bizzat içimizde şekilleniyor."</blockquote>
        <p>Bu dönemde yapay zeka, uzay araştırmaları ve sürdürülebilir enerji gibi konularda inanılmaz sıçramalar bekleyebiliriz. Bireysel seviyede ise, kendi özgürlüğümüzü ilan etme ve topluma nasıl bir değer kattığımızı sorgulama vaktimiz geldi.</p>
      `
    },
    "yeni-ay-rituel": {
      title: "Yeni Ay Manifestasyon Ritüelleri",
      category: "Ay Döngüleri",
      content: `
        <p>Yeni Ay, gökyüzünün karanlığa gömüldüğü ancak en taze tohumların atıldığı andır. Astrolojik olarak niyetlerin, yeni başlangıçların ve manifestasyonların en güçlü olduğu zaman dilimidir.</p>
        <p>Bir Yeni Ay ritüeli gerçekleştirmek için ihtiyacınız olan en önemli şey, kalbinizden gelen net bir niyettir. İşte adım adım rehber:</p>
        <ul>
          <li><strong>Alanınızı Arındırın:</strong> Adaçayı veya tütsü ile bulunduğunuz ortamın enerjisini temizleyin.</li>
          <li><strong>Niyetinizi Yazın:</strong> Olmasını istediğiniz şeyleri, sanki zaten gerçekleşmiş gibi şimdiki zamanda bir kağıda aktarın.</li>
          <li><strong>Görselleştirin:</strong> Gözlerinizi kapatın ve o niyetin içindeki sizi, hissettiklerinizi en ince ayrıntısına kadar hayal edin.</li>
        </ul>
        <p>Unutmayın, gökyüzü sadece bir rehberdir; asıl güç sizin niyetinizin saflığında ve kararlılığındadır.</p>
      `
    },
    "venus-retro": {
      title: "Venüs Retrogradında Aşka Dair Bilmeniz Gerekenler",
      category: "İlişkiler",
      content: `
        <p>Aşkın ve değerlerin gezegeni Venüs geri hareketine başladığında, kalbimizin derinliklerindeki eski defterler yeniden açılır. Bu dönem, yeni bir ilişkiye başlamaktan ziyade, mevcut olanı veya geçmişten geleni şifalandırma vaktidir.</p>
        <p>Venüs retrosu sırasında sıkça karşılaşılan durumlar şunlardır:</p>
        <ul>
          <li>Eski sevgililerin aniden ortaya çıkması veya rüyalara girmesi.</li>
          <li>İlişkideki değer algısının ve özgüvenin sorgulanması.</li>
          <li>Estetik ve finansal konularda kararsızlıklar yaşanması.</li>
        </ul>
        <p>Bu süreci bir kriz değil, bir fırsat olarak görün. Gerçekten neyi hak ettiğinizi ve sevgi dilinizin ne olduğunu keşfetmek için muazzam bir içsel yolculuk dönemidir.</p>
      `
    },
    "saturn-donusu": {
      title: "Satürn Dönüşü: 29 Yaşında Hayatınız Neden Değişir?",
      category: "Gezegen Döngüleri",
      content: `
        <p>Satürn, Güneş'in etrafındaki yörüngesini yaklaşık 29.5 yılda tamamlar. Doğum haritanızdaki yerine geri döndüğünde, "Satürn Dönüşü" olarak adlandırılan bu dönem, hayatınızdaki en büyük dönüm noktalarından birini işaret eder.</p>
        <p>Bu dönemde genellikle şunlar yaşanır:</p>
        <ul>
          <li><strong>Kariyer Krizi:</strong> Gerçekten istediğiniz mesleği mi yapıyorsunuz, yoksa başkalarının beklentilerini mi karşılıyorsunuz?</li>
          <li><strong>İlişki Sorgulaması:</strong> Kim olduğunuzu bilen ve destekleyen insanlarla mı çevrilmisiniz?</li>
          <li><strong>Kimlik Dönüşümü:</strong> Artık gençlik maskenizi bırakıp gerçek kimliğinize adım atma zamanı.</li>
        </ul>
        <blockquote>"Satürn sizi cezalandırmaz — olgunlaştırır."</blockquote>
        <p>İlk Satürn Dönüşü 27-30 yaş arasında, ikincisi 56-60 yaş arasında gerçekleşir. Her biri, hayatınızın yeni bir bölümünün kapılarını açar.</p>
      `
    },
    "merkur-retro": {
      title: "Merkür Retrosu Gerçekte Ne Anlama Geliyor?",
      category: "Retro Dönemleri",
      content: `
        <p>Yılda yaklaşık üç kez yaşanan Merkür retrosu, astrolojinin en çok konuşulan ve en çok yanlış anlaşılan fenomenlerinden biridir. Merkür aslında geri gitmiyor — optik bir illüzyon sonucu Dünya'dan bakıldığında geri gidiyor gibi görünüyor.</p>
        <p>Ancak astrolojik etkileri son derece gerçektir:</p>
        <ul>
          <li><strong>İletişim Aksaklıkları:</strong> E-postalar kaybolur, mesajlar yanlış anlaşılır, sözleşmeler karışır.</li>
          <li><strong>Teknoloji Sorunları:</strong> Elektronik cihazlar beklenmedik şekilde arızalanabilir.</li>
          <li><strong>Geçmişten Gelen Temaslar:</strong> Eski arkadaşlar, eski projeler ve tamamlanmamış işler geri döner.</li>
        </ul>
        <p>Merkür retrosunu korkmak yerine, durup gözden geçirmek, yeniden planlamak ve tamamlanmamış işleri bitirmek için mükemmel bir fırsat olarak değerlendirebilirsiniz.</p>
      `
    },
    "ay-dugum": {
      title: "Ay Düğümleri ve Karmik Yolculuğunuz",
      category: "Karmik Astroloji",
      content: `
        <p>Ay'ın yörüngesinin Güneş'in ekliptik düzlemiyle kesiştiği iki nokta, Kuzey ve Güney Ay Düğümleri olarak adlandırılır. Bu noktalar, doğum haritanızdaki en derin karmik mesajları taşır.</p>
        <p><strong>Güney Düğüm (Ketu):</strong> Geçmiş yaşamlardan getirdiğiniz yetenekleri, alışkanlıkları ve konfor alanınızı temsil eder. Burası tanıdık ama artık büyümenizi engelleyen bölgedir.</p>
        <p><strong>Kuzey Düğüm (Rahu):</strong> Bu hayatta yönelmeniz gereken hedefi, ruhunuzun evrim yolunu gösterir. Başlangıçta rahatsız hissettirebilir, ama gerçek tatmin burada yatar.</p>
        <blockquote>"Güney Düğüm'ü bırakmak cesaret ister; Kuzey Düğüm'e yürümek ise bilgelik."</blockquote>
        <p>Ay düğümlerinizin burcunu ve evini bilmek, hayatınızdaki tekrarlayan kalıpları anlamanın ve kırmanın anahtarıdır.</p>
      `
    }
  };

  const blogModal = document.getElementById('blog-modal');
  const blogModalBody = document.getElementById('blog-modal-body');
  const blogModalClose = document.getElementById('blog-modal-close');

  function openBlog(id) {
    const post = blogPosts[id];
    if (post) {
      blogModalBody.innerHTML = `
        <span class="blog-category">${post.category}</span>
        <h2 class="serif modal-title">${post.title}</h2>
        <div class="modal-divider"></div>
        <div class="modal-text">${post.content}</div>
      `;
      blogModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  const blogPanelTrigger = document.getElementById('blog-panel-trigger');
  
  blogPanelClose.addEventListener('click', () => { 
    blogPanel.classList.remove('visible'); 
    blogPanel.classList.add('hidden');
    blogPanelTrigger.classList.add('visible');
  });

  blogPanelTrigger.addEventListener('click', () => {
    blogPanel.classList.remove('hidden');
    blogPanel.classList.add('visible');
    blogPanelTrigger.classList.remove('visible');
  });

  document.querySelectorAll('[data-blog-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBlog(btn.dataset.blogId);
    });
  });

  blogModalClose.addEventListener('click', () => {
    blogModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  document.querySelector('.whatsapp-float').addEventListener('click', () => {
    logUserAction('WhatsApp İletişim Butonuna Basıldı');
  });

  blogModal.addEventListener('click', (e) => {
    if (e.target === blogModal) {
      blogModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // --- Typewriter ---
  const title = "Yıldızların Fısıltısını Dinleyin";
  const el = document.getElementById('hero-title');
  let i = 0;
  function type() {
    if (i <= title.length) {
      el.innerHTML = title.substring(0, i) + '<span class="typewriter-cursor">|</span>';
      i++;
      setTimeout(type, 80);
    } else { el.innerHTML = title; }
  }
  setTimeout(type, 2500);

  // --- Moon Phase ---
  const now = new Date();
  const phases = ["🌑 Yeni Ay","🌒 Hilal","🌓 İlk Dördün","🌔 Şişkin Ay","🌕 Dolunay","🌖 Küçülen Ay","🌗 Son Dördün","🌘 Eski Hilal"];
  const daysSinceNew = ((now.getTime()/1000 - 947178840) / 86400) % 29.53;
  const phaseIdx = Math.floor((daysSinceNew / 29.53) * 8) % 8;
  document.getElementById('moon-phase-text').textContent = phases[phaseIdx];
  document.getElementById('moon-phase-icon').textContent = phases[phaseIdx].split(' ')[0];

  // --- Daily Date ---
  const months = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
  document.getElementById('daily-date').textContent = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  // --- Daily Quotes ---
  const quotes = [
    "Bugün Merkür ve Venüs'ün uyumu, beklediğiniz o önemli haberi getirebilir.",
    "Mars'ın enerjisi bugün cesaretinizi artırıyor. Ertelediğiniz adımı atmanın tam zamanı.",
    "Ay'ın Yengeç burcundaki geçişi, duygusal derinliğinizi ön plana çıkarıyor.",
    "Jüpiter'in koruyucu enerjisi bugün finansal konularda şansınızı artırabilir.",
    "Venüs-Neptün açısı, sanatsal ilhamınızı zirveye taşıyor. Yaratıcılığınıza güvenin.",
    "Satürn'ün disiplini bugün kararlılığınızı ödüllendiriyor. Sabırlı olun.",
    "Uranüs'ün sürpriz enerjisi beklenmedik bir fırsatla kapınızı çalabilir."
  ];
  document.getElementById('daily-text').textContent = `"${quotes[now.getDay()]}"`;

  // --- Custom Cursor ---
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animateCursor() {
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, input, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
  });

  // --- Header hide on scroll ---
  let lastScroll = 0;
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    const st = window.scrollY;
    document.getElementById('progress-bar').style.width = (st / (document.documentElement.scrollHeight - window.innerHeight)) * 100 + '%';
    if (st > lastScroll && st > 100) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }

    // Blog panel only stays visible near the top
    if (st > 300) {
      blogPanel.classList.add('scrolled');
    } else {
      blogPanel.classList.remove('scrolled');
    }
    
    lastScroll = st;
  });

  // --- Scroll Reveal ---
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) setTimeout(() => e.target.classList.add('revealed'), i * 100);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));

  // --- Animated Counters ---
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number').forEach(num => {
          const target = +num.dataset.target;
          const dur = 2000, step = target / (dur / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) { num.textContent = target.toLocaleString(); clearInterval(timer); }
            else num.textContent = Math.floor(current).toLocaleString();
          }, 16);
        });
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const statsEl = document.getElementById('stats');
  if (statsEl) counterObs.observe(statsEl);

  // --- Theme Picker ---
  const themeToggle = document.getElementById('theme-toggle');
  const themePanel = document.getElementById('theme-panel');
  const swatches = document.querySelectorAll('.theme-swatch');

  themeToggle.addEventListener('click', () => themePanel.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.theme-picker')) themePanel.classList.remove('open');
  });

  // Set default active
  swatches[0].classList.add('active');

  swatches.forEach(s => {
    s.addEventListener('click', () => {
      const theme = s.dataset.theme;
      document.documentElement.setAttribute('data-theme', theme);
      swatches.forEach(x => x.classList.remove('active'));
      s.classList.add('active');
      logUserAction('Tema Değiştirildi', { Tema: theme });
      // Smooth transition flash
      document.body.style.transition = 'background-color 0.6s ease, color 0.6s ease';
      setTimeout(() => document.body.style.transition = '', 700);
    });
  });

  // --- FAQ ---
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => q.parentElement.classList.toggle('active'));
  });

  // --- Form ---
  const form = document.getElementById('natal-form');
  const placeholder = document.getElementById('placeholder-text');
  const svgContainer = document.getElementById('chart-svg-container');

  let elementChartInstance = null;

  // --- Accurate Astronomical Engine (Using astronomy-engine) ---
  const cityCoords = {
      "istanbul": {lat: 41.0082, lon: 28.9784}, "ankara": {lat: 39.9334, lon: 32.8597}, "izmir": {lat: 38.4237, lon: 27.1428},
      "bursa": {lat: 40.1828, lon: 29.0667}, "antalya": {lat: 36.8969, lon: 30.7133}, "adana": {lat: 37.0000, lon: 35.3213},
      "konya": {lat: 37.8746, lon: 32.4833}, "gaziantep": {lat: 37.0662, lon: 37.3833}, "kayseri": {lat: 38.7348, lon: 35.4663},
      "eskişehir": {lat: 39.7767, lon: 30.5206}, "trabzon": {lat: 41.0027, lon: 39.7168}, "samsun": {lat: 41.2867, lon: 36.3300}
  };

  function getSignFromDegree(deg) {
      const signs = ["Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak", "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"];
      return signs[Math.floor(deg / 30) % 12];
  }

  function generateAstronomicalData(name, date, time, location) {
      // 1. Get Coordinates
      let locKey = location.toLowerCase().split(',')[0].trim();
      let coords = cityCoords[locKey];
      if (!coords) coords = {lat: 41.0082, lon: 28.9784}; // Fallback to Istanbul

      // 2. Setup Time (Assuming Turkey time UTC+3)
      // To ensure accuracy for Turkey users regardless of browser location:
      const d = new Date(`${date}T${time}:00+03:00`); 
      const astroTime = new Astronomy.AstroTime(d);
      const observer = new Astronomy.Observer(coords.lat, coords.lon, 0);

      // 3. Calculate Planets
      const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
      const trNames = ['Güneş', 'Ay', 'Merkür', 'Venüs', 'Mars', 'Jüpiter', 'Satürn'];
      const planetsData = [];
      const elementCount = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
      const signElements = ["Fire", "Earth", "Air", "Water", "Fire", "Earth", "Air", "Water", "Fire", "Earth", "Air", "Water"];

      let sunSign = "", moonSign = "";

      planets.forEach((p, i) => {
          let lon = 0;
          try {
              // We need GEOCENTRIC (apparent) coordinates for a birth chart.
              // Astronomy.GeoVector gives the vector from Earth to the body.
              // Astronomy.Ecliptic converts that vector to ecliptic longitude/latitude.
              const gv = Astronomy.GeoVector(p, astroTime, true);
              const ecl = Astronomy.Ecliptic(gv);
              lon = ecl.elon;
          } catch (err) {
              console.warn("Calculated fallback for " + p);
              // Fallback to simpler method if GeoVector fails for some reason
              if (p === 'Sun') {
                  const s = Astronomy.SunPosition(astroTime);
                  // SunPosition returns ecliptic coordinates directly in some versions, 
                  // but let's be safe and use its vector if it's there.
                  const secl = Astronomy.Ecliptic(s);
                  lon = secl.elon;
              } else if (p === 'Moon') {
                  const m = Astronomy.EclipticGeoMoon(astroTime);
                  lon = m.elon;
              }
          }

          if (isNaN(lon) || lon === undefined) lon = 0; // Final safety net

          const signIndex = Math.floor(lon / 30) % 12;
          
          if (p === 'Sun') sunSign = getSignFromDegree(lon);
          if (p === 'Moon') moonSign = getSignFromDegree(lon);
          
          elementCount[signElements[signIndex]] += 1;
          planetsData.push({ name: trNames[i], degree: lon });
      });

      // 4. Calculate Exact Ascendant
      const gmst = Astronomy.SiderealTime(astroTime); // hours
      let lstDeg = (gmst * 15 + coords.lon) % 360;
      if (lstDeg < 0) lstDeg += 360;

      // Obliquity of the ecliptic (constant approximation is perfectly fine for this)
      const epsDeg = 23.4392911;

      const rad = Math.PI / 180;
      const y = Math.cos(lstDeg * rad);
      const x = -(Math.sin(lstDeg * rad) * Math.cos(epsDeg * rad) + Math.tan(coords.lat * rad) * Math.sin(epsDeg * rad));
      
      let ascRad = Math.atan2(y, x);
      let ascDeg = ascRad / rad;
      ascDeg = ascDeg % 360;
      if (ascDeg < 0) ascDeg += 360;

      const ascSign = getSignFromDegree(ascDeg);

      // Elements %
      const total = planets.length;
      const elementsObj = {
          Fire: Math.round((elementCount.Fire / total) * 100),
          Earth: Math.round((elementCount.Earth / total) * 100),
          Air: Math.round((elementCount.Air / total) * 100),
          Water: Math.round((elementCount.Water / total) * 100)
      };
      const dominantElement = Object.keys(elementsObj).reduce((a, b) => elementsObj[a] > elementsObj[b] ? a : b);

      // Procedural Text Generation (Mock AI)
      const intros = [
          `Haritanız, ${dominantElement === 'Fire' ? 'ateşin dönüştürücü gücünü' : dominantElement === 'Earth' ? 'toprağın sağlam ve kalıcı doğasını' : dominantElement === 'Air' ? 'havanın zihinsel ve vizyoner enerjisini' : 'suyun derin sezgisel akışını'} vurgulayan eşsiz bir dizilime sahip.`,
          `Gökyüzü siz doğduğunuz an, özellikle ${dominantElement === 'Fire' ? 'vizyoner' : dominantElement === 'Earth' ? 'analitik' : dominantElement === 'Air' ? 'iletişim odaklı' : 'duygusal zeka merkezli'} bir potansiyeli aktive etmiş.`,
      ];
      
      const bodies = [
          `Güneş'in ${sunSign} burcundaki yerleşimi temel karakterinizi şekillendirirken, Yükselen ${ascSign} dış dünyaya sunduğunuz maskeyi ve ilk intibanızı belirliyor. Ay'ın ${moonSign} burcunda olması ise içsel dünyanızda, duygusal reflekslerinizde bambaşka bir derinlik yaratıyor.`,
          `${sunSign} enerjisiyle varoluşunuzu kanıtlarken, Yükselen ${ascSign} sizin hayata açılan kapınız. Bilinçaltınızı yöneten Ay ise ${moonSign} burcunda, rasyonel kararlarınızın ardındaki gerçek motivasyonu fısıldıyor.`
      ];

      const conclusions = [
          `Kariyer ve finansal konularda haritanız, stratejik düşünmeyi ve uzun vadeli planlamayı ödüllendiriyor. Mevcut gökyüzü transitleri, özellikle yakın çevrenizle olan iletişiminizde sınırlarınızı yeniden çizmenizi tavsiye ediyor.`,
          `Potansiyelinizin zirvesine ulaşmak için analitik yeteneklerinizle sezgilerinizi dengelemelisiniz. Yıldızlar, önümüzdeki dönemde finansal riskler almaktan ziyade, elinizdeki değerleri koruyup büyütmeye odaklanmanızı öneriyor.`
      ];

      // Use a simple seed for random text selection so it stays consistent for the user
      const seed = ascDeg + planetsData[0].degree;
      const rPick = (arr) => arr[Math.floor(seed) % arr.length];

      const analysisText = `${rPick(intros)}\n\n${rPick(bodies)}\n\n${rPick(conclusions)}`;

      return {
          summary: { sun: sunSign, moon: moonSign, ascendant: ascSign, dominant: dominantElement },
          elements: elementsObj,
          planets: planetsData,
          analysis: analysisText
      };
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;

    logUserAction('Harita Hesaplandı', { 
        İsim: name, 
        Tarih: date, 
        Saat: time, 
        Yer: location 
    });

    const btn = document.getElementById('submit-btn');
    btn.innerHTML = '<span>Kozmik Algoritma Çalışıyor...</span>';
    btn.disabled = true;

    // Simulate network delay for effect
    setTimeout(() => {
      try {
        const data = generateAstronomicalData(name, date, time, location);

        // 1. Update UI Cards
        const firstName = name.split(' ')[0];
        document.getElementById('story-title').textContent = `${firstName} İçin Kozmik Analiz Raporu`;
        document.getElementById('val-sun').textContent = data.summary.sun;
        document.getElementById('val-moon').textContent = data.summary.moon;
        document.getElementById('val-asc').textContent = data.summary.ascendant;
        document.getElementById('ai-text').textContent = data.analysis;

        // 2. Render Radar Chart
        const ctx = document.getElementById('elementChart').getContext('2d');
        if (elementChartInstance) elementChartInstance.destroy();
        elementChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Ateş', 'Toprak', 'Hava', 'Su'],
                datasets: [{
                    label: 'Element Dağılımı',
                    data: [data.elements.Fire, data.elements.Earth, data.elements.Air, data.elements.Water],
                    backgroundColor: 'rgba(197, 160, 89, 0.2)',
                    borderColor: 'rgba(197, 160, 89, 1)',
                    pointBackgroundColor: 'var(--star-white)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'var(--gold)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: 'var(--gold)', font: { family: 'serif', size: 14 } },
                        ticks: { display: false, max: 100, min: 0 }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });

        // 3. Render Custom SVG Chart
        generateChartWithRealData(name, data.planets);

        placeholder.style.display = 'none';
        svgContainer.style.display = 'block';
        svgContainer.style.opacity = '0';
        const storyDisplay = document.getElementById('story-display');
        storyDisplay.style.display = 'block';
        
        // Share Feature Implementation
        const shareBtn = document.getElementById('share-card-btn');
        if (shareBtn) {
          shareBtn.onclick = () => {
            const card = document.getElementById('story-display');
            const originalBtnText = shareBtn.innerHTML;
            shareBtn.innerHTML = '<span>Hazırlanıyor...</span>';
            
            html2canvas(card, {
              backgroundColor: '#0a0a14',
              scale: 2,
              logging: false,
              useCORS: true,
              windowWidth: 1200 // Ensure desktop layout for capture
            }).then(canvas => {
              const link = document.createElement('a');
              link.download = `AstroCelestial-Analiz-${firstName}.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
              shareBtn.innerHTML = originalBtnText;
            }).catch(err => {
              console.error("Capture error:", err);
              shareBtn.innerHTML = originalBtnText;
              alert("Görsel oluşturulurken bir hata oluştu.");
            });
          };
        }

        setTimeout(() => {
          storyDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        setTimeout(() => { svgContainer.style.transition = 'opacity 1s ease'; svgContainer.style.opacity = '1'; }, 100);

      } catch (error) {
        console.error("Cosmic Algorithm Error:", error);
        alert("Hesaplama sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      } finally {
        btn.innerHTML = '<span>Haritayı Çıkar</span>';
        btn.disabled = false;
      }
    }, 1200);
  });

  // --- Constellation Canvas ---
  initConstellation();
});

// === Constellation Canvas ===
function initConstellation() {
  const canvas = document.getElementById('constellation-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, stars = [], mouse = { x: -1000, y: -1000 };

  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  for (let i = 0; i < 120; i++) {
    stars.push({ x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.5+0.5, vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3 });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // Detect theme for color adaptation
    const theme = document.documentElement.getAttribute('data-theme');
    const isLight = (theme === 'cream');
    const starColor = isLight ? 'rgba(93, 73, 40, 0.5)' : 'rgba(197,160,89,0.4)';
    const lineColor = isLight ? [93, 73, 40] : [197,160,89];
    const mouseColor = isLight ? [70, 55, 30] : [226,201,141];

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
      if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;

      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = starColor; ctx.fill();

      // Connect nearby stars
      for (let j = i + 1; j < stars.length; j++) {
        const dx = s.x - stars[j].x, dy = s.y - stars[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(stars[j].x, stars[j].y);
          const alpha = isLight ? 0.2 : 0.1;
          ctx.strokeStyle = `rgba(${lineColor[0]},${lineColor[1]},${lineColor[2]},${alpha*(1-dist/120)})`; ctx.stroke();
        }
      }
      // Connect to mouse
      const dmx = s.x - mouse.x, dmy = s.y - mouse.y;
      const md = Math.sqrt(dmx*dmx + dmy*dmy);
      if (md < 200) {
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(mouse.x, mouse.y);
        const mAlpha = isLight ? 0.25 : 0.15;
        ctx.strokeStyle = `rgba(${mouseColor[0]},${mouseColor[1]},${mouseColor[2]},${mAlpha*(1-md/200)})`; ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// === Zodiac Sign Calculator ===
function getZodiacSign(date) {
  const d = new Date(date), m = d.getMonth()+1, day = d.getDate();
  if ((m==3&&day>=21)||(m==4&&day<=19)) return "Koç";
  if ((m==4&&day>=20)||(m==5&&day<=20)) return "Boğa";
  if ((m==5&&day>=21)||(m==6&&day<=20)) return "İkizler";
  if ((m==6&&day>=21)||(m==7&&day<=22)) return "Yengeç";
  if ((m==7&&day>=23)||(m==8&&day<=22)) return "Aslan";
  if ((m==8&&day>=23)||(m==9&&day<=22)) return "Başak";
  if ((m==9&&day>=23)||(m==10&&day<=22)) return "Terazi";
  if ((m==10&&day>=23)||(m==11&&day<=21)) return "Akrep";
  if ((m==11&&day>=22)||(m==12&&day<=21)) return "Yay";
  if ((m==12&&day>=22)||(m==1&&day<=19)) return "Oğlak";
  if ((m==1&&day>=20)||(m==2&&day<=18)) return "Kova";
  return "Balık";
}

// === Story Generator ===
function generateStory(name, date) {
  const sign = getZodiacSign(date);
  const content = document.getElementById('story-content');
  const stories = {
    "Koç":"Ateşin ilk kıvılcımı ruhunda parlıyor. Sen, engelleri aşmak ve yeni yollar açmak için doğmuş bir öncüsün.",
    "Boğa":"Toprağın dinginliği ve bereketini taşıyorsun. Hayatın güzelliklerini inşa etmek senin ruhsal misyonun.",
    "İkizler":"Gökyüzünün meraklı gezgini... Bilginin ve iletişimin efendisisin.",
    "Yengeç":"Ay'ın ışığı senin pusulan. Derin bir şefkat ve koruma içgüdüsüyle sarmalanmış bir ruhsun.",
    "Aslan":"Ruhunun güneşli tahtında parlıyorsun. Yaratıcılığın ve asaletin tüm dünyaya cömertçe sunuluyor.",
    "Başak":"Evrenin kusursuz düzenini arayan bir zanaatkarsın. Kaosu düzene dönüştürme yeteneğin eşsiz.",
    "Terazi":"Dengenin ve uyumun kutsal temsilcisi... Ruhunun aynasını başkalarında buluyorsun.",
    "Akrep":"Gecenin ve dönüşümün muhafızı... Her krizden küllerinden doğan bir Anka gibi çıkıyorsun.",
    "Yay":"Uzak ufukların ve kadim bilgeliğin peşinde bir ruh... Her deneyimi bir derse dönüştürüyorsun.",
    "Oğlak":"Zirvelerin sabırlı tırmanıcısı... Kaderini taşa kazıyan bir iradeye sahipsin.",
    "Kova":"Geleceğin fısıltılarını bugünden duyan bir vizyonersin.",
    "Balık":"Evrensel denizin rüyacısı... Şifacı ve sanatçı ruhunla bu dünyada bir rüya görüyorsun."
  };
  document.getElementById('story-content').innerHTML = `
    <h3 class="serif" style="color:var(--gold);font-size:2rem;margin-bottom:2rem;">Sevgili ${name}, Yıldızlar Senin İçin Konuşuyor...</h3>
    <p class="serif" style="font-size:1.3rem;font-style:italic;line-height:1.8;opacity:0.9;margin-bottom:3rem;">
      "${sign} burcunun kadim enerjisiyle doğduğun o kutsal anda gökyüzü sessizliğe büründü. ${stories[sign] || ''} Ancak bu hikaye sadece bir başlangıç. Haritandaki karmaşık açıların gizlediği daha derin sırlar var."
    </p>
    <div style="border-top:1px solid var(--glass-border);padding-top:2rem;">
      <p style="margin-bottom:1.5rem;opacity:0.7;">Kaderinin şifrelerini daha detaylı çözmek ister misin?</p>
      <a href="https://wa.me/905000000000?text=Merhaba,%20ben%20${encodeURIComponent(name)}.%20${encodeURIComponent(sign)}%20burcuyum%20ve%20haritamın%20detaylı%20hikayesini%20öğrenmek%20istiyorum." class="cta-button" target="_blank"><span>Kişiye Özel Hikayeni Tamamla</span></a>
    </div>`;
}

function generateChartWithRealData(name, planetsData) {
  const container = document.getElementById('chart-svg-container');
  container.innerHTML = '';
  const w=500,h=500,cx=w/2,cy=h/2,r=180;
  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("viewBox",`0 0 ${w} ${h}`);
  svg.setAttribute("id","chart-svg");
  
  const vs = "\uFE0E";

  // Background Star Field
  for(let i=0; i<80; i++) {
    const sx = Math.random()*w, sy = Math.random()*h, sr = Math.random()*0.8;
    svg.append(mkCircle(sx,sy,sr,"none","rgba(255,255,255,0.2)",0));
  }

  // Design elements
  svg.append(mkCircle(cx,cy,r+45,"rgba(197,160,89,0.1)","none",1)); // Outer boundary
  svg.append(mkCircle(cx,cy,r+20,"var(--gold)","none",2)); // Zodiac Ring
  svg.append(mkCircle(cx,cy,r-50,"rgba(197,160,89,0.2)","none",1)); // Inner Ring
  
  // Sun Burst in center
  const burst = document.createElementNS("http://www.w3.org/2000/svg","path");
  burst.setAttribute("d",`M ${cx-10} ${cy} L ${cx+10} ${cy} M ${cx} ${cy-10} L ${cx} ${cy+10}`);
  burst.setAttribute("stroke","var(--gold)"); burst.setAttribute("stroke-width","0.5"); svg.append(burst);
  svg.append(mkCircle(cx,cy,3,"var(--gold)","var(--gold)",0));

  // Draw 12 House Segments & Zodiac Symbols
  for (let i=0;i<12;i++) {
    const a = i*30; 
    const aRad = a*Math.PI/180;
    
    // House lines
    svg.append(mkLine(cx+Math.cos(aRad)*(r-50), cy+Math.sin(aRad)*(r-50), cx+Math.cos(aRad)*(r+20), cy+Math.sin(aRad)*(r+20), "rgba(197,160,89,0.3)"));
    
    // Degree Ticks
    for(let d=0; d<30; d+=2) {
      const da = (a + d) * Math.PI/180;
      const tLen = d%10===0 ? 8 : 4;
      svg.append(mkLine(cx+Math.cos(da)*(r+20), cy+Math.sin(da)*(r+20), cx+Math.cos(da)*(r+20+tLen), cy+Math.sin(da)*(r+20+tLen), "rgba(197,160,89,0.15)"));
    }

    // Zodiac Symbols
    const ta = a + 15, tx = cx + Math.cos(ta*Math.PI/180)*(r+4), ty = cy + Math.sin(ta*Math.PI/180)*(r+4);
    const txt = mkText(tx,ty,zodiacSymbols[i] + vs,"var(--gold)","22px","middle");
    txt.setAttribute("transform",`rotate(${ta+90},${tx},${ty})`);
    txt.style.fontWeight = "100";
    svg.append(txt);
  }

  const plottedPlanets = [];
  
  // Real Planet Data Mapping
  planetsData.forEach(p => {
    const sym = planetSymbols[p.name] || "⭐";
    const a = p.degree; // 0-360
    const aRad = a * Math.PI/180;
    const pr = r - 25 - (Math.random()*15); // Slight radius variation to avoid text overlap
    
    const px = cx + Math.cos(aRad)*pr, py = cy + Math.sin(aRad)*pr;
    plottedPlanets.push({name: p.name, x: px, y: py, a: a});
    
    const pt = mkText(px,py,sym + vs,"var(--star-white)","20px","middle");
    pt.style.filter = "drop-shadow(0 0 10px var(--gold))";
    svg.append(pt);
  }); // <-- Added missing closing bracket here
  
  // Elegant Aspects (Real)
  for(let i=0; i<plottedPlanets.length; i++) {
    for(let j=i+1; j<plottedPlanets.length; j++) {
      const diff = Math.abs(plottedPlanets[i].a - plottedPlanets[j].a);
      // Trine (120) Blue, Square (90) Red, Opposition (180) Gold
      if (Math.abs(diff - 120) < 8 || Math.abs(diff - 240) < 8) svg.append(mkLine(plottedPlanets[i].x,plottedPlanets[i].y,plottedPlanets[j].x,plottedPlanets[j].y,"rgba(100,150,255,0.2)"));
      if (Math.abs(diff - 90) < 8 || Math.abs(diff - 270) < 8) svg.append(mkLine(plottedPlanets[i].x,plottedPlanets[i].y,plottedPlanets[j].x,plottedPlanets[j].y,"rgba(255,100,100,0.2)"));
      if (Math.abs(diff - 180) < 8) svg.append(mkLine(plottedPlanets[i].x,plottedPlanets[i].y,plottedPlanets[j].x,plottedPlanets[j].y,"rgba(197,160,89,0.3)"));
    }
  }
  container.append(svg);
}

function mkCircle(cx,cy,r,s,f,w){const e=document.createElementNS("http://www.w3.org/2000/svg","circle");e.setAttribute("cx",cx);e.setAttribute("cy",cy);e.setAttribute("r",r);e.setAttribute("stroke",s);e.setAttribute("fill",f);e.setAttribute("stroke-width",w);return e;}
function mkLine(x1,y1,x2,y2,s){const e=document.createElementNS("http://www.w3.org/2000/svg","line");e.setAttribute("x1",x1);e.setAttribute("y1",y1);e.setAttribute("x2",x2);e.setAttribute("y2",y2);e.setAttribute("stroke",s);e.setAttribute("stroke-width","0.6");return e;}
function mkText(x,y,c,col,sz,a){const e=document.createElementNS("http://www.w3.org/2000/svg","text");e.setAttribute("x",x);e.setAttribute("y",y);e.setAttribute("fill",col);e.setAttribute("font-size",sz);e.setAttribute("text-anchor",a);e.setAttribute("alignment-baseline","middle");e.style.fontFamily="'Outfit', sans-serif";e.textContent=c;return e;}
