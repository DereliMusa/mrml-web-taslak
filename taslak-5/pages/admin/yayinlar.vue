<script setup>
definePageMeta({ layout: 'admin', ssr: false })
</script>

<template>
  <AdminCrudPage
    title="Yayinlar"
    subtitle="Bilimsel yayinlari yonetin."
    api-path="/publications"
    add-label="Yayin Ekle"
    search-key="title"
    :columns="[
      { key: 'title', label: 'Baslik', bold: true },
      { key: 'authors', label: 'Yazarlar', muted: true },
      { key: 'year', label: 'Yil' },
      { key: 'pub_type', label: 'Tur', type: 'badge', map: { article: 'Makale', conference: 'Konferans', thesis: 'Tez', book: 'Kitap', preprint: 'Preprint' } },
      { key: 'is_featured', label: 'One Cikan', type: 'status', trueLabel: 'Evet', falseLabel: 'Hayir' },
    ]"
    :fields="[
      { key: 'title', label: 'Yayin Basligi *', required: true },
      { key: 'authors', label: 'Yazarlar *', required: true },
      { key: 'journal', label: 'Dergi / Konferans' },
      { key: 'year', label: 'Yil', type: 'number' },
      { key: 'pub_type', label: 'Tur', type: 'select', options: [
        { value: 'article', label: 'Dergi Makalesi' },
        { value: 'conference', label: 'Konferans Bildirisi' },
        { value: 'thesis', label: 'Tez' },
        { value: 'book', label: 'Kitap / Bolum' },
        { value: 'preprint', label: 'Preprint' },
      ]},
      { key: 'doi', label: 'DOI / URL' },
      { key: 'abstract', label: 'Ozet', type: 'textarea' },
      { key: 'keywords', label: 'Anahtar Kelimeler' },
      { key: 'is_featured', label: 'One Cikan', type: 'toggle' },
    ]"
  />
</template>
