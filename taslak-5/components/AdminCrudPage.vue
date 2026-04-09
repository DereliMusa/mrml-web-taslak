<script setup>
const props = defineProps({
  title: String,
  subtitle: String,
  apiPath: String,
  addLabel: { type: String, default: 'Ekle' },
  columns: { type: Array, default: () => [] },
  fields: { type: Array, default: () => [] },
  searchKey: { type: String, default: 'name' },
  adminOnly: { type: Boolean, default: false },
})

const { checkAuth } = useAuth()
const { apiFetch, uploadFile } = useApi()
const { showToast } = useToast()

const items = ref([])
const loading = ref(true)
const search = ref('')
const modalOpen = ref(false)
const editItem = ref(null)
const formData = ref({})
const saving = ref(false)
const confirmId = ref(null)
const confirmName = ref('')
const confirmOpen = ref(false)

onMounted(async () => {
  await checkAuth()
  await loadItems()
})

async function loadItems() {
  loading.value = true
  try {
    items.value = await apiFetch(props.apiPath)
  } catch (e) {
    showToast(e.message, 'error')
  } finally {
    loading.value = false
  }
}

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return items.value
  return items.value.filter(i => String(i[props.searchKey] || '').toLowerCase().includes(q))
})

function openAdd() {
  editItem.value = null
  formData.value = {}
  // Defaults
  props.fields.forEach(f => {
    if (f.defaultVal !== undefined) formData.value[f.key] = f.defaultVal
  })
  modalOpen.value = true
}

function openEdit(item) {
  editItem.value = item
  formData.value = { ...item }
  modalOpen.value = true
}

async function save() {
  saving.value = true
  try {
    if (editItem.value) {
      await apiFetch(`${props.apiPath}/${editItem.value.id}`, { method: 'PUT', body: formData.value })
      showToast('Kaydedildi.', 'success')
    } else {
      await apiFetch(props.apiPath, { method: 'POST', body: formData.value })
      showToast('Eklendi.', 'success')
    }
    modalOpen.value = false
    await loadItems()
  } catch (e) {
    showToast(e.message, 'error')
  } finally {
    saving.value = false
  }
}

function askDelete(item) {
  confirmId.value = item.id
  confirmName.value = item[props.searchKey] || item.title || item.name || '#' + item.id
  confirmOpen.value = true
}

async function doDelete() {
  confirmOpen.value = false
  try {
    await apiFetch(`${props.apiPath}/${confirmId.value}`, { method: 'DELETE' })
    showToast('Silindi.', 'success')
    await loadItems()
  } catch (e) {
    showToast(e.message, 'error')
  }
}

async function handleImageUpload(fieldKey, e) {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    const url = await uploadFile(file)
    formData.value[fieldKey] = url
    showToast('Gorsel yuklendi.', 'success')
  } catch (err) {
    showToast(err.message, 'error')
  }
}

function getBadgeLabel(column, value) {
  return column.map?.[value] || value
}

function getStatusClass(value) {
  return value ? 'badge-green' : 'badge-gray'
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1>{{ title }}</h1>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-gold" @click="openAdd">
          <i class="fa-solid fa-plus"></i> {{ addLabel }}
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input v-model="search" type="text" class="search-input" :placeholder="`${title} ara...`">
    </div>

    <!-- Table -->
    <div class="panel">
      <div v-if="loading" class="page-loading"><div class="loading-spin"></div> Yukleniyor...</div>
      <div v-else-if="!filtered.length" class="empty-state">
        <i class="fa-solid fa-inbox"></i>
        <p>Kayit bulunamadi.</p>
        <button class="btn btn-gold" @click="openAdd"><i class="fa-solid fa-plus"></i> {{ addLabel }}</button>
      </div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            <th>Islemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filtered" :key="item.id">
            <td v-for="col in columns" :key="col.key">
              <!-- Avatar -->
              <template v-if="col.type === 'avatar'">
                <div v-if="item.photo_url || item.cover_image" class="table-avatar" :style="{ backgroundImage: `url(${item.photo_url || item.cover_image})` }"></div>
                <div v-else class="table-avatar-placeholder">{{ (item.name || item.title || '?')[0].toUpperCase() }}</div>
              </template>
              <!-- Badge -->
              <template v-else-if="col.type === 'badge'">
                <span class="badge badge-blue">{{ getBadgeLabel(col, item[col.key]) }}</span>
              </template>
              <!-- Status -->
              <template v-else-if="col.type === 'status'">
                <span class="badge" :class="getStatusClass(item[col.key])">{{ item[col.key] ? col.trueLabel : col.falseLabel }}</span>
              </template>
              <!-- Default -->
              <template v-else>
                <span :class="{ 'fw-bold': col.bold, 'text-muted': col.muted }">{{ item[col.key] }}</span>
              </template>
            </td>
            <td>
              <div class="table-actions">
                <button class="btn btn-ghost btn-sm" @click="openEdit(item)"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-danger btn-sm" @click="askDelete(item)"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="modalOpen = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editItem ? 'Duzenle' : addLabel }}</h3>
          <button class="modal-close" @click="modalOpen = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-row" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));">
            <template v-for="field in fields" :key="field.key">
              <div class="form-group" :style="field.fullWidth ? 'grid-column: 1 / -1' : ''">
                <label class="form-label">{{ field.label }}</label>
                <!-- Select -->
                <select v-if="field.type === 'select'" v-model="formData[field.key]" class="form-control">
                  <option v-for="opt in field.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
                <!-- Textarea -->
                <textarea v-else-if="field.type === 'textarea'" v-model="formData[field.key]" class="form-control" rows="4"></textarea>
                <!-- Toggle -->
                <label v-else-if="field.type === 'toggle'" class="toggle-switch">
                  <input type="checkbox" v-model="formData[field.key]">
                  <span class="toggle-track"></span>
                  <span class="toggle-label">Aktif</span>
                </label>
                <!-- Image upload -->
                <div v-else-if="field.type === 'image'">
                  <input type="text" v-model="formData[field.key]" class="form-control" placeholder="/uploads/..." style="margin-bottom:6px;">
                  <input type="file" accept="image/*" @change="handleImageUpload(field.key, $event)" class="file-input">
                  <img v-if="formData[field.key]" :src="formData[field.key]" style="width:80px;height:80px;object-fit:cover;border-radius:6px;margin-top:6px;">
                </div>
                <!-- Default input -->
                <input v-else v-model="formData[field.key]" :type="field.type || 'text'" class="form-control" :placeholder="field.placeholder || ''">
              </div>
            </template>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="modalOpen = false">Iptal</button>
          <button class="btn btn-gold" :disabled="saving" @click="save">
            <span v-if="saving" class="loading-spin"></span>
            <template v-else><i class="fa-solid fa-check"></i> Kaydet</template>
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm delete -->
    <div v-if="confirmOpen" class="modal-overlay">
      <div class="modal" style="max-width:400px;">
        <div class="modal-header"><h3>Silme Onay</h3></div>
        <div class="modal-body">
          <p>"<strong>{{ confirmName }}</strong>" kalici olarak silinecek. Emin misiniz?</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="confirmOpen = false">Iptal</button>
          <button class="btn btn-danger" @click="doDelete"><i class="fa-solid fa-trash"></i> Sil</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-avatar { width: 36px; height: 36px; border-radius: 50%; background-size: cover; background-position: center; border: 2px solid var(--border); }
.table-avatar-placeholder { width: 36px; height: 36px; border-radius: 50%; background: var(--gold-glow); color: var(--gold); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
.fw-bold { font-weight: 600; }
.text-muted { color: var(--text-muted); }
.file-input { font-size: 12px; color: var(--text-muted); }
</style>
