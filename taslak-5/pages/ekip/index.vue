<script setup>
useHead({ title: 'Ekip | MrML Lab', meta: [{ name: 'description', content: 'MrML Lab arastirma ekibi -- ogretim uyesi, doktora ogrencileri ve arastirmacilar.' }] })
useScrollReveal()

const { data: members } = await useAsyncData('members', () => $fetch('/api/members').then(m => m.filter(x => x.is_active)))

const roleOrder = { pi: 0, phd: 1, msc: 2, undergrad: 3, alumni: 4 }
const roleLabel = { pi: 'Ogretim Uyesi / PI', phd: 'Doktora Ogrencisi', msc: 'Yuksek Lisans', undergrad: 'Lisans Ogrencisi', alumni: 'Mezun' }

const grouped = computed(() => {
  const g = {}
  for (const m of (members.value || [])) {
    const key = m.role || 'other'
    if (!g[key]) g[key] = []
    g[key].push(m)
  }
  return Object.entries(g).sort(([a], [b]) => (roleOrder[a] ?? 99) - (roleOrder[b] ?? 99))
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <div class="scroll-reveal slide-up">
          <span class="hero-eyebrow">Insanlarimiz</span>
          <h1 class="page-hero-title">Lab <span class="accent-text">Ekibi</span></h1>
          <p class="page-hero-sub">Merak ve tutkuyla hareket eden arastirmacilarimizla tanisin.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <template v-for="([role, group]) in grouped" :key="role">
          <div class="section-header scroll-reveal slide-up" style="margin-top: 48px;">
            <h2 style="font-size: 22px;">{{ roleLabel[role] || role }}</h2>
          </div>
          <div class="team-grid">
            <NuxtLink
              v-for="member in group"
              :key="member.id"
              :href="`/ekip/${member.slug}`"
              class="team-card scroll-reveal slide-up"
            >
              <div class="team-card-photo">
                <img v-if="member.photo_url" :src="member.photo_url" :alt="member.name">
                <div v-else class="team-photo-placeholder">{{ (member.name || '?')[0].toUpperCase() }}</div>
              </div>
              <div class="team-card-info">
                <h3>{{ member.name }}</h3>
                <span class="team-card-title">{{ member.title }}</span>
                <div class="team-card-socials">
                  <a v-if="member.social_scholar" :href="member.social_scholar" target="_blank" @click.stop title="Google Scholar"><i class="fa-brands fa-google"></i></a>
                  <a v-if="member.social_orcid" :href="member.social_orcid" target="_blank" @click.stop title="ORCID"><i class="fa-brands fa-orcid"></i></a>
                  <a v-if="member.social_linkedin" :href="member.social_linkedin" target="_blank" @click.stop title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                  <a v-if="member.social_github" :href="member.social_github" target="_blank" @click.stop title="GitHub"><i class="fa-brands fa-github"></i></a>
                </div>
              </div>
            </NuxtLink>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 140px 0 80px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.08) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.page-hero-title { font-size: clamp(36px, 5vw, 60px); font-weight: 800; margin: 12px 0; line-height: 1.1; }
.page-hero-sub { color: var(--text-muted); font-size: 18px; max-width: 540px; }
.team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; margin-top: 24px; }
.team-card { text-decoration: none; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg, 16px); overflow: hidden; transition: transform 0.2s, border-color 0.2s; display: flex; flex-direction: column; }
.team-card:hover { transform: translateY(-4px); border-color: var(--gold); }
.team-card-photo { aspect-ratio: 1; background: var(--bg-elevated); overflow: hidden; }
.team-card-photo img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.team-photo-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: 800; color: var(--gold); background: rgba(198,151,73,0.1); }
.team-card-info { padding: 18px; flex: 1; }
.team-card-info h3 { font-size: 16px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); }
.team-card-title { font-size: 13px; color: var(--text-muted); display: block; margin-bottom: 12px; }
.team-card-socials { display: flex; gap: 10px; }
.team-card-socials a { color: var(--text-muted); font-size: 15px; transition: color 0.2s; }
.team-card-socials a:hover { color: var(--gold); }
</style>
