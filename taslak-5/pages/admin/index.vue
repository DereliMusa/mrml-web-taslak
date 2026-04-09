<script setup>
definePageMeta({ layout: false })

const { loginWithPassword, loginWithToken } = useAuth()
const router = useRouter()
const route = useRoute()

const activeTab = ref('admin')
const loginUsername = ref('')
const loginPassword = ref('')
const loginToken = ref('')
const loginError = ref('')
const tokenError = ref('')
const loading = ref(false)

// URL'de token parametresi varsa otomatik token tab'ini ac
onMounted(() => {
  const token = route.query.token
  if (token) {
    loginToken.value = token
    activeTab.value = 'token'
  }
  // Zaten giris yapilmissa dashboard'a git
  const existing = localStorage.getItem('mrml_token')
  if (existing) {
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${existing}` } })
      .then(r => { if (r.ok) router.push('/admin/dashboard') })
      .catch(() => {})
  }
})

async function handleAdminLogin() {
  loginError.value = ''
  loading.value = true
  try {
    await loginWithPassword(loginUsername.value, loginPassword.value)
    router.push('/admin/dashboard')
  } catch (e) {
    loginError.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleTokenLogin() {
  tokenError.value = ''
  loading.value = true
  try {
    await loginWithToken(loginToken.value)
    router.push('/admin/dashboard')
  } catch (e) {
    tokenError.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-logo">
        <div class="login-logo-text">
          <span class="logo-mr">Mr</span><span class="logo-ml">ML</span><span class="logo-lab"> Lab</span>
        </div>
        <small>Admin Paneli</small>
      </div>

      <div class="login-card">
        <h2>Giris Yap</h2>
        <p>Yonetici hesabinizla veya gecici linkle giris yapin.</p>

        <div class="login-tabs">
          <button class="login-tab" :class="{ active: activeTab === 'admin' }" @click="activeTab = 'admin'">Yonetici</button>
          <button class="login-tab" :class="{ active: activeTab === 'token' }" @click="activeTab = 'token'">Gecici Link</button>
        </div>

        <!-- Admin girisi -->
        <div v-if="activeTab === 'admin'">
          <form @submit.prevent="handleAdminLogin">
            <div class="form-group">
              <label class="form-label">Kullanici Adi / E-posta</label>
              <input v-model="loginUsername" type="text" class="form-control" placeholder="admin" autocomplete="username" required>
            </div>
            <div class="form-group">
              <label class="form-label">Sifre</label>
              <input v-model="loginPassword" type="password" class="form-control" placeholder="••••••••" autocomplete="current-password" required>
            </div>
            <p v-if="loginError" class="form-hint" style="color: var(--danger);">{{ loginError }}</p>
            <button type="submit" class="btn btn-gold login-submit" :disabled="loading">
              <span v-if="loading" class="loading-spin"></span>
              <template v-else>Giris Yap <i class="fa-solid fa-arrow-right"></i></template>
            </button>
          </form>
        </div>

        <!-- Token girisi -->
        <div v-if="activeTab === 'token'">
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">E-posta ile gonderilen token kodunu girin.</p>
          <form @submit.prevent="handleTokenLogin">
            <div class="form-group">
              <label class="form-label">Gecici Token</label>
              <input v-model="loginToken" type="text" class="form-control" placeholder="a3f8c2d1..." autocomplete="off">
            </div>
            <p v-if="tokenError" class="form-hint" style="color: var(--danger);">{{ tokenError }}</p>
            <button type="submit" class="btn btn-gold login-submit" :disabled="loading">
              <span v-if="loading" class="loading-spin"></span>
              <template v-else>Giris Yap <i class="fa-solid fa-arrow-right"></i></template>
            </button>
          </form>
        </div>
      </div>

      <p class="login-footer">
        <NuxtLink href="/" style="color: var(--text-muted);">Ana siteye don</NuxtLink>
      </p>
    </div>
  </div>
</template>
