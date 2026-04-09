<script setup>
const route = useRoute()
const { data: project, error } = await useAsyncData(`project-${route.params.slug}`, () =>
  $fetch(`/api/projects/${route.params.slug}`)
)
if (error.value) throw createError({ statusCode: 404, message: 'Proje bulunamadi.' })
useHead(() => ({ title: `${project.value?.title || ''} | MrML Lab` }))

const statusLabel = { active: 'Devam Ediyor', completed: 'Tamamlandi', cancelled: 'Iptal' }
const statusColor = { active: '#10b981', completed: '#6366f1', cancelled: '#ef4444' }
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <NuxtLink href="/projeler" style="color:var(--text-muted);font-size:14px;display:inline-block;margin-bottom:24px;">
          <i class="fa-solid fa-arrow-left"></i> Projeler
        </NuxtLink>
        <div v-if="project?.cover_image" style="width:100%;height:320px;border-radius:16px;overflow:hidden;margin-bottom:32px;">
          <img :src="project.cover_image" :alt="project.title" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <span v-if="project?.research_area_name" class="project-tag">{{ project.research_area_name }}</span>
          <span class="status-pill" :style="{ background: statusColor[project?.status] + '20', color: statusColor[project?.status] }">
            {{ statusLabel[project?.status] }}
          </span>
        </div>
        <h1 class="page-hero-title">{{ project?.title }}</h1>
        <p class="page-hero-sub">{{ project?.summary }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container project-detail-grid">
        <div>
          <div v-if="project?.description" class="prose">
            <h2>Proje Hakkinda</h2>
            <div class="section-divider"></div>
            <div v-html="project.description || ''" style="line-height:1.9;color:var(--text-secondary);white-space:pre-wrap;"></div>
          </div>
        </div>
        <aside>
          <div class="sidebar-card">
            <h4>Proje Detaylari</h4>
            <dl class="detail-list">
              <template v-if="project?.funding_source">
                <dt>Fon Kaynagi</dt><dd>{{ project.funding_source }}</dd>
              </template>
              <template v-if="project?.funding_amount">
                <dt>Fon Miktari</dt><dd>{{ project.funding_amount }}</dd>
              </template>
              <template v-if="project?.start_date">
                <dt>Baslangic</dt><dd>{{ project.start_date }}</dd>
              </template>
              <template v-if="project?.end_date">
                <dt>Bitis</dt><dd>{{ project.end_date }}</dd>
              </template>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 120px 0 60px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.06) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.page-hero-title { font-size: clamp(28px, 4vw, 48px); font-weight: 800; margin: 12px 0; }
.page-hero-sub { color: var(--text-muted); font-size: 17px; max-width: 640px; line-height: 1.7; }
.status-pill { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; }
.project-detail-grid { display: grid; grid-template-columns: 1fr 300px; gap: 60px; align-items: start; }
@media (max-width: 768px) { .project-detail-grid { grid-template-columns: 1fr; } }
.sidebar-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
.sidebar-card h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); margin-bottom: 16px; }
.detail-list { display: grid; gap: 12px; margin: 0; }
.detail-list dt { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
.detail-list dd { font-size: 14px; font-weight: 500; color: var(--text-primary); margin: 2px 0 0; }
</style>
