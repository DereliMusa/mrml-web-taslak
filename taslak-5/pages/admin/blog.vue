<script setup>
definePageMeta({ layout: 'admin', ssr: false })
</script>

<template>
  <AdminCrudPage
    title="Blog"
    subtitle="Blog yazilarini yonetin."
    api-path="/blog"
    add-label="Yazi Ekle"
    search-key="title"
    :columns="[
      { key: '_avatar', label: 'Gorsel', type: 'avatar' },
      { key: 'title', label: 'Baslik', bold: true },
      { key: 'author_name', label: 'Yazar', muted: true },
      { key: 'category', label: 'Kategori' },
      { key: 'status', label: 'Durum', type: 'badge', map: { draft: 'Taslak', published: 'Yayinda', archived: 'Arsiv' } },
    ]"
    :fields="[
      { key: 'title', label: 'Baslik *', required: true },
      { key: 'slug', label: 'Slug (URL)' },
      { key: 'category', label: 'Kategori' },
      { key: 'tags', label: 'Etiketler (virgullu)' },
      { key: 'content', label: 'Icerik', type: 'textarea' },
      { key: 'cover_image', label: 'Kapak Gorseli', type: 'image' },
      { key: 'status', label: 'Durum', type: 'select', options: [
        { value: 'draft', label: 'Taslak' },
        { value: 'published', label: 'Yayinla' },
        { value: 'archived', label: 'Arsivle' },
      ]},
    ]"
  />
</template>
