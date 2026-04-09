<script setup>
useHead({ title: 'Blog | MrML Lab' })
useScrollReveal()

const { data: posts } = await useAsyncData('blog-list', () =>
  $fetch('/api/blog').then(b => b.filter(x => x.status === 'published'))
)

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}
function excerpt(html, n = 180) { return (html || '').replace(/<[^>]+>/g, '').slice(0, n) + '...' }
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <div class="scroll-reveal slide-up">
          <span class="hero-eyebrow">Fikirler & Icgudular</span>
          <h1 class="page-hero-title">Lab <span class="accent-text">Blog</span></h1>
          <p class="page-hero-sub">Arastirmaci perspektifinden bilim, teknoloji ve lab yasami.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="news-grid">
          <NuxtLink
            v-for="(post, i) in (posts || [])"
            :key="post.id"
            :href="`/blog/${post.slug || post.id}`"
            class="news-card scroll-reveal slide-up"
            :data-delay="(i % 3) * 80"
          >
            <div v-if="post.cover_image" class="news-card-img" :style="`background-image:url(${post.cover_image})`"></div>
            <div class="news-card-body">
              <div class="news-card-meta">
                <span v-if="post.category" class="badge badge-blue">{{ post.category }}</span>
                <span style="font-size:12px;color:var(--text-muted);">{{ formatDate(post.published_at) }}</span>
              </div>
              <h3>{{ post.title }}</h3>
              <p>{{ excerpt(post.content) }}</p>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:12px;border-top:1px solid var(--border);">
                <span v-if="post.author_name" style="font-size:13px;color:var(--text-muted);">{{ post.author_name }}</span>
                <span style="font-size:13px;color:var(--gold);">Oku <i class="fa-solid fa-arrow-right"></i></span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div v-if="!(posts || []).length" class="empty-state">
          <i class="fa-solid fa-pen-nib"></i>
          <p>Henuz yayin yapilmis blog yazisi yok.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 140px 0 80px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.08) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.page-hero-title { font-size: clamp(36px, 5vw, 60px); font-weight: 800; margin: 12px 0; }
.page-hero-sub { color: var(--text-muted); font-size: 18px; max-width: 540px; }
.news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 28px; }
.news-card { text-decoration: none; color: inherit; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: transform 0.2s, border-color 0.2s; display: flex; flex-direction: column; }
.news-card:hover { transform: translateY(-4px); border-color: var(--gold); }
.news-card-img { height: 200px; background-size: cover; background-position: center; }
.news-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.news-card-meta { display: flex; align-items: center; gap: 10px; }
.news-card h3 { font-size: 17px; font-weight: 700; line-height: 1.4; margin: 0; }
.news-card p { color: var(--text-muted); font-size: 14px; margin: 0; flex: 1; line-height: 1.6; }
</style>
