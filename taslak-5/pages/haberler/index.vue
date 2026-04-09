<script setup>
useHead({ title: 'Haberler | MrML Lab' })
useScrollReveal()

const { data: news } = await useAsyncData('news-list', () =>
  $fetch('/api/news').then(n => n.filter(x => x.status === 'published'))
)

const categoryLabel = { general: 'Genel', award: 'Odul', event: 'Etkinlik', publication: 'Yayin', announcement: 'Duyuru' }
const activeFilter = ref('all')

const filters = [{ key: 'all', label: 'Tumu' }, ...Object.entries(categoryLabel).map(([k, v]) => ({ key: k, label: v }))]

const filtered = computed(() =>
  activeFilter.value === 'all' ? (news.value || []) : (news.value || []).filter(n => n.category === activeFilter.value)
)

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}
function excerpt(html, len = 140) {
  return (html || '').replace(/<[^>]+>/g, '').slice(0, len) + '...'
}
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <div class="scroll-reveal slide-up">
          <span class="hero-eyebrow">Guncel</span>
          <h1 class="page-hero-title">Lab <span class="accent-text">Haberleri</span></h1>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="filter-tabs" style="margin-bottom:40px;">
          <button v-for="f in filters" :key="f.key" class="filter-tab" :class="{ active: activeFilter === f.key }" @click="activeFilter = f.key">
            {{ f.label }}
          </button>
        </div>

        <div class="news-grid">
          <NuxtLink
            v-for="(item, i) in filtered"
            :key="item.id"
            :href="`/haberler/${item.slug || item.id}`"
            class="news-card scroll-reveal slide-up"
            :data-delay="(i % 3) * 80"
          >
            <div v-if="item.cover_image" class="news-card-img" :style="`background-image:url(${item.cover_image})`"></div>
            <div class="news-card-body">
              <div class="news-card-meta">
                <span class="badge badge-blue">{{ categoryLabel[item.category] || item.category }}</span>
                <span style="font-size:12px;color:var(--text-muted);">{{ formatDate(item.published_at) }}</span>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ excerpt(item.content) }}</p>
              <span class="news-more">Devami <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </NuxtLink>
        </div>

        <div v-if="!filtered.length" class="empty-state">
          <i class="fa-solid fa-newspaper"></i>
          <p>Bu kategoride haber bulunamadi.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 140px 0 80px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.08) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.page-hero-title { font-size: clamp(36px, 5vw, 60px); font-weight: 800; margin: 12px 0; }
.filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-tab { padding: 8px 20px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); cursor: pointer; font-size: 14px; font-family: inherit; transition: all 0.2s; }
.filter-tab.active, .filter-tab:hover { border-color: var(--gold); color: var(--gold); background: rgba(198,151,73,0.08); }
.news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 28px; }
.news-card { text-decoration: none; color: inherit; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: transform 0.2s, border-color 0.2s; display: flex; flex-direction: column; }
.news-card:hover { transform: translateY(-4px); border-color: var(--gold); }
.news-card-img { height: 200px; background-size: cover; background-position: center; }
.news-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.news-card-meta { display: flex; align-items: center; gap: 10px; }
.news-card h3 { font-size: 17px; font-weight: 700; line-height: 1.4; margin: 0; }
.news-card p { color: var(--text-muted); font-size: 14px; margin: 0; flex: 1; line-height: 1.6; }
.news-more { font-size: 13px; color: var(--gold); display: inline-flex; align-items: center; gap: 6px; margin-top: auto; }
</style>
