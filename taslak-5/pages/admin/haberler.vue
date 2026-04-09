<script setup>
definePageMeta({ layout: 'admin', ssr: false })
</script>

<template>
  <AdminCrudPage
    title="Haberler"
    subtitle="Lab haberlerini yonetin."
    api-path="/news"
    add-label="Haber Ekle"
    search-key="title"
    :columns="[
      { key: '_avatar', label: 'Gorsel', type: 'avatar' },
      { key: 'title', label: 'Baslik', bold: true },
      { key: 'category', label: 'Kategori', type: 'badge', map: { general: 'Genel', award: 'Odul', event: 'Etkinlik', publication: 'Yayin', announcement: 'Duyuru' } },
      { key: 'status', label: 'Durum', type: 'badge', map: { draft: 'Taslak', published: 'Yayinda', archived: 'Arsiv' } },
    ]"
    :fields="[
      { key: 'title', label: 'Baslik *', required: true },
      { key: 'slug', label: 'Slug (URL)' },
      { key: 'category', label: 'Kategori', type: 'select', options: [
        { value: 'general', label: 'Genel' },
        { value: 'award', label: 'Odul' },
        { value: 'event', label: 'Etkinlik' },
        { value: 'publication', label: 'Yayin' },
        { value: 'announcement', label: 'Duyuru' },
      ]},
      { key: 'tags', label: 'Etiketler (virgullu)' },
      { key: 'content', label: 'Icerik', type: 'textarea' },
      { key: 'cover_image', label: 'Gorsel', type: 'image' },
      { key: 'status', label: 'Durum', type: 'select', options: [
        { value: 'draft', label: 'Taslak' },
        { value: 'published', label: 'Yayinla' },
        { value: 'archived', label: 'Arsivle' },
      ]},
    ]"
  />
</template>
