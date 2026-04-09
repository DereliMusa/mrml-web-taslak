<script setup>
useHead({ title: 'Yayinlar | MrML Lab' })
useScrollReveal()

const { data: publications } = await useAsyncData('publications', () => $fetch('/api/publications'))
const { data: areas } = await useAsyncData('pub-areas', () => $fetch('/api/research-areas'))

const search = ref('')
const typeFilter = ref('all')
const areaFilter = ref('all')

const typeOptions = [
  { key: 'all', label: 'Tum Turler' },
  { key: 'article', label: 'Dergi Makalesi' },
  { key: 'conference', label: 'Konferans' },
  { key: 'thesis', label: 'Tez' },
  { key: 'book', label: 'Kitap' },
]
const typeLabel = { article: 'Makale', conference: 'Konferans', thesis: 'Tez', book: 'Kitap', preprint: 'Preprint' }

const filtered = computed(() => {
  return (publications.value || []).filter(p => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || p.title?.toLowerCase().includes(q) || p.authors?.toLowerCase().includes(q) || p.journal?.toLowerCase().includes(q)
    const matchType = typeFilter.value === 'all' || p.pub_type === typeFilter.value
    const matchArea = areaFilter.value === 'all' || p.research_area_id == areaFilter.value
    return matchSearch && matchType && matchArea
  })
})

const byYear = computed(() => {
  const g = {}
  for (const pub of filtered.value) {
    const y = pub.year || 'Tarih Bilinmiyor'
    if (!g[y]) g[y] = []
    g[y].push(pub)
  }
  return Object.entries(g).sort(([a], [b]) => b - a)
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <div class="scroll-reveal slide-up">
          <span class="hero-eyebrow">Bilimsel Calisma</span>
          <h1 class="page-hero-title"><span class="accent-text">Yayinlar</span></h1>
          <p class="page-hero-sub">Uluslararasi dergi ve konferanslarda yayimlanan bilimsel calismalarimiz.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- Filtreler -->
        <div class="pub-filters">
          <div class="search-bar" style="flex:1;max-width:360px;">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input v-model="search" type="text" class="search-input" placeholder="Baslik, yazar, dergi ara...">
          </div>
          <select v-model="typeFilter" class="form-control" style="width:180px;">
            <option v-for="t in typeOptions" :key="t.key" :value="t.key">{{ t.label }}</option>
          </select>
          <select v-model="areaFilter" class="form-control" style="width:200px;">
            <option value="all">Tum Alanlar</option>
            <option v-for="a in (areas || [])" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
        </div>

        <!-- Yile gore gruplu liste -->
        <template v-for="([year, pubs]) in byYear" :key="year">
          <div class="year-divider">
            <span class="year-label">{{ year }}</span>
            <div class="year-line"></div>
          </div>
          <div class="publications-list" style="margin-bottom: 8px;">
            <a
              v-for="pub in pubs"
              :key="pub.id"
              :href="pub.doi || '#'"
              :target="pub.doi ? '_blank' : '_self'"
              class="pub-card scroll-reveal slide-up"
            >
              <div class="pub-icon"><i class="fa-regular fa-file-lines"></i></div>
              <div class="pub-info">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                  <span class="badge badge-blue">{{ typeLabel[pub.pub_type] || pub.pub_type }}</span>
                  <span v-if="pub.is_featured" class="badge badge-gold">One Cikan</span>
                </div>
                <h4>{{ pub.title }}</h4>
                <span class="pub-meta">{{ pub.authors }} &bull; {{ pub.journal }} &bull; {{ pub.year }}</span>
              </div>
              <div class="pub-arrow"><i class="fa-solid fa-arrow-up-right-from-square"></i></div>
            </a>
          </div>
        </template>

        <div v-if="!byYear.length" class="empty-state">
          <i class="fa-solid fa-file-lines"></i>
          <p>Aramaniza uygun yayin bulunamadi.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 140px 0 80px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.08) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.page-hero-title { font-size: clamp(36px, 5vw, 60px); font-weight: 800; margin: 12px 0; }
.page-hero-sub { color: var(--text-muted); font-size: 18px; max-width: 540px; }
.pub-filters { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-bottom: 40px; }
.year-divider { display: flex; align-items: center; gap: 16px; margin: 40px 0 20px; }
.year-label { font-size: 20px; font-weight: 800; color: var(--gold); white-space: nowrap; }
.year-line { flex: 1; height: 1px; background: var(--border); }
</style>
