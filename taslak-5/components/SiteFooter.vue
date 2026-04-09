<template>
  <footer class="footer footer-v2">
    <!-- Top: Wordmark + Contact + Social -->
    <div class="fv2-top">
      <div class="container fv2-top-inner">
        <div class="fv2-wordmark">
          <NuxtLink href="/" class="fv2-logo">
            <span class="logo-mr">Mr</span><span class="logo-ml">ML</span><span class="logo-lab"> Lab</span>
          </NuxtLink>
          <p class="fv2-tagline">Mekatronigin, Robotik ve Makine Ogreniminin Kesisiminde</p>
        </div>
        <div class="fv2-contact-block">
          <a href="mailto:contact@mrml-lab.edu" class="fv2-email">
            <i class="fa-regular fa-envelope"></i>
            contact@mrml-lab.edu
          </a>
          <NuxtLink href="/iletisim" class="btn btn-primary fv2-cta">
            Iletisime Gec <i class="fa-solid fa-arrow-right"></i>
          </NuxtLink>
          <div class="fv2-social">
            <a href="#" aria-label="Google Scholar" title="Google Scholar"><i class="fa-brands fa-google"></i></a>
            <a href="#" aria-label="ORCID" title="ORCID"><i class="fa-brands fa-orcid"></i></a>
            <a href="#" aria-label="ResearchGate" title="ResearchGate"><i class="fa-brands fa-researchgate"></i></a>
            <a href="#" aria-label="LinkedIn" title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
            <a href="#" aria-label="GitHub" title="GitHub"><i class="fa-brands fa-github"></i></a>
          </div>
        </div>
      </div>
    </div>

    <!-- Mid: Nav columns -->
    <div class="fv2-nav-strip">
      <div class="container fv2-nav-inner">
        <div class="fv2-nav-group">
          <span class="fv2-nav-label">Laboratuvar</span>
          <NuxtLink href="/hakkinda">Hakkinda</NuxtLink>
          <NuxtLink href="/ekip">Ekip</NuxtLink>
          <NuxtLink href="/donanim">Donanim</NuxtLink>
          <NuxtLink href="/basvur">Basvur</NuxtLink>
        </div>
        <div class="fv2-nav-sep"></div>
        <div class="fv2-nav-group">
          <span class="fv2-nav-label">Arastirma</span>
          <NuxtLink href="/arastirmalar">Arastirma Alanlari</NuxtLink>
          <NuxtLink href="/projeler">Projeler</NuxtLink>
          <NuxtLink href="/yayinlar">Yayinlar</NuxtLink>
        </div>
        <div class="fv2-nav-sep"></div>
        <div class="fv2-nav-group">
          <span class="fv2-nav-label">Medya</span>
          <NuxtLink href="/haberler">Haberler</NuxtLink>
          <NuxtLink href="/etkinlikler">Etkinlikler</NuxtLink>
          <NuxtLink href="/blog">Blog</NuxtLink>
        </div>
        <div class="fv2-nav-sep"></div>
        <div class="fv2-nav-group">
          <span class="fv2-nav-label">Iletisim</span>
          <NuxtLink href="/iletisim">Iletisim Formu</NuxtLink>
          <a href="tel:+903121234567">+90 312 123 45 67</a>
          <span style="color: var(--text-muted); font-size: 13px;">Pzt-Cum, 09:00-18:00</span>
          <span style="color: var(--text-muted); font-size: 13px;">Muhendislik Binasi B-Blok Kat 3</span>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="fv2-bottom">
      <div class="container fv2-bottom-inner">
        <p>&copy; {{ new Date().getFullYear() }} MrML Lab &mdash; Tum haklari saklidir.</p>
        <div class="fv2-legal">
          <NuxtLink href="/gizlilik">Gizlilik</NuxtLink>
          <span class="fv2-dot"></span>
          <NuxtLink href="/kvkk">KVKK</NuxtLink>
          <span class="fv2-dot"></span>
          <NuxtLink href="/aydinlatma-metni">Aydinlatma Metni</NuxtLink>
        </div>
      </div>
    </div>

    <div class="footer-glow"></div>
  </footer>
</template>
