<script setup>
const route = useRoute()
const { data: area, error } = await useAsyncData(`area-${route.params.slug}`, () =>
  $fetch(`/api/research-areas/${route.params.slug}`)
)
const { data: projects } = await useAsyncData(`area-projects-${route.params.slug}`, () =>
  $fetch('/api/projects').then(p => p.filter(x => x.research_area_id === area.value?.id))
)

if (error.value) throw createError({ statusCode: 404, message: 'Arastirma alani bulunamadi.' })

useHead(() => ({ title: `${area.value?.name || ''} | MrML Lab` }))
useScrollReveal()
</script>

<template>
  <div>
    <section class="page-hero" :style="{ borderBottom: `2px solid ${area?.color || 'var(--gold)'}20` }">
      <div class="container">
        <div class="scroll-reveal slide-up">
          <NuxtLink href="/arastirmalar" style="color:var(--text-muted);font-size:14px;">
            <i class="fa-solid fa-arrow-left"></i> Arastirma Alanlari
          </NuxtLink>
          <div style="display:flex;align-items:center;gap:16px;margin-top:20px;">
            <div class="area-icon-lg" :style="{ color: area?.color, background: (area?.color || '#6366f1') + '20' }">
              <i :class="area?.icon"></i>
            </div>
            <div>
              <h1 class="page-hero-title">{{ area?.name }}</h1>
            </div>
          </div>
          <p class="page-hero-sub" style="margin-top:16px;">{{ area?.description }}</p>
        </div>
      </div>
    </section>

    <!-- Ilgili Projeler -->
    <section class="section" v-if="(projects || []).length">
      <div class="container">
        <div class="section-header scroll-reveal slide-up"><h2>Bu Alandaki Projeler</h2></div>
        <div class="publications-list">
          <NuxtLink
            v-for="project in projects"
            :key="project.id"
            :href="`/projeler/${project.slug}`"
            class="pub-card scroll-reveal slide-up"
          >
            <div class="pub-icon"><i class="fa-solid fa-diagram-project"></i></div>
            <div class="pub-info">
              <h4>{{ project.title }}</h4>
              <span class="pub-meta">{{ project.status === 'active' ? 'Devam Ediyor' : 'Tamamlandi' }} &bull; {{ project.funding_source }}</span>
            </div>
            <div class="pub-arrow"><i class="fa-solid fa-arrow-right"></i></div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 140px 0 80px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.06) 0%, transparent 60%); }
.page-hero-title { font-size: clamp(32px, 4vw, 52px); font-weight: 800; margin: 0; }
.page-hero-sub { color: var(--text-muted); font-size: 18px; max-width: 600px; line-height: 1.7; }
.area-icon-lg { width: 72px; height: 72px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
</style>
