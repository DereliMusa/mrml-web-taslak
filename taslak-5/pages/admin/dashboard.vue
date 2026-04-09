<script setup>
definePageMeta({ layout: 'admin', ssr: false })

const { checkAuth } = useAuth()
const { apiFetch } = useApi()
const { showToast } = useToast()

const stats = ref(null)
const user = ref(null)
const otpEmail = ref('')
const otpScope = ref('blog')
const otpLoading = ref(false)

onMounted(async () => {
  user.value = await checkAuth()
  if (!user.value) return
  try {
    stats.value = await apiFetch('/stats')
  } catch (e) {
    showToast(e.message, 'error')
  }
})

async function sendOTP() {
  if (!otpEmail.value) { showToast('E-posta giriniz.', 'error'); return }
  otpLoading.value = true
  try {
    const res = await apiFetch('/auth/send-token', { method: 'POST', body: { email: otpEmail.value, scope: otpScope.value } })
    showToast(res.message, 'success')
    otpEmail.value = ''
  } catch (e) {
    showToast(e.message, 'error')
  } finally {
    otpLoading.value = false
  }
}

const statCards = computed(() => {
  if (!stats.value) return []
  return [
    { label: 'Aktif Uye', value: stats.value.members, icon: 'fa-solid fa-users', color: '#6366f1' },
    { label: 'Donanim', value: stats.value.equipment, icon: 'fa-solid fa-microscope', color: '#10b981' },
    { label: 'Yayin', value: stats.value.publications, icon: 'fa-regular fa-file-lines', color: '#C69749' },
    { label: 'Aktif Proje', value: stats.value.projects, icon: 'fa-solid fa-diagram-project', color: '#3b82f6' },
    { label: 'Blog (Yayin)', value: stats.value.blog_published, icon: 'fa-solid fa-pen-nib', color: '#ec4899' },
    { label: 'Haber', value: stats.value.news_published, icon: 'fa-solid fa-newspaper', color: '#f59e0b' },
  ]
})
</script>

<template>
  <div>
    <template #title>Dashboard</template>

    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Merhaba, <strong>{{ user?.username }}</strong>. Lab iceriklerinize genel bakis.</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid" v-if="stats">
      <div v-for="s in statCards" :key="s.label" class="stat-card">
        <div class="stat-icon" :style="{ background: s.color + '20', color: s.color }">
          <i :class="s.icon"></i>
        </div>
        <div class="stat-value">{{ s.value }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </div>
    </div>
    <div v-else class="page-loading">
      <div class="loading-spin"></div> Istatistikler yukleniyor...
    </div>

    <!-- Hizli islemler -->
    <div class="panel" style="margin-top:24px;">
      <div class="panel-header"><span class="panel-title">Hizli Islemler</span></div>
      <div class="panel-body">
        <div class="quick-actions">
          <NuxtLink href="/admin/blog" class="quick-action">
            <i class="fa-solid fa-pen-nib"></i><span>Blog Yazisi</span>
          </NuxtLink>
          <NuxtLink href="/admin/haberler" class="quick-action">
            <i class="fa-solid fa-newspaper"></i><span>Haber Ekle</span>
          </NuxtLink>
          <NuxtLink href="/admin/uyeler" class="quick-action">
            <i class="fa-solid fa-user-plus"></i><span>Uye Ekle</span>
          </NuxtLink>
          <NuxtLink href="/admin/yayinlar" class="quick-action">
            <i class="fa-regular fa-file-lines"></i><span>Yayin Ekle</span>
          </NuxtLink>
          <NuxtLink href="/admin/projeler" class="quick-action">
            <i class="fa-solid fa-diagram-project"></i><span>Proje Ekle</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- OTP Gonder -->
    <div v-if="user?.role === 'admin'" class="panel" style="margin-top:20px;">
      <div class="panel-header">
        <span class="panel-title"><i class="fa-solid fa-paper-plane" style="margin-right:8px;color:var(--gold);"></i>Gecici Giris Linki Gonder</span>
      </div>
      <div class="panel-body">
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;">
          <div class="form-group" style="flex:2;min-width:200px;">
            <label class="form-label">Alici E-posta</label>
            <input v-model="otpEmail" type="email" class="form-control" placeholder="arastirmaci@mrml-lab.edu">
          </div>
          <div class="form-group" style="flex:1;min-width:140px;">
            <label class="form-label">Kapsam</label>
            <select v-model="otpScope" class="form-control">
              <option value="blog">Blog</option>
              <option value="news">Haber</option>
              <option value="publications">Yayin</option>
              <option value="full">Tam Erisim</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">&nbsp;</label>
            <button class="btn btn-gold" :disabled="otpLoading" @click="sendOTP">
              <span v-if="otpLoading" class="loading-spin"></span>
              <template v-else><i class="fa-solid fa-paper-plane"></i> Gonder</template>
            </button>
          </div>
        </div>
        <p class="form-hint">Link 24 saat gecerli ve tek kullanimlik.</p>
      </div>
    </div>
  </div>
</template>
