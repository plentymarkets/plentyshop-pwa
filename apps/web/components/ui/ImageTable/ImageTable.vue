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
      :filter-keys="['key']"
      class="border border-gray-300 rounded-md"
      :items="items"
      :headers="headers"
      no-data-text="No images found"
    >
      <template #item.key="{ item }">
        <div class="flex items-center gap-2 cursor-pointer" @click="handleRowClick(item)">
          <NuxtImg
            :src="item.previewUrl || item.publicUrl"
            alt="table thumbnail"
            class="w-8 h-8 rounded object-cover"
          />
          <span>{{ item.key }}</span>
        </div>
      </template>
      <template #item.size="{ item }">
        <span>{{ bytesToMB(item.size) }}</span>
      </template>
    </v-data-table>
  </VCard>
</template>

<script setup lang="ts">
import { VCard, VTextField, VDataTable } from 'vuetify/components';

interface StorageObject {
  key: string;
  lastModified: string;
  eTag: string;
  size: string;
  storageClass: string;
  publicUrl: string;
  previewUrl?: string;
}

const { data: items, getStorageItemsServer, bytesToMB } = useItemsTable();
await getStorageItemsServer();

const headers = [
  { title: 'File name', key: 'key' },
  { title: 'Image size', key: 'size' },
  { title: 'Last change', key: 'lastModified' },
];
const emit = defineEmits<{
  (e: 'select', item: { name: string; image: string }): void;
}>();

const handleRowClick = (item: StorageObject) => {
  emit('select', {
    name: item.key,
    image: item.publicUrl,
  });
};

const search = ref('');
</script>

<style>
.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td,
.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > th {
  border-bottom: none !important;
}
.v-data-table-footer__items-per-page {
  display: none !important;
}

.v-data-table-footer__info {
  display: none !important;
}
</style>
