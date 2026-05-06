// main.js
const zodiacSigns = ["Koç","Boğa","İkizler","Yengeç","Aslan","Başak","Terazi","Akrep","Yay","Oğlak","Kova","Balık"];
const planetSymbols = {Güneş:"☉",Ay:"☽",Merkür:"☿",Venüs:"♀",Mars:"♂",Jüpiter:"♃",Satürn:"♄",Uranüs:"♅",Neptün:"♆",Plüton:"♇"};

document.addEventListener('DOMContentLoaded', () => {
  // --- Loader ---
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 2200);

  // --- Blog Side Panel ---
  const blogPanel = document.getElementById('blog-side-panel');
  const blogPanelClose = document.getElementById('blog-side-close');
  setTimeout(() => blogPanel.classList.add('visible'), 4000);

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
      blogPanel.classList.add('scrolled');
    } else {
      header.classList.remove('hidden');
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

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    const btn = document.getElementById('submit-btn');
    btn.innerHTML = '<span>Yıldızlar Hesaplanıyor...</span>';
    btn.disabled = true;

    setTimeout(() => {
      generateChart(name, date, time);
      generateStory(name, date);
      placeholder.style.display = 'none';
      svgContainer.style.display = 'block';
      svgContainer.style.opacity = '0';
      const sd = document.getElementById('story-display');
      sd.style.display = 'block';
      setTimeout(() => { sd.classList.add('revealed'); }, 50);
      setTimeout(() => { svgContainer.style.transition = 'opacity 1s ease'; svgContainer.style.opacity = '1'; }, 100);
      btn.innerHTML = '<span>Haritayı Çıkar</span>';
      btn.disabled = false;
    }, 1500);
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
  content.innerHTML = `
    <h3 class="serif" style="color:var(--gold);font-size:2rem;margin-bottom:2rem;">Sevgili ${name}, Yıldızlar Senin İçin Konuşuyor...</h3>
    <p class="serif" style="font-size:1.3rem;font-style:italic;line-height:1.8;opacity:0.9;margin-bottom:3rem;">
      "${sign} burcunun kadim enerjisiyle doğduğun o kutsal anda gökyüzü sessizliğe büründü. ${stories[sign] || ''} Ancak bu hikaye sadece bir başlangıç. Haritandaki karmaşık açıların gizlediği daha derin sırlar var."
    </p>
    <div style="border-top:1px solid var(--glass-border);padding-top:2rem;">
      <p style="margin-bottom:1.5rem;opacity:0.7;">Kaderinin şifrelerini daha detaylı çözmek ister misin?</p>
      <a href="https://wa.me/905000000000?text=Merhaba,%20ben%20${encodeURIComponent(name)}.%20${encodeURIComponent(sign)}%20burcuyum%20ve%20haritamın%20detaylı%20hikayesini%20öğrenmek%20istiyorum." class="cta-button" target="_blank"><span>Kişiye Özel Hikayeni Tamamla</span></a>
    </div>`;
}

// === Chart Generator ===
function generateChart(name, date, time) {
  const container = document.getElementById('chart-svg-container');
  container.innerHTML = '';
  const w=500,h=500,cx=w/2,cy=h/2,r=200;
  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("viewBox",`0 0 ${w} ${h}`); svg.setAttribute("id","chart-svg");

  // Defs
  const defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
  const grad = document.createElementNS("http://www.w3.org/2000/svg","radialGradient");
  grad.setAttribute("id","glow");
  const s1 = document.createElementNS("http://www.w3.org/2000/svg","stop");
  s1.setAttribute("offset","70%"); s1.setAttribute("stop-color","transparent");
  const s2 = document.createElementNS("http://www.w3.org/2000/svg","stop");
  s2.setAttribute("offset","100%"); s2.setAttribute("stop-color","rgba(197,160,89,0.1)");
  grad.append(s1,s2); defs.append(grad); svg.append(defs);
  svg.append(mkCircle(cx,cy,r+40,"none","url(#glow)",0));

  for (let i=0;i<12;i++) {
    const a=i*30;
    svg.append(mkLine(cx+Math.cos(a*Math.PI/180)*(r-60),cy+Math.sin(a*Math.PI/180)*(r-60),cx+Math.cos(a*Math.PI/180)*(r+30),cy+Math.sin(a*Math.PI/180)*(r+30),"rgba(197,160,89,0.4)"));
    for(let d=1;d<30;d+=5){const da=a+d;svg.append(mkLine(cx+Math.cos(da*Math.PI/180)*(r+20),cy+Math.sin(da*Math.PI/180)*(r+20),cx+Math.cos(da*Math.PI/180)*(r+25),cy+Math.sin(da*Math.PI/180)*(r+25),"rgba(197,160,89,0.15)"));}
    const ta=a+15,tx=cx+Math.cos(ta*Math.PI/180)*(r+5),ty=cy+Math.sin(ta*Math.PI/180)*(r+5);
    const txt=mkText(tx,ty,zodiacSigns[i],"var(--gold)","9px","middle");
    txt.setAttribute("transform",`rotate(${ta+90},${tx},${ty})`); svg.append(txt);
    const hx=cx+Math.cos(ta*Math.PI/180)*(r-50),hy=cy+Math.sin(ta*Math.PI/180)*(r-50);
    svg.append(mkText(hx,hy,(i+1).toString(),"rgba(255,255,255,0.25)","8px","middle"));
  }
  svg.append(mkCircle(cx,cy,r+30,"var(--gold)","none",1.5));
  svg.append(mkCircle(cx,cy,r-60,"rgba(197,160,89,0.3)","none",1));

  const seed=(new Date(date).getTime()+(parseInt(time.split(':')[0])*3600000))||12345;
  let pi=0;
  for(const [,sym] of Object.entries(planetSymbols)){
    const a=(seed*(pi+7))%360,pr=r-30;
    const px=cx+Math.cos(a*Math.PI/180)*pr,py=cy+Math.sin(a*Math.PI/180)*pr;
    const pt=mkText(px,py,sym,"var(--star-white)","18px","middle");
    pt.style.filter="drop-shadow(0 0 5px var(--gold))"; svg.append(pt);
    svg.append(mkLine(cx,cy,px,py,"rgba(255,255,255,0.04)"));
    pi++;
  }
  container.append(svg);
}

function mkCircle(cx,cy,r,s,f,w){const e=document.createElementNS("http://www.w3.org/2000/svg","circle");e.setAttribute("cx",cx);e.setAttribute("cy",cy);e.setAttribute("r",r);e.setAttribute("stroke",s);e.setAttribute("fill",f);e.setAttribute("stroke-width",w);return e;}
function mkLine(x1,y1,x2,y2,s){const e=document.createElementNS("http://www.w3.org/2000/svg","line");e.setAttribute("x1",x1);e.setAttribute("y1",y1);e.setAttribute("x2",x2);e.setAttribute("y2",y2);e.setAttribute("stroke",s);e.setAttribute("stroke-width","0.5");return e;}
function mkText(x,y,c,col,sz,a){const e=document.createElementNS("http://www.w3.org/2000/svg","text");e.setAttribute("x",x);e.setAttribute("y",y);e.setAttribute("fill",col);e.setAttribute("font-size",sz);e.setAttribute("text-anchor",a);e.setAttribute("alignment-baseline","middle");e.setAttribute("font-family","serif");e.textContent=c;return e;}
