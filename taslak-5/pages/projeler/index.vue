<script setup>
useHead({ title: 'Projeler | MrML Lab' })
useScrollReveal()

const { data: projects } = await useAsyncData('projects', () => $fetch('/api/projects'))

const statusLabels = { active: 'Devam Ediyor', completed: 'Tamamlandi', cancelled: 'Iptal' }
const statusColors = { active: '#10b981', completed: '#6366f1', cancelled: '#ef4444' }

const activeFilter = ref('all')
const filters = [
  { key: 'all', label: 'Tumu' },
  { key: 'active', label: 'Devam Eden' },
  { key: 'completed', label: 'Tamamlanan' },
]

const filtered = computed(() => {
  if (activeFilter.value === 'all') return projects.value || []
  return (projects.value || []).filter(p => p.status === activeFilter.value)
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <div class="scroll-reveal slide-up">
          <span class="hero-eyebrow">Arastirma Projeleri</span>
          <h1 class="page-hero-title"><span class="accent-text">Projeler</span></h1>
          <p class="page-hero-sub">TUBITAK, AB ve sanayi fonlu guncel ve tamamlanmis arastirma projelerimiz.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- Filtreler -->
        <div class="filter-tabs" style="margin-bottom: 40px;">
          <button
            v-for="f in filters"
            :key="f.key"
            class="filter-tab"
            :class="{ active: activeFilter === f.key }"
            @click="activeFilter = f.key"
          >
            {{ f.label }}
          </button>
        </div>

        <div class="projects-grid">
          <NuxtLink
            v-for="(project, i) in filtered"
            :key="project.id"
            :href="`/projeler/${project.slug}`"
            class="project-card scroll-reveal slide-up"
            :data-delay="(i % 3) * 80"
          >
            <div class="project-card-img" :style="project.cover_image ? `background-image: url(${project.cover_image}); background-size: cover; background-position: center;` : ''"></div>
            <div class="project-card-body">
              <div class="project-card-meta">
                <span class="project-tag" v-if="project.research_area_name">{{ project.research_area_name }}</span>
                <span class="status-dot" :style="{ background: statusColors[project.status] }"></span>
                <span style="font-size:12px;color:var(--text-muted);">{{ statusLabels[project.status] }}</span>
              </div>
              <h3>{{ project.title }}</h3>
              <p>{{ project.summary }}</p>
              <div class="project-card-footer">
                <span v-if="project.funding_source" style="font-size:12px;color:var(--text-muted);"><i class="fa-solid fa-briefcase"></i> {{ project.funding_source }}</span>
                <span style="color:var(--gold);font-size:13px;">Detay <i class="fa-solid fa-arrow-right"></i></span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div v-if="!filtered.length" class="empty-state">
          <i class="fa-solid fa-diagram-project"></i>
          <p>Bu kategoride proje bulunamadi.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 140px 0 80px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.08) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.page-hero-title { font-size: clamp(36px, 5vw, 60px); font-weight: 800; margin: 12px 0; }
.page-hero-sub { color: var(--text-muted); font-size: 18px; max-width: 540px; }
.filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-tab { padding: 8px 20px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); cursor: pointer; font-size: 14px; font-family: inherit; transition: all 0.2s; }
.filter-tab.active, .filter-tab:hover { border-color: var(--gold); color: var(--gold); background: rgba(198,151,73,0.08); }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 28px; }
.project-card { text-decoration: none; color: inherit; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: transform 0.2s, border-color 0.2s; display: flex; flex-direction: column; }
.project-card:hover { transform: translateY(-4px); border-color: var(--gold); }
.project-card-img { height: 180px; background: var(--bg-elevated); background-size: cover; }
.project-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.project-card-meta { display: flex; align-items: center; gap: 8px; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.project-card h3 { font-size: 17px; font-weight: 700; line-height: 1.4; margin: 0; }
.project-card p { color: var(--text-muted); font-size: 14px; margin: 0; flex: 1; }
.project-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border); }
</style>
