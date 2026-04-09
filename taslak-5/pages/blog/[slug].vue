<script setup>
const route = useRoute()
const { data: post, error } = await useAsyncData(`blog-${route.params.slug}`, () =>
  $fetch(`/api/blog/${route.params.slug}`)
)
if (error.value) throw createError({ statusCode: 404, message: 'Blog yazisi bulunamadi.' })
useHead(() => ({ title: `${post.value?.title || ''} | MrML Lab Blog` }))

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}
const tags = computed(() => (post.value?.tags || '').split(',').map(t => t.trim()).filter(Boolean))
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container" style="max-width: 820px;">
        <NuxtLink href="/blog" style="color:var(--text-muted);font-size:14px;display:inline-block;margin-bottom:24px;">
          <i class="fa-solid fa-arrow-left"></i> Blog
        </NuxtLink>
        <div v-if="post?.cover_image" style="border-radius:16px;overflow:hidden;margin-bottom:32px;max-height:420px;">
          <img :src="post.cover_image" :alt="post.title" style="width:100%;object-fit:cover;">
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap;">
          <span v-if="post?.category" class="badge badge-blue">{{ post.category }}</span>
          <span v-for="tag in tags" :key="tag" class="badge badge-gray">{{ tag }}</span>
          <span style="font-size:13px;color:var(--text-muted);">{{ formatDate(post?.published_at) }}</span>
        </div>
        <h1 style="font-size:clamp(28px,4vw,46px);font-weight:800;line-height:1.2;margin-bottom:12px;">{{ post?.title }}</h1>
        <div v-if="post?.author_name" style="font-size:14px;color:var(--text-muted);">
          <i class="fa-solid fa-user" style="margin-right:6px;"></i>{{ post.author_name }}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container" style="max-width: 820px;">
        <div class="prose-content" v-html="post?.content || ''"></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 120px 0 60px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.06) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.prose-content { line-height: 1.9; color: var(--text-secondary); font-size: 16px; white-space: pre-wrap; }
.prose-content :deep(h2) { font-size: 22px; font-weight: 700; margin: 32px 0 12px; color: var(--text-primary); }
.prose-content :deep(p) { margin-bottom: 20px; }
</style>
