<template>
  <VCard flat>
    <v-text-field
      v-model="search"
      density="compact"
      label="Search"
      prepend-inner-icon="fa-solid fa-magnifying-glass"
      variant="solo-filled"
      class="mb-5 border border-gray-300 rounded"
      flat
      hide-details
      single-line
    />

    <div v-if="loading" class="flex justify-center items-center min-h-[300px]">
      <SfLoaderCircular size="2xl" class="text-gray-400" />
    </div>
    <v-data-table
      v-else
      v-model:search="search"
      :filter-keys="['key']"
      class="border border-gray-300 rounded-md"
      :items="items"
      :headers="headers"
      no-data-text="No images found"
    >
      <template #item="{ item }">
        <tr :class="item.key === selectedKey ? 'bg-[#EFF4F1]' : ''">
          <td>
            <div class="flex flex-col gap-1 cursor-pointer" @click="onRowClick(item)">
              <div class="flex items-center gap-2">
                <NuxtImg
                  :src="item.previewUrl || item.publicUrl"
                  alt="table thumbnail"
                  class="w-8 h-8 rounded object-cover"
                />
                <span>{{ item.key }}</span>
              </div>
            </div>
          </td>
          <td>{{ bytesToMB(item.size) }}</td>
          <td>{{ formatDate(item.lastModified) }}</td>
        </tr>
      </template>
    </v-data-table>
  </VCard>
</template>

<script setup lang="ts">
import { VCard, VTextField, VDataTable } from 'vuetify/components';
import type { StorageObject } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';

const { data: items, loading, headers, bytesToMB, formatDate, getStorageMetadata } = useItemsTable();

const { setMetadata } = useImageMetadata();

const selectedKey = ref<string | null>(null);

const onRowClick = (item: StorageObject) => {
  selectedKey.value = item.key;
  handleRowClick(item);
  fetchMetadata(item.key);
};

const fetchMetadata = async (key: string) => {
  const data = await getStorageMetadata(key);
  if (data && data.width && data.height) {
    setMetadata(key, { width: data.width, height: data.height });
  }
};

const emit = defineEmits<{
  (e: 'select', item: { name: string; image: string }): void;
  (e: 'unselect'): void;
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

.v-icon {
  --v-icon-size-multiplier: 0.55;
}

.v-btn--icon .v-icon {
  --v-icon-size-multiplier: 0.55;
}

.v-ripple__container {
  display: none !important;
}

div.v-data-table-footer > div.v-data-table-footer__pagination > nav > ul > li.v-pagination__next > button:active {
  background-color: gray;
}

div.v-data-table-footer > div.v-data-table-footer__pagination > nav > ul > li.v-pagination__prev > button:active {
  background-color: gray;
}
</style>
