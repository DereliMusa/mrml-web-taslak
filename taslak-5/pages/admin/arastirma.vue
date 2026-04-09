<script setup>
definePageMeta({ layout: 'admin', ssr: false })
</script>

<template>
  <AdminCrudPage
    title="Arastirma Alanlari"
    subtitle="Lab arastirma alanlarini yonetin."
    api-path="/research-areas"
    add-label="Alan Ekle"
    search-key="name"
    :columns="[
      { key: 'name', label: 'Alan Adi', bold: true },
      { key: 'icon', label: 'Ikon' },
      { key: 'is_active', label: 'Durum', type: 'status', trueLabel: 'Aktif', falseLabel: 'Pasif' },
    ]"
    :fields="[
      { key: 'name', label: 'Alan Adi *', required: true },
      { key: 'slug', label: 'Slug (URL)' },
      { key: 'description', label: 'Aciklama', type: 'textarea' },
      { key: 'icon', label: 'Font Awesome Ikon Sinifi', placeholder: 'fa-solid fa-flask' },
      { key: 'color', label: 'Renk (hex)', placeholder: '#6366f1', type: 'color' },
      { key: 'order_index', label: 'Siralama', type: 'number' },
      { key: 'is_active', label: 'Aktif', type: 'toggle', defaultVal: true },
    ]"
  />
</template>
