<script setup>
definePageMeta({ layout: 'admin', ssr: false })

const { checkAuth } = useAuth()
const { apiFetch } = useApi()
const { showToast } = useToast()

const links = ref([])
const saving = ref(false)

onMounted(async () => {
  await checkAuth()
  try {
    links.value = await apiFetch('/social')
  } catch (e) {
    showToast(e.message, 'error')
  }
})

const platformIcons = {
  twitter: 'fa-brands fa-x-twitter',
  linkedin: 'fa-brands fa-linkedin',
  github: 'fa-brands fa-github',
  instagram: 'fa-brands fa-instagram',
  youtube: 'fa-brands fa-youtube',
  researchgate: 'fa-brands fa-researchgate',
  scholar: 'fa-solid fa-graduation-cap',
}

async function saveAll() {
  saving.value = true
  try {
    for (const link of links.value) {
      await apiFetch(`/social/${link.id}`, { method: 'PUT', body: { url: link.url, is_active: link.is_active, order_index: link.order_index } })
    }
    showToast('Sosyal medya linkleri kaydedildi.', 'success')
  } catch (e) {
    showToast(e.message, 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <div><h1>Sosyal Medya</h1><p>Lab sosyal medya profillerini yonetin.</p></div>
      <div class="page-actions">
        <button class="btn btn-gold" :disabled="saving" @click="saveAll">
          <span v-if="saving" class="loading-spin"></span>
          <template v-else><i class="fa-solid fa-check"></i> Tamamini Kaydet</template>
        </button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <div v-for="link in links" :key="link.id" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);">
          <div style="width:36px;text-align:center;font-size:18px;color:var(--gold);">
            <i :class="platformIcons[link.platform] || 'fa-solid fa-link'"></i>
          </div>
          <div style="flex:1;">
            <label class="form-label" style="margin-bottom:4px;font-size:12px;">{{ link.name }}</label>
            <input v-model="link.url" type="url" class="form-control" :placeholder="`${link.name} URL`">
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="link.is_active">
            <span class="toggle-track"></span>
            <span class="toggle-label">Aktif</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
