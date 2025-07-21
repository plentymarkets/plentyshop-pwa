<template>
  <VCard flat>
    <v-text-field
      v-model="search"
      density="compact"
      label="Search"
      prepend-inner-icon="mdi-magnify"
      variant="solo-filled"
      class="mb-5 border border-gray-300 rounded"
      flat
      hide-details
      single-line
    />

    <v-data-table
      v-model:search="search"
      :filter-keys="['name']"
      class="border border-gray-300 rounded-md"
      :items="items"
      :headers="headers"
    >
      <template #item.name="{ item }">
        <div class="flex items-center gap-2">
          <NuxtImg :src="item.image" alt="table thumbnail" class="w-8 h-8 rounded object-cover" />
          <span>{{ item.name }}</span>
        </div>
      </template>
    </v-data-table>
  </VCard>
</template>

<script setup>
import { VCard, VTextField, VDataTable } from 'vuetify/components';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(['select']);
const headers = [
  { title: 'File name', key: 'name' },
  { title: 'Image size', key: 'size' },
  { title: 'Last change', key: 'change' },
];

const search = ref('');
const items = [
  {
    name: 'Nebula GTX 3080',
    image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
    size: '5.25 MB',
    change: 'Apr 6, 2024, 4:55:05 PM',
  },
  {
    name: 'Galaxy RTX 3080',
    image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
    size: '5.25 MB',
    change: 'Apr 6, 2024, 4:55:05 PM',
  },
  {
    name: 'Orion RX 6800 XT',
    image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
    size: '5.25 MB',
    change: 'Apr 6, 2024, 4:55:05 PM',
  },
  {
    name: 'Vortex RTX 3090',
    image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
    size: '5.25 MB',
    change: 'Apr 6, 2024, 4:55:05 PM',
  },
  {
    name: 'Cosmos GTX 1660 Super',
    image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
    size: '5.25 MB',
    change: 'Apr 6, 2024, 4:55:05 PM',
  },

  {
    name: 'Nebula GTX 3080',
    image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
    size: '5.25 MB',
    change: 'Apr 6, 2024, 4:55:05 PM',
  },
  {
    name: 'Galaxy RTX 3080',
    image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
    size: '5.25 MB',
    change: 'Apr 6, 2024, 4:55:05 PM',
  },
  {
    name: 'Orion RX 6800 XT',
    image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
    size: '5.25 MB',
    change: 'Apr 6, 2024, 4:55:05 PM',
  },
  {
    name: 'Vortex RTX 3090',
    image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
    size: '5.25 MB',
    change: 'Apr 6, 2024, 4:55:05 PM',
  },
  {
    name: 'Cosmos GTX 1660 Super',
    image: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Test_Banner_Person/guy-320.avif',
    size: '5.25 MB',
    change: 'Apr 6, 2024, 4:55:05 PM',
  },
];
</script>

<style>
.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td,
.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > th {
  border-bottom: none !important;
}
</style>
