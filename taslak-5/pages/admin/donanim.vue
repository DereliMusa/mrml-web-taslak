<script setup>
definePageMeta({ layout: 'admin', ssr: false })
</script>

<template>
  <AdminCrudPage
    title="Donanim"
    subtitle="Lab ekipmanlarini yonetin."
    api-path="/equipment"
    add-label="Donanim Ekle"
    search-key="name"
    :columns="[
      { key: '_avatar', label: 'Gorsel', type: 'avatar' },
      { key: 'name', label: 'Donanim Adi', bold: true },
      { key: 'category', label: 'Kategori', type: 'badge', map: { lab: 'Laboratuvar', experiment: 'Deney', simulation: 'Simulasyon', compute: 'Hesaplama' } },
      { key: 'is_active', label: 'Durum', type: 'status', trueLabel: 'Aktif', falseLabel: 'Pasif' },
    ]"
    :fields="[
      { key: 'name', label: 'Donanim Adi *', required: true },
      { key: 'slug', label: 'Slug (URL)' },
      { key: 'category', label: 'Kategori', type: 'select', options: [
        { value: 'lab', label: 'Laboratuvar' },
        { value: 'experiment', label: 'Deney' },
        { value: 'simulation', label: 'Simulasyon' },
        { value: 'compute', label: 'Hesaplama' },
      ]},
      { key: 'description', label: 'Aciklama', type: 'textarea' },
      { key: 'specs', label: 'Teknik Ozellikler', type: 'textarea' },
      { key: 'photo_url', label: 'Gorsel', type: 'image' },
      { key: 'order_index', label: 'Siralama', type: 'number' },
      { key: 'is_active', label: 'Aktif', type: 'toggle', defaultVal: true },
    ]"
  />
</template>
