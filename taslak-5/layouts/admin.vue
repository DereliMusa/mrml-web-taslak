<script setup>
// Admin layout -- admin.css'i burada yukle, sadece admin sayfalarinda aktif olsun
import '~/assets/css/admin.css'

const { user, logout, setUserFromStorage } = useAuth()
const route = useRoute()

onMounted(() => {
  setUserFromStorage()
})

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'fa-solid fa-chart-line', key: 'dashboard' },
  { label: 'Uyeler', href: '/admin/uyeler', icon: 'fa-solid fa-users', key: 'uyeler' },
  { label: 'Arastirma Alanlari', href: '/admin/arastirma', icon: 'fa-solid fa-flask', key: 'arastirma' },
  { label: 'Projeler', href: '/admin/projeler', icon: 'fa-solid fa-diagram-project', key: 'projeler' },
  { label: 'Yayinlar', href: '/admin/yayinlar', icon: 'fa-regular fa-file-lines', key: 'yayinlar' },
  { label: 'Donanim', href: '/admin/donanim', icon: 'fa-solid fa-microscope', key: 'donanim' },
  { label: 'Blog', href: '/admin/blog', icon: 'fa-solid fa-pen-nib', key: 'blog' },
  { label: 'Haberler', href: '/admin/haberler', icon: 'fa-solid fa-newspaper', key: 'haberler' },
  { label: 'Sosyal Medya', href: '/admin/sosyal', icon: 'fa-solid fa-share-nodes', key: 'sosyal' },
  { label: 'Genel Ayarlar', href: '/admin/ayarlar', icon: 'fa-solid fa-gear', key: 'ayarlar' },
  { label: 'Hesaplar', href: '/admin/hesaplar', icon: 'fa-solid fa-shield-halved', key: 'hesaplar' },
]

const sidebarOpen = ref(false)

function isActive(href) {
  return route.path === href || route.path.startsWith(href + '/')
}

function userInitial() {
  const u = user.value
  if (!u) return 'A'
  return (u.username || u.email || '?')[0].toUpperCase()
}

function userName() {
  const u = user.value
  if (!u) return ''
  return u.username || u.email
}

function userRole() {
  return user.value?.role === 'admin' ? 'Yonetici' : 'Uye'
}
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ open: sidebarOpen }" id="admin-sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-text">
          <span class="logo-mr">Mr</span><span class="logo-ml">ML</span><span class="logo-lab"> Lab</span>
        </div>
        <div class="sidebar-badge">Admin Paneli</div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <span class="nav-section-label">Genel</span>
          <NuxtLink href="/admin/dashboard" class="nav-item" :class="{ active: isActive('/admin/dashboard') }">
            <i class="fa-solid fa-chart-line"></i> Dashboard
          </NuxtLink>
        </div>
        <div class="nav-section">
          <span class="nav-section-label">Icerik</span>
          <NuxtLink v-for="item in navItems.slice(1, 6)" :key="item.key" :href="item.href" class="nav-item" :class="{ active: isActive(item.href) }">
            <i :class="item.icon"></i> {{ item.label }}
          </NuxtLink>
        </div>
        <div class="nav-section">
          <span class="nav-section-label">Medya</span>
          <NuxtLink v-for="item in navItems.slice(6, 8)" :key="item.key" :href="item.href" class="nav-item" :class="{ active: isActive(item.href) }">
            <i :class="item.icon"></i> {{ item.label }}
          </NuxtLink>
        </div>
        <div class="nav-section">
          <span class="nav-section-label">Ayarlar</span>
          <NuxtLink v-for="item in navItems.slice(8)" :key="item.key" :href="item.href" class="nav-item" :class="{ active: isActive(item.href) }">
            <i :class="item.icon"></i> {{ item.label }}
          </NuxtLink>
        </div>
      </nav>

      <div class="sidebar-user">
        <div class="user-avatar">{{ userInitial() }}</div>
        <div class="user-info">
          <div class="user-name">{{ userName() }}</div>
          <div class="user-role">{{ userRole() }}</div>
        </div>
        <button class="logout-btn" title="Cikis Yap" @click="logout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </aside>

    <div class="sidebar-overlay" :class="{ open: sidebarOpen }" @click="sidebarOpen = false"></div>

    <!-- Main -->
    <main class="admin-main">
      <header class="admin-topbar">
        <button class="mobile-menu-toggle" @click="sidebarOpen = !sidebarOpen">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div class="topbar-title">
          <slot name="title">MrML Lab Admin</slot>
        </div>
        <div class="topbar-actions">
          <a href="/" target="_blank" class="btn btn-outline btn-sm">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Siteyi Gor
          </a>
        </div>
      </header>

      <div class="admin-content">
        <slot />
      </div>
    </main>

    <!-- Toast container -->
    <AdminToast />
  </div>
</template>
