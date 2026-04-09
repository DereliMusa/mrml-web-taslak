<script setup>
definePageMeta({ layout: 'admin', ssr: false })

const { checkAuth } = useAuth()
const { apiFetch } = useApi()
const { showToast } = useToast()

const settings = ref([])
const saving = ref(false)

onMounted(async () => {
  await checkAuth()
  try {
    settings.value = await apiFetch('/settings')
  } catch (e) {
    showToast(e.message, 'error')
  }
})

const grouped = computed(() => {
  const g = {}
  settings.value.forEach(s => { (g[s.group_name] = g[s.group_name] || []).push(s) })
  return g
})

const groupTitles = { general: 'Genel Bilgiler', contact: 'Iletisim Bilgileri', email: 'E-posta / SMTP Ayarlari' }
const groupIcons = { general: 'fa-solid fa-building', contact: 'fa-solid fa-address-card', email: 'fa-solid fa-envelope' }

async function saveAll() {
  saving.value = true
  try {
    for (const s of settings.value) {
      await apiFetch(`/settings/${s.key}`, { method: 'PUT', body: { value: s.value } })
    }
    showToast('Ayarlar kaydedildi.', 'success')
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
      <div><h1>Genel Ayarlar</h1><p>Site geneli yapilandirma ve e-posta ayarlarini yonetin.</p></div>
      <div class="page-actions">
        <button class="btn btn-gold" :disabled="saving" @click="saveAll">
          <template v-if="saving"><span class="loading-spin"></span></template>
          <template v-else><i class="fa-solid fa-check"></i> Tamamini Kaydet</template>
        </button>
      </div>
    </div>

    <div v-for="(group, name) in grouped" :key="name" class="panel" style="margin-bottom:20px;">
      <div class="panel-header">
        <span class="panel-title">
          <i :class="groupIcons[name] || 'fa-solid fa-gear'" style="margin-right:8px;color:var(--gold);"></i>
          {{ groupTitles[name] || name }}
        </span>
      </div>
      <div class="panel-body">
        <div v-if="name === 'email'" style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:16px;font-size:13px;color:var(--text-muted);">
          <i class="fa-brands fa-google" style="color:var(--gold);margin-right:6px;"></i>
          Gmail App Password: Google Hesabi → Guvenlik → 2-Adimli Dogrulama → Uygulama Sifreleri
          | SMTP: <code>smtp.gmail.com</code> Port: <code>587</code>
        </div>
        <div class="form-row" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
          <div v-for="s in group" :key="s.key" class="form-group">
            <label class="form-label">{{ s.label }}</label>
            <select v-if="s.key === 'smtp_mode'" v-model="s.value" class="form-control">
              <option value="log">Log Modu (test)</option>
              <option value="smtp">Gmail SMTP</option>
            </select>
            <input v-else-if="s.key === 'smtp_pass'" v-model="s.value" type="password" class="form-control" placeholder="Google App Password" autocomplete="new-password">
            <input v-else v-model="s.value" type="text" class="form-control" :placeholder="s.label">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
