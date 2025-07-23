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
        <div class="flex flex-col gap-1 cursor-pointer">
          <div
            class="flex items-center gap-2"
            @click="
              handleRowClick(item);
              fetchMetadata(item.key);
            "
          >
            <NuxtImg
              :src="item.previewUrl || item.publicUrl"
              alt="table thumbnail"
              class="w-8 h-8 rounded object-cover"
            />
            <span>{{ item.key }}</span>
          </div>
          <div v-if="metadata[item.key]">
            <p class="text-xs text-gray-500">Width: {{ metadata[item.key].width }}</p>
            <p class="text-xs text-gray-500">Height: {{ metadata[item.key].height }}</p>
          </div>
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

const { data: items, getStorageItemsServer, bytesToMB, getStorageMetadata } = useItemsTable();
await getStorageItemsServer();

const { metadata, setMetadata } = useImageMetadata();

const fetchMetadata = async (key: string) => {
  const data = await getStorageMetadata(key);
  if (data && data.width && data.height) {
    //     metadata.value[key] = { width: data.width, height: data.height };
    // width.value = data.width;
    // height.value = data.height;
    setMetadata(key, { width: data.width, height: data.height });
  }
};

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
