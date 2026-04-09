<script setup>
useHead({ title: 'Hakkinda | MrML Lab', meta: [{ name: 'description', content: 'MrML Lab hakkinda -- kurulis hikayesi, misyon, vizyon ve degerler.' }] })
useScrollReveal()
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="page-hero">
      <div class="container">
        <div class="scroll-reveal slide-up">
          <span class="hero-eyebrow">Laboratuvarimiz</span>
          <h1 class="page-hero-title">MrML Lab <span class="accent-text">Hakkinda</span></h1>
          <p class="page-hero-sub">Mekatronigin, Robotik ve Makine Ogreniminin kesisiminde konumlanan arastirma merkezi.</p>
        </div>
      </div>
    </section>

    <!-- Misyon & Vizyon -->
    <section class="section about-section">
      <div class="container about-grid">
        <div class="about-text scroll-reveal slide-up">
          <h2>Misyonumuz</h2>
          <div class="section-divider"></div>
          <p>MrML Lab, termoelektrik enerji donusumu, mikro robotik ve hesaplamali biyomekanik alanlarinda insanligi ileriye tasiyacak temel ve uygulamali arastirmalar yurutmeye adanmistir.</p>
          <p>2016 yilinda kurulan laboratuvarimiz, TUBITAK, Avrupa Birligi ve sanayi isbirligi projeleriyle desteklenmekte; uluslararasi ortaklarla yuruttugu calismalar sayesinde kureselde taninan bir arastirma merkezi haline gelmektedir.</p>

          <h2 style="margin-top:40px;">Vizyonumuz</h2>
          <div class="section-divider"></div>
          <p>Dogadan ilham alan, hesaplamayla guclendirilen ve insanliga dokunan teknolojilerin kureselde referans noktasi olmak.</p>
        </div>
        <div class="about-visual scroll-reveal fade-in">
          <div class="abstract-illustration">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="circle circle-3"></div>
            <div class="connection-lines"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Degerler -->
    <section class="section" style="background:var(--bg-secondary);">
      <div class="container">
        <div class="section-header scroll-reveal slide-up">
          <h2>Degerlerimiz</h2>
          <p>Calismalarimiza rehberlik eden ilkeler</p>
        </div>
        <div class="research-grid" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); margin-top: 40px;">
          <div v-for="(deger, i) in degerler" :key="i" class="research-card scroll-reveal slide-up" :data-delay="i * 100">
            <div class="card-glow"></div>
            <div class="card-content">
              <div class="research-icon"><i :class="deger.icon"></i></div>
              <h3>{{ deger.title }}</h3>
              <p>{{ deger.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tarihce -->
    <section class="section">
      <div class="container">
        <div class="section-header scroll-reveal slide-up">
          <h2>Kilometre Taslari</h2>
        </div>
        <div class="timeline scroll-reveal fade-in">
          <div v-for="(item, i) in tarihce" :key="i" class="timeline-item">
            <div class="timeline-year">{{ item.yil }}</div>
            <div class="timeline-content">
              <h4>{{ item.baslik }}</h4>
              <p>{{ item.aciklama }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section join-section">
      <div class="container scroll-reveal slide-up">
        <div class="join-organic-block">
          <div class="join-content">
            <h2>Ekibimize katilmak ister misiniz?</h2>
            <p>Arastirma pozisyonlari, staj firsatlari ve isbirligi olanaklari icin basvurun.</p>
            <NuxtLink href="/basvur" class="btn btn-primary btn-large">Basvur <i class="fa-solid fa-arrow-right"></i></NuxtLink>
          </div>
          <div class="join-shapes"><div class="shape-blob shape-1"></div><div class="shape-blob shape-2"></div></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
const degerler = [
  { icon: 'fa-solid fa-flask', title: 'Bilimsel Titizlik', desc: 'Her bulgumuz rigorous metodoloji ve tekrarlanabilir deneylerle desteklenir.' },
  { icon: 'fa-solid fa-globe', title: 'Kuresel Etki', desc: 'Arastirmalarimizin toplumsal ve endustriyel yansimalari odak noktamizdir.' },
  { icon: 'fa-solid fa-users', title: 'Isbirlikci Yaklasim', desc: 'Disiplinlerarasi ekipler ve uluslararasi ortakliklar zenginligimizdir.' },
  { icon: 'fa-solid fa-seedling', title: 'Surdurulebilirlik', desc: 'Enerji ve cevre duyarliligi arastirma agendamizin temelindedir.' },
]
const tarihce = [
  { yil: '2016', baslik: 'Laboratuvarin Kurulusu', aciklama: 'Global Muhendislik Universitesi buyumesi kapsaminda MrML Lab resmi olarak kuruldu.' },
  { yil: '2018', baslik: 'Ilk TUBITAK Projesi', aciklama: 'Termoelektrik malzeme arastirmasina yonelik ilk buyuk olcekli proje fonlandi.' },
  { yil: '2020', baslik: 'Avrupa Isbirligi', aciklama: 'TU Delft ve ETH Zurich ile ilk ortak arastirma protokolleri imzalandi.' },
  { yil: '2022', baslik: 'Science Robotics Yayini', aciklama: 'Mikro robot platformu calismasimiz Science Robotics dergisinde yayimlandi.' },
  { yil: '2024', baslik: 'AB Horizon Europe Fonu', aciklama: '2.4 milyon Euro fonla desteklenen buyuk olcekli mikro robotik projesi basladi.' },
]
</script>

<style scoped>
.page-hero { padding: 140px 0 80px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.08) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.page-hero-title { font-size: clamp(36px, 5vw, 60px); font-weight: 800; margin: 12px 0; line-height: 1.1; }
.page-hero-sub { color: var(--text-muted); font-size: 18px; max-width: 540px; }
.timeline { position: relative; padding-left: 40px; }
.timeline::before { content: ''; position: absolute; left: 12px; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, var(--gold), transparent); }
.timeline-item { position: relative; margin-bottom: 40px; }
.timeline-item::before { content: ''; position: absolute; left: -34px; top: 6px; width: 12px; height: 12px; border-radius: 50%; background: var(--gold); }
.timeline-year { font-size: 12px; font-weight: 700; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
.timeline-content h4 { font-size: 17px; font-weight: 600; margin-bottom: 6px; }
.timeline-content p { color: var(--text-muted); font-size: 14px; }
</style>
