<script setup>
const route = useRoute()
const { data: member, error } = await useAsyncData(`member-${route.params.slug}`, () =>
  $fetch(`/api/members/${route.params.slug}`)
)
const { data: pubs } = await useAsyncData(`member-pubs-${route.params.slug}`, () =>
  $fetch('/api/publications').then(p =>
    p.filter(x => x.authors?.toLowerCase().includes((member.value?.name || '').split(' ').pop()?.toLowerCase() || ''))
      .slice(0, 5)
  )
)

if (error.value) throw createError({ statusCode: 404, message: 'Uye bulunamadi.' })

useHead(() => ({ title: `${member.value?.name || ''} | MrML Lab` }))

const roleLabel = { pi: 'Ogretim Uyesi / PI', phd: 'Doktora Ogrencisi', msc: 'Yuksek Lisans', undergrad: 'Lisans', alumni: 'Mezun' }

const researchAreas = computed(() => {
  try { return JSON.parse(member.value?.research_areas || '[]') }
  catch { return [] }
})
</script>

<template>
  <div>
    <section class="page-hero member-hero">
      <div class="container">
        <NuxtLink href="/ekip" style="color:var(--text-muted);font-size:14px;display:inline-block;margin-bottom:24px;">
          <i class="fa-solid fa-arrow-left"></i> Ekip
        </NuxtLink>
        <div class="member-hero-grid">
          <div class="member-photo-wrap">
            <img v-if="member?.photo_url" :src="member.photo_url" :alt="member?.name" class="member-photo">
            <div v-else class="member-photo-placeholder">{{ (member?.name || '?')[0].toUpperCase() }}</div>
          </div>
          <div class="member-meta">
            <span class="member-role-badge">{{ roleLabel[member?.role] || member?.role }}</span>
            <h1 class="member-name">{{ member?.name }}</h1>
            <p class="member-title">{{ member?.title }}</p>
            <a v-if="member?.email" :href="`mailto:${member.email}`" class="member-email">
              <i class="fa-regular fa-envelope"></i> {{ member?.email }}
            </a>
            <div class="member-socials">
              <a v-if="member?.social_scholar" :href="member.social_scholar" target="_blank" class="social-btn"><i class="fa-brands fa-google"></i> Scholar</a>
              <a v-if="member?.social_orcid" :href="member.social_orcid" target="_blank" class="social-btn"><i class="fa-brands fa-orcid"></i> ORCID</a>
              <a v-if="member?.social_linkedin" :href="member.social_linkedin" target="_blank" class="social-btn"><i class="fa-brands fa-linkedin-in"></i></a>
              <a v-if="member?.social_github" :href="member.social_github" target="_blank" class="social-btn"><i class="fa-brands fa-github"></i></a>
              <a v-if="member?.social_researchgate" :href="member.social_researchgate" target="_blank" class="social-btn"><i class="fa-brands fa-researchgate"></i></a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container member-content-grid">
        <div>
          <div v-if="member?.bio" class="member-bio-block">
            <h2>Biyografi</h2>
            <div class="section-divider"></div>
            <p style="line-height:1.9;color:var(--text-secondary);">{{ member?.bio }}</p>
          </div>

          <div v-if="(pubs || []).length" style="margin-top: 48px;">
            <h2>Yayinlar</h2>
            <div class="section-divider"></div>
            <div class="publications-list" style="margin-top:24px;">
              <a v-for="pub in pubs" :key="pub.id" :href="pub.doi || '#'" target="_blank" class="pub-card">
                <div class="pub-icon"><i class="fa-regular fa-file-lines"></i></div>
                <div class="pub-info">
                  <h4>{{ pub.title }}</h4>
                  <span class="pub-meta">{{ pub.authors }} &bull; {{ pub.journal }} &bull; {{ pub.year }}</span>
                </div>
                <div class="pub-arrow"><i class="fa-solid fa-arrow-up-right-from-square"></i></div>
              </a>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="member-sidebar">
          <div v-if="researchAreas.length" class="sidebar-card">
            <h4>Arastirma Alanlari</h4>
            <div class="area-tags">
              <span v-for="area in researchAreas" :key="area" class="badge badge-gold">{{ area }}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 120px 0 60px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.06) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.member-hero-grid { display: grid; grid-template-columns: 200px 1fr; gap: 48px; align-items: center; }
@media (max-width: 640px) { .member-hero-grid { grid-template-columns: 1fr; } }
.member-photo-wrap { flex-shrink: 0; }
.member-photo { width: 200px; height: 200px; border-radius: 16px; object-fit: cover; object-position: top; border: 2px solid var(--border); }
.member-photo-placeholder { width: 200px; height: 200px; border-radius: 16px; background: rgba(198,151,73,0.12); display: flex; align-items: center; justify-content: center; font-size: 64px; font-weight: 800; color: var(--gold); }
.member-role-badge { display: inline-block; background: rgba(198,151,73,0.12); color: var(--gold); font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px; }
.member-name { font-size: clamp(28px, 4vw, 44px); font-weight: 800; margin: 0 0 6px; }
.member-title { color: var(--text-muted); font-size: 16px; margin-bottom: 16px; }
.member-email { color: var(--text-muted); font-size: 14px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px; transition: color 0.2s; }
.member-email:hover { color: var(--gold); }
.member-socials { display: flex; gap: 10px; flex-wrap: wrap; }
.social-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 6px; background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-muted); font-size: 13px; text-decoration: none; transition: all 0.2s; }
.social-btn:hover { border-color: var(--gold); color: var(--gold); }
.member-content-grid { display: grid; grid-template-columns: 1fr 280px; gap: 48px; align-items: start; }
@media (max-width: 768px) { .member-content-grid { grid-template-columns: 1fr; } }
.member-bio-block h2, .member-content-grid h2 { font-size: 22px; font-weight: 700; }
.sidebar-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; }
.sidebar-card h4 { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 14px; }
.area-tags { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
