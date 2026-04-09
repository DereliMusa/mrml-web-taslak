<script setup>
definePageMeta({ layout: 'admin', ssr: false })
import AdminCrudPage from '~/components/AdminCrudPage.vue'

const config = {
  title: 'Uyeler',
  subtitle: 'Lab ekibini yonetin.',
  apiPath: '/members',
  addLabel: 'Uye Ekle',
  columns: [
    { key: '_avatar', label: 'Fotograf', type: 'avatar' },
    { key: 'name', label: 'Ad Soyad', bold: true },
    { key: 'title', label: 'Unvan', muted: true },
    { key: 'role', label: 'Rol', type: 'badge', map: { pi: 'Ogretim Uyesi', phd: 'PhD', msc: 'Yuksek Lisans', undergrad: 'Lisans', alumni: 'Mezun' } },
    { key: 'is_active', label: 'Durum', type: 'status', trueLabel: 'Aktif', falseLabel: 'Pasif' },
  ],
  fields: [
    { key: 'name', label: 'Ad Soyad *', required: true },
    { key: 'slug', label: 'Slug (URL)' },
    { key: 'title', label: 'Unvan' },
    { key: 'role', label: 'Rol', type: 'select', options: [
      { value: 'pi', label: 'Ogretim Uyesi / PI' },
      { value: 'phd', label: 'PhD Ogrencisi' },
      { value: 'msc', label: 'Yuksek Lisans' },
      { value: 'undergrad', label: 'Lisans' },
      { value: 'alumni', label: 'Mezun' },
    ]},
    { key: 'email', label: 'E-posta', type: 'email' },
    { key: 'bio', label: 'Biyografi', type: 'textarea' },
    { key: 'photo_url', label: 'Profil Fotografi', type: 'image' },
    { key: 'social_scholar', label: 'Google Scholar URL' },
    { key: 'social_orcid', label: 'ORCID URL' },
    { key: 'social_linkedin', label: 'LinkedIn URL' },
    { key: 'social_github', label: 'GitHub URL' },
    { key: 'social_researchgate', label: 'ResearchGate URL' },
    { key: 'order_index', label: 'Siralama', type: 'number' },
    { key: 'is_active', label: 'Aktif', type: 'toggle', defaultVal: true },
  ],
}
</script>

<template>
  <AdminCrudPage v-bind="config" />
</template>
