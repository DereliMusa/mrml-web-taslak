<script setup>
const route = useRoute()
const isScrolled = ref(false)
const mobileOpen = ref(false)
const theme = ref('dark')

const navLinks = [
  { href: '/hakkinda', label: 'Hakkinda' },
  { href: '/arastirmalar', label: 'Arastirmalar' },
  { href: '/projeler', label: 'Projeler' },
  { href: '/ekip', label: 'Ekip' },
  { href: '/yayinlar', label: 'Yayinlar' },
  { href: '/haberler', label: 'Haberler' },
]

onMounted(() => {
  const saved = localStorage.getItem('mrml-theme')
  if (saved === 'light') {
    theme.value = 'light'
    document.documentElement.setAttribute('data-theme', 'light')
  }
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 60
  })
})

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  if (theme.value === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
  localStorage.setItem('mrml-theme', theme.value)
}

function isActive(href) {
  return route.path === href || route.path.startsWith(href + '/')
}
</script>

<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }" id="navbar">
    <div class="nav-container">
      <NuxtLink href="/" class="logo">
        <span class="logo-mr">Mr</span><span class="logo-ml">ML</span> <span class="logo-lab">Lab</span>
      </NuxtLink>

      <div class="nav-links" :class="{ open: mobileOpen }">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="nav-link"
          :class="{ active: isActive(link.href) }"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <NuxtLink href="/basvur" class="btn btn-outline nav-cta">Basvur</NuxtLink>

      <button id="theme-toggle" class="theme-toggle" aria-label="Temayi Degistir" @click="toggleTheme">
        <i class="fa-solid fa-sun icon-sun"></i>
        <i class="fa-solid fa-moon icon-moon"></i>
      </button>

      <button class="mobile-menu-btn" @click="mobileOpen = !mobileOpen">
        <i class="fa-solid" :class="mobileOpen ? 'fa-xmark' : 'fa-bars'"></i>
      </button>
    </div>
  </nav>
</template>
