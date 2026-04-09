<script setup>
definePageMeta({ layout: 'admin', ssr: false })

const { checkAuth, user } = useAuth()
const { apiFetch } = useApi()
const { showToast } = useToast()

const users = ref([])
const modalOpen = ref(false)
const editUser = ref(null)
const form = ref({})
const saving = ref(false)
const confirmOpen = ref(false)
const confirmId = ref(null)
const otpEmail = ref('')
const otpScope = ref('blog')
const otpLoading = ref(false)

onMounted(async () => {
  const me = await checkAuth()
  if (me?.role !== 'admin') { navigateTo('/admin/dashboard'); return }
  await loadUsers()
})

async function loadUsers() {
  try { users.value = await apiFetch('/users') }
  catch (e) { showToast(e.message, 'error') }
}

function openAdd() {
  editUser.value = null
  form.value = { role: 'member', is_active: true }
  modalOpen.value = true
}

function openEdit(u) {
  editUser.value = u
  form.value = { ...u, password: '' }
  modalOpen.value = true
}

async function save() {
  saving.value = true
  try {
    const body = { ...form.value }
    if (!body.password) delete body.password
    if (editUser.value) {
      await apiFetch(`/users/${editUser.value.id}`, { method: 'PUT', body })
      showToast('Hesap guncellendi.', 'success')
    } else {
      await apiFetch('/users', { method: 'POST', body })
      showToast('Hesap olusturuldu.', 'success')
    }
    modalOpen.value = false
    await loadUsers()
  } catch (e) {
    showToast(e.message, 'error')
  } finally {
    saving.value = false
  }
}

async function doDelete() {
  confirmOpen.value = false
  try {
    await apiFetch(`/users/${confirmId.value}`, { method: 'DELETE' })
    showToast('Hesap silindi.', 'success')
    await loadUsers()
  } catch (e) { showToast(e.message, 'error') }
}

async function sendOTP() {
  if (!otpEmail.value) { showToast('E-posta giriniz.', 'error'); return }
  otpLoading.value = true
  try {
    const res = await apiFetch('/auth/send-token', { method: 'POST', body: { email: otpEmail.value, scope: otpScope.value } })
    showToast(res.message, 'success')
    otpEmail.value = ''
  } catch (e) { showToast(e.message, 'error') }
  finally { otpLoading.value = false }
}
</script>

<template>
  <div>
    <div class="page-header">
      <div><h1>Kullanici Hesaplari</h1><p>Admin ve uye hesaplarini yonetin.</p></div>
      <div class="page-actions"><button class="btn btn-gold" @click="openAdd"><i class="fa-solid fa-plus"></i> Hesap Ekle</button></div>
    </div>

    <!-- OTP -->
    <div class="panel" style="margin-bottom:20px;">
      <div class="panel-header"><span class="panel-title"><i class="fa-solid fa-paper-plane" style="margin-right:8px;color:var(--gold);"></i>Gecici Giris Linki Gonder</span></div>
      <div class="panel-body">
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;">
          <div class="form-group" style="flex:2;min-width:200px;"><label class="form-label">Alici E-posta</label><input v-model="otpEmail" type="email" class="form-control"></div>
          <div class="form-group" style="flex:1;min-width:140px;"><label class="form-label">Kapsam</label>
            <select v-model="otpScope" class="form-control"><option value="blog">Blog</option><option value="news">Haber</option><option value="publications">Yayin</option><option value="full">Tam Erisim</option></select>
          </div>
          <div class="form-group"><label class="form-label">&nbsp;</label><button class="btn btn-gold" :disabled="otpLoading" @click="sendOTP"><span v-if="otpLoading" class="loading-spin"></span><template v-else><i class="fa-solid fa-paper-plane"></i> Gonder</template></button></div>
        </div>
        <p class="form-hint">Link 24 saat gecerli ve tek kullanimlik.</p>
      </div>
    </div>

    <!-- Table -->
    <div class="panel">
      <table class="data-table">
        <thead><tr><th>Kullanici</th><th>E-posta</th><th>Rol</th><th>Durum</th><th>Islemler</th></tr></thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td><div style="display:flex;align-items:center;gap:10px;">
              <div style="width:30px;height:30px;border-radius:50%;background:var(--gold-glow);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:var(--gold);">{{ (u.username||'?')[0].toUpperCase() }}</div>
              <strong>{{ u.username }}</strong>
              <span v-if="u.id === user?.id" class="badge badge-gold" style="margin-left:4px;">Sen</span>
            </div></td>
            <td style="color:var(--text-muted);">{{ u.email }}</td>
            <td><span class="badge" :class="u.role === 'admin' ? 'badge-gold' : 'badge-blue'">{{ u.role === 'admin' ? 'Yonetici' : 'Uye' }}</span></td>
            <td><span class="badge" :class="u.is_active ? 'badge-green' : 'badge-gray'">{{ u.is_active ? 'Aktif' : 'Pasif' }}</span></td>
            <td><div class="table-actions">
              <button class="btn btn-ghost btn-sm" @click="openEdit(u)"><i class="fa-solid fa-pen"></i></button>
              <button v-if="u.id !== user?.id" class="btn btn-danger btn-sm" @click="confirmId = u.id; confirmOpen = true"><i class="fa-solid fa-trash"></i></button>
            </div></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="modalOpen = false">
      <div class="modal">
        <div class="modal-header"><h3>{{ editUser ? 'Hesap Duzenle' : 'Yeni Hesap' }}</h3><button class="modal-close" @click="modalOpen = false"><i class="fa-solid fa-xmark"></i></button></div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Kullanici Adi *</label><input v-model="form.username" type="text" class="form-control"></div>
          <div class="form-group"><label class="form-label">E-posta *</label><input v-model="form.email" type="email" class="form-control"></div>
          <div class="form-group"><label class="form-label">Sifre {{ editUser ? '(bos birakin = degistirme)' : '*' }}</label><input v-model="form.password" type="password" class="form-control" autocomplete="new-password"></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Rol</label><select v-model="form.role" class="form-control"><option value="admin">Yonetici</option><option value="member">Uye</option></select></div>
            <div class="form-group" style="display:flex;align-items:flex-end;"><label class="toggle-switch"><input type="checkbox" v-model="form.is_active"><span class="toggle-track"></span><span class="toggle-label">Aktif</span></label></div>
          </div>
        </div>
        <div class="modal-footer"><button class="btn btn-outline" @click="modalOpen = false">Iptal</button><button class="btn btn-gold" :disabled="saving" @click="save"><span v-if="saving" class="loading-spin"></span><template v-else><i class="fa-solid fa-check"></i> Kaydet</template></button></div>
      </div>
    </div>

    <!-- Confirm -->
    <div v-if="confirmOpen" class="modal-overlay">
      <div class="modal" style="max-width:400px;">
        <div class="modal-body"><p>Bu hesabi silmek istediginizden emin misiniz?</p></div>
        <div class="modal-footer"><button class="btn btn-outline" @click="confirmOpen = false">Iptal</button><button class="btn btn-danger" @click="doDelete"><i class="fa-solid fa-trash"></i> Sil</button></div>
      </div>
    </div>
  </div>
</template>
