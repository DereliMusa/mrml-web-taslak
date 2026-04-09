<script setup>
const route = useRoute()
const { data: item, error } = await useAsyncData(`haberler-${route.params.slug}`, () =>
  $fetch(`/api/news/${route.params.slug}`)
)
if (error.value) throw createError({ statusCode: 404, message: 'Haber bulunamadi.' })
useHead(() => ({ title: `${item.value?.title || ''} | MrML Lab` }))

const categoryLabel = { general: 'Genel', award: 'Odul', event: 'Etkinlik', publication: 'Yayin', announcement: 'Duyuru' }

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container" style="max-width:800px;">
        <NuxtLink href="/haberler" style="color:var(--text-muted);font-size:14px;display:inline-block;margin-bottom:24px;">
          <i class="fa-solid fa-arrow-left"></i> Haberler
        </NuxtLink>
        <div v-if="item?.cover_image" style="width:100%;max-height:400px;border-radius:16px;overflow:hidden;margin-bottom:32px;">
          <img :src="item.cover_image" :alt="item.title" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
          <span class="badge badge-blue">{{ categoryLabel[item?.category] || item?.category }}</span>
          <span style="font-size:13px;color:var(--text-muted);">{{ formatDate(item?.published_at) }}</span>
        </div>
        <h1 style="font-size:clamp(28px,4vw,44px);font-weight:800;line-height:1.2;margin-bottom:0;">{{ item?.title }}</h1>
      </div>
    </section>

    <section class="section">
      <div class="container" style="max-width:800px;">
        <div class="prose-content" v-html="item?.content || ''"></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 120px 0 60px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.06) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.prose-content { line-height: 1.9; color: var(--text-secondary); font-size: 16px; white-space: pre-wrap; }
.prose-content :deep(h2) { font-size: 22px; font-weight: 700; margin: 32px 0 12px; }
.prose-content :deep(p) { margin-bottom: 20px; }
</style>
