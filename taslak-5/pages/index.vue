<script setup>
useScrollReveal()
useHead({ title: 'MrML Lab | Mekatronik, Robotik ve Makine Ogrenimi Laboratuvari', meta: [{ name: 'description', content: 'MrML Lab -- hesaplamali tip, mekatronik ve termoelektrik alanlarda sinir otesi arastirma laboratuvari.' }] })

const heroCanvas = ref(null)
const projectsTrack = ref(null)

const { data: researchAreas } = await useAsyncData('home-research', () =>
  $fetch('/api/research-areas').catch(() => [])
)
const { data: featuredProjects } = await useAsyncData('home-projects', () =>
  $fetch('/api/projects').then(p => p.filter(x => x.is_featured).slice(0, 4)).catch(() => [])
)
const { data: featuredPubs } = await useAsyncData('home-pubs', () =>
  $fetch('/api/publications').then(p => p.filter(x => x.is_featured).slice(0, 3)).catch(() => [])
)
const { data: latestNews } = await useAsyncData('home-news', () =>
  $fetch('/api/news').then(n => n.filter(x => x.status === 'published').slice(0, 3)).catch(() => [])
)
const { data: members } = await useAsyncData('home-members', () =>
  $fetch('/api/members').then(m => m.slice(0, 6)).catch(() => [])
)

onMounted(() => {
  initHeroCanvas()
})

function initHeroCanvas() {
  const canvas = heroCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let width = canvas.width = window.innerWidth
  let height = canvas.height = window.innerHeight
  const particles = []
  const count = Math.min(Math.floor(width / 10), 150)

  class Particle {
    constructor() {
      this.x = Math.random() * width
      this.y = Math.random() * height
      this.size = Math.random() * 2 + 0.5
      this.speedX = Math.random() - 0.5
      this.speedY = Math.random() - 0.5
      this.color = Math.random() > 0.8 ? 'rgba(198,151,73,0.4)' : 'rgba(245,245,245,0.2)'
    }
    update() {
      this.x += this.speedX; this.y += this.speedY
      if (this.x > width) this.x = 0; if (this.x < 0) this.x = width
      if (this.y > height) this.y = 0; if (this.y < 0) this.y = height
    }
    draw() {
      ctx.fillStyle = this.color
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill()
    }
  }
  for (let i = 0; i < count; i++) particles.push(new Particle())

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 120) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(198,151,73,${0.1 - d / 1200})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
  }

  let rafId
  function animate() {
    ctx.clearRect(0, 0, width, height)
    particles.forEach(p => { p.update(); p.draw() })
    drawConnections()
    rafId = requestAnimationFrame(animate)
  }
  animate()

  const onResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight }
  window.addEventListener('resize', onResize)
  onUnmounted(() => { cancelAnimationFrame(rafId); window.removeEventListener('resize', onResize) })
}

function scrollProjects(dir) {
  const el = projectsTrack.value?.parentElement
  if (el) el.scrollBy({ left: dir * 480, behavior: 'smooth' })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const categoryLabels = { general: 'Genel', award: 'Odul', event: 'Etkinlik', publication: 'Yayin', announcement: 'Duyuru' }
</script>

<template>
  <div>
    <!-- HERO -->
    <header id="hero" class="section hero-section">
      <canvas ref="heroCanvas" id="hero-canvas"></canvas>
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <span class="hero-eyebrow">Global Muhendislik Universitesi</span>
        <h1 class="hero-title">
          Mekatronik, Robotik ve<br>
          <span class="accent-text">Makine Ogrenimi</span> Laboratuvari
        </h1>
        <p class="hero-subtitle">
          Termoelektrik enerji donusumu, mikro robotik ve biyomekanik alanlarda sinir otesi arastirmalar yurutuyor; gelecege yonelik teknolojiler gelistiriyoruz.
        </p>
        <div class="hero-ctas">
          <NuxtLink href="/arastirmalar" class="btn btn-primary">Arastirmalarimiz <i class="fa-solid fa-arrow-right"></i></NuxtLink>
          <NuxtLink href="/ekip" class="btn btn-secondary">Ekibimiz</NuxtLink>
        </div>
      </div>
      <div class="scroll-indicator">
        <div class="mouse"><div class="wheel"></div></div>
        <span>Asagi Kaydir</span>
      </div>
    </header>

    <!-- LAB INTRO -->
    <section id="hakkinda" class="section about-section">
      <div class="container about-grid">
        <div class="about-text scroll-reveal slide-up">
          <h2>MrML Lab Hakkinda</h2>
          <div class="section-divider"></div>
          <p>Makine, mekanik ve biyolojik zeka kesisiminde konumlanan MrML Lab, termoelektrik enerji donusumu, mikro robotik ve hesaplamali biyomekanigin sinirlarini genisletmeye adanmis bir arastirma laboratuvaridir.</p>
          <p>2016 yilinda kurulan laboratuvarimiz, TUBITAK, Avrupa Birligi ve sanayi isbirligi projeleriyle desteklenmekte; uluslararasi ortaklarla yuruttugu calismalar sayesinde kureselde taninan bir arastirma merkezi haline gelmektedir.</p>
          <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:32px;">
            <NuxtLink href="/hakkinda" class="btn btn-primary">Daha Fazla <i class="fa-solid fa-arrow-right"></i></NuxtLink>
            <NuxtLink href="/iletisim" class="btn btn-secondary">Iletisim</NuxtLink>
          </div>
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

    <!-- RESEARCH AREAS -- veritabanindan -->
    <section id="arastirmalar" class="section research-section">
      <div class="container">
        <div class="section-header scroll-reveal slide-up">
          <h2>Arastirma Alanlari</h2>
          <p>Bilimsel calismalarimizin temel eksenlerini kesfet</p>
        </div>
        <div class="research-grid">
          <NuxtLink
            v-for="(area, i) in (researchAreas || [])"
            :key="area.id"
            :href="`/arastirmalar/${area.slug}`"
            class="research-card scroll-reveal slide-up"
            :data-delay="i * 100"
            style="text-decoration:none;"
          >
            <div class="card-glow"></div>
            <div class="card-content">
              <div class="research-icon" :style="{ color: area.color }"><i :class="area.icon"></i></div>
              <h3>{{ area.name }}</h3>
              <p>{{ area.description }}</p>
            </div>
          </NuxtLink>
        </div>
        <div style="text-align:center;margin-top:48px;">
          <NuxtLink href="/arastirmalar" class="btn btn-secondary">Tum Arastirma Alanlari <i class="fa-solid fa-arrow-right"></i></NuxtLink>
        </div>
      </div>
    </section>

    <!-- FEATURED PROJECTS -->
    <section id="projeler" class="section projects-section">
      <div class="container">
        <div class="section-header scroll-reveal slide-up">
          <h2>One Cikan Projeler</h2>
          <div class="slider-controls">
            <button id="proj-prev" class="control-btn" @click="scrollProjects(-1)"><i class="fa-solid fa-arrow-left"></i></button>
            <button id="proj-next" class="control-btn" @click="scrollProjects(1)"><i class="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
        <div class="projects-slider scroll-reveal fade-in">
          <div class="slider-track" ref="projectsTrack">
            <NuxtLink
              v-for="project in (featuredProjects || [])"
              :key="project.id"
              :href="`/projeler/${project.slug}`"
              class="project-card-horizontal"
              style="text-decoration:none;color:inherit;"
            >
              <div class="project-img" :style="project.cover_image ? `background-image:url(${project.cover_image});background-size:cover;background-position:center;` : 'background: var(--bg-elevated);'"></div>
              <div class="project-details">
                <span class="project-tag">{{ project.research_area_name }}</span>
                <h4>{{ project.title }}</h4>
                <p>{{ project.summary }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
        <div style="text-align:center;margin-top:48px;">
          <NuxtLink href="/projeler" class="btn btn-secondary">Tum Projeleri Gor <i class="fa-solid fa-arrow-right"></i></NuxtLink>
        </div>
      </div>
    </section>

    <!-- FEATURED PUBLICATIONS -->
    <section id="yayinlar" class="section publications-section">
      <div class="container">
        <div class="section-header scroll-reveal slide-up"><h2>Secili Yayinlar</h2></div>
        <div class="publications-list">
          <NuxtLink
            v-for="(pub, i) in (featuredPubs || [])"
            :key="pub.id"
            :href="pub.doi || `/yayinlar/${pub.slug || pub.id}`"
            :target="pub.doi ? '_blank' : '_self'"
            class="pub-card scroll-reveal slide-up"
            :data-delay="i * 100"
          >
            <div class="pub-icon"><i class="fa-regular fa-file-lines"></i></div>
            <div class="pub-info">
              <h4>{{ pub.title }}</h4>
              <span class="pub-meta">{{ pub.authors }} &bull; {{ pub.journal }} &bull; {{ pub.year }}</span>
            </div>
            <div class="pub-arrow"><i class="fa-solid fa-arrow-up-right-from-square"></i></div>
          </NuxtLink>
        </div>
        <div style="text-align:center;margin-top:48px;">
          <NuxtLink href="/yayinlar" class="btn btn-secondary">Tum Yayinlar <i class="fa-solid fa-arrow-right"></i></NuxtLink>
        </div>
      </div>
    </section>

    <!-- LATEST NEWS -->
    <section id="haberler" class="section" style="background:var(--bg-secondary);" v-if="(latestNews || []).length">
      <div class="container">
        <div class="section-header scroll-reveal slide-up"><h2>Son Haberler</h2></div>
        <div class="research-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr));">
          <NuxtLink
            v-for="(haber, i) in latestNews"
            :key="haber.id"
            :href="`/haberler/${haber.slug || haber.id}`"
            class="research-card scroll-reveal slide-up"
            :data-delay="i * 100"
            style="text-decoration:none;display:flex;flex-direction:column;"
          >
            <div class="card-glow"></div>
            <div class="card-content">
              <span style="font-size:12px;color:var(--text-muted);font-family:var(--font-heading);letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:12px;">
                {{ formatDate(haber.published_at) }} &bull; {{ categoryLabels[haber.category] || haber.category }}
              </span>
              <h3 style="font-size:18px;line-height:1.4;margin-bottom:12px;">{{ haber.title }}</h3>
              <p style="font-size:14px;margin-bottom:0;">{{ (haber.content || '').replace(/<[^>]+>/g,'').slice(0,120) }}...</p>
            </div>
          </NuxtLink>
        </div>
        <div style="text-align:center;margin-top:48px;">
          <NuxtLink href="/haberler" class="btn btn-secondary">Tum Haberler <i class="fa-solid fa-arrow-right"></i></NuxtLink>
        </div>
      </div>
    </section>

    <!-- JOIN CTA -->
    <section id="basvur" class="section join-section">
      <div class="container scroll-reveal slide-up">
        <div class="join-organic-block">
          <div class="join-content">
            <h2>One cikan arastirma ekibimizin parcasi olun.</h2>
            <p>Merak ve tutkuyla hareket eden doktora ogrencileri, postdok arastirmacilar ve muhendisleri ariyoruz.</p>
            <NuxtLink href="/basvur" class="btn btn-primary btn-large">Basvur <i class="fa-solid fa-arrow-right"></i></NuxtLink>
          </div>
          <div class="join-shapes">
            <div class="shape-blob shape-1"></div>
            <div class="shape-blob shape-2"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
