<script setup>
definePageMeta({ layout: 'admin', ssr: false })
</script>

<template>
  <AdminCrudPage
    title="Projeler"
    subtitle="Arastirma projelerini yonetin."
    api-path="/projects"
    add-label="Proje Ekle"
    search-key="title"
    :columns="[
      { key: '_avatar', label: 'Gorsel', type: 'avatar' },
      { key: 'title', label: 'Proje Basligi', bold: true },
      { key: 'status', label: 'Durum', type: 'badge', map: { active: 'Devam Ediyor', completed: 'Tamamlandi', cancelled: 'Iptal' } },
      { key: 'funding_source', label: 'Fon Kaynagi', muted: true },
    ]"
    :fields="[
      { key: 'title', label: 'Proje Basligi *', required: true },
      { key: 'slug', label: 'Slug (URL)' },
      { key: 'summary', label: 'Kisa Ozet', type: 'textarea' },
      { key: 'description', label: 'Detayli Aciklama', type: 'textarea' },
      { key: 'status', label: 'Durum', type: 'select', options: [
        { value: 'active', label: 'Devam Ediyor' },
        { value: 'completed', label: 'Tamamlandi' },
        { value: 'cancelled', label: 'Iptal Edildi' },
      ]},
      { key: 'funding_source', label: 'Fon Kaynagi' },
      { key: 'funding_amount', label: 'Fon Miktari' },
      { key: 'start_date', label: 'Baslangic Tarihi', type: 'date' },
      { key: 'end_date', label: 'Bitis Tarihi', type: 'date' },
      { key: 'cover_image', label: 'Kapak Gorseli', type: 'image' },
      { key: 'is_featured', label: 'One Cikan', type: 'toggle' },
    ]"
  />
</template>
