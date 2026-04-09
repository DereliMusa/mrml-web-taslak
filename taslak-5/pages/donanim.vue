<script setup>
useHead({ title: 'Donanim | MrML Lab' })
useScrollReveal()

const { data: equipment } = await useAsyncData('equipment', () =>
  $fetch('/api/equipment').then(e => e.filter(x => x.is_active))
)

const categoryLabel = { lab: 'Laboratuvar', experiment: 'Deney', simulation: 'Simulasyon', compute: 'Hesaplama' }
const categoryIcon = { lab: 'fa-solid fa-flask', experiment: 'fa-solid fa-vials', simulation: 'fa-solid fa-cube', compute: 'fa-solid fa-microchip' }

const grouped = computed(() => {
  const g = {}
  for (const eq of (equipment.value || [])) {
    const k = eq.category || 'lab'
    if (!g[k]) g[k] = []
    g[k].push(eq)
  }
  return Object.entries(g)
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <div class="scroll-reveal slide-up">
          <span class="hero-eyebrow">Altyapi</span>
          <h1 class="page-hero-title">Laboratuvar <span class="accent-text">Donanimlari</span></h1>
          <p class="page-hero-sub">Arastirmalarimizi destekleyen ileri teknoloji ekipmanlar.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <template v-for="([cat, items]) in grouped" :key="cat">
          <div class="section-header scroll-reveal slide-up" style="margin-top:48px;">
            <h2>
              <i :class="categoryIcon[cat]" style="color:var(--gold);margin-right:10px;"></i>
              {{ categoryLabel[cat] || cat }}
            </h2>
          </div>
          <div class="equipment-list">
            <div
              v-for="(item, i) in items"
              :key="item.id"
              class="equipment-item scroll-reveal slide-right"
              :data-delay="i * 80"
            >
              <div class="equip-icon-wrapper">
                <i class="fa-solid fa-microscope text-accent"></i>
              </div>
              <div class="equip-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.description }}</p>
                <div v-if="item.specs" style="margin-top:8px;padding:10px 14px;background:var(--bg-elevated);border-radius:6px;font-size:13px;color:var(--text-muted);">
                  <i class="fa-solid fa-list-check" style="margin-right:6px;color:var(--gold);"></i>{{ item.specs }}
                </div>
              </div>
              <img v-if="item.photo_url" :src="item.photo_url" :alt="item.name" class="equip-photo">
            </div>
          </div>
        </template>

        <div v-if="!equipment?.length" class="empty-state">
          <i class="fa-solid fa-microscope"></i>
          <p>Donanim bilgisi henuz eklenmemis.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 140px 0 80px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.08) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.page-hero-title { font-size: clamp(36px, 5vw, 60px); font-weight: 800; margin: 12px 0; }
.page-hero-sub { color: var(--text-muted); font-size: 18px; max-width: 540px; }
.equip-photo { width: 120px; height: 90px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); flex-shrink: 0; }
</style>
