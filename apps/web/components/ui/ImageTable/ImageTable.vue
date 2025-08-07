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

    <div v-if="loading" class="flex justify-center items-center min-h-[300px]">
      <SfLoaderCircular size="2xl" class="text-gray-400" />
    </div>

    <v-data-table
      v-else
      v-model:search="search"
      :filter-keys="['key']"
      class="border border-gray-300 rounded-md"
      :items="tableRows"
      :headers="headers"
      no-data-text="No images found"
    >
      <template #item="{ item }">
        <tr v-if="item.type === 'folder'" class="cursor-pointer bg-gray-100" @dblclick="toggleFolder(item.name)">
          <td colspan="3">
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-7l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span class="font-semibold">{{ item.name }}</span>
            </span>
          </td>
        </tr>
        <tr v-else :class="item.item.key === selectedKey ? 'bg-[#EFF4F1]' : ''">
          <td>
            <div class="flex flex-col gap-1 cursor-pointer" @click="onRowClick(item.item)">
              <div class="flex items-center gap-2">
                <NuxtImg
                  :src="item.item.previewUrl || item.item.publicUrl"
                  alt="table thumbnail"
                  class="w-8 h-8 rounded object-cover"
                />
                <span>
                  {{
                    item.item.key.includes('/')
                      ? item.item.key.substring(item.item.key.lastIndexOf('/') + 1)
                      : item.item.key
                  }}
                </span>
              </div>
            </div>
          </td>
          <td>{{ bytesToMB(item.item.size) }}</td>
          <td>{{ formatDate(item.item.lastModified) }}</td>
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

const openFolders = ref<string[]>([]);

const tableRows = computed(() => {
  const foldersMap: Record<string, StorageObject[]> = {};
  const rootImages: StorageObject[] = [];

  items.value.forEach((item) => {
    const key = item.key;
    const lastSlash = key.lastIndexOf('/');
    if (lastSlash > 0) {
      const folder = key.substring(0, lastSlash);
      if (!foldersMap[folder]) foldersMap[folder] = [];
      foldersMap[folder].push(item);
    } else {
      rootImages.push(item);
    }
  });

  const rows: Array<{ type: 'folder'; name: string } | { type: 'image'; item: StorageObject }> = [];

  Object.keys(foldersMap).forEach((folder) => {
    rows.push({ type: 'folder', name: folder });
    if (openFolders.value.includes(folder)) {
      foldersMap[folder].forEach((item) => rows.push({ type: 'image', item }));
    }
  });

  rootImages.forEach((item) => rows.push({ type: 'image', item }));

  return rows;
});

const toggleFolder = (folder: string) => {
  if (openFolders.value.includes(folder)) {
    openFolders.value = openFolders.value.filter((f) => f !== folder);
  } else {
    openFolders.value.push(folder);
  }
};

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
