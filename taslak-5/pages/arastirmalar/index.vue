<script setup>
useHead({ title: 'Arastirma Alanlari | MrML Lab' })
useScrollReveal()

const { data: areas } = await useAsyncData('research-areas', () => $fetch('/api/research-areas'))
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <div class="scroll-reveal slide-up">
          <span class="hero-eyebrow">Bilimsel Calismalar</span>
          <h1 class="page-hero-title">Arastirma <span class="accent-text">Alanlari</span></h1>
          <p class="page-hero-sub">Termoelektrik, mikro robotik ve biyomekanikte sinirlarini zorlayan arastirmalar.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="research-grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
          <NuxtLink
            v-for="(area, i) in (areas || [])"
            :key="area.id"
            :href="`/arastirmalar/${area.slug}`"
            class="research-card scroll-reveal slide-up"
            :data-delay="i * 80"
            style="text-decoration: none;"
          >
            <div class="card-glow"></div>
            <div class="card-content">
              <div class="research-icon" :style="{ color: area.color }"><i :class="area.icon"></i></div>
              <h3>{{ area.name }}</h3>
              <p>{{ area.description }}</p>
              <span style="font-size: 13px; color: var(--gold); margin-top: 16px; display: inline-flex; align-items: center; gap: 6px;">
                Daha Fazla <i class="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 140px 0 80px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.08) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.page-hero-title { font-size: clamp(36px, 5vw, 60px); font-weight: 800; margin: 12px 0; line-height: 1.1; }
.page-hero-sub { color: var(--text-muted); font-size: 18px; max-width: 540px; }
</style>
