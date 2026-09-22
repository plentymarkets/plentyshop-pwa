<template>
  <div>
    <div class="mb-4">
      <SfInput
        v-model="search"
        data-testid="image-table-search"
        aria-label="Search file or path..."
        placeholder="Search file or path..."
      >
        <template #prefix>
          <SfIconSearch />
        </template>
      </SfInput>
    </div>

    <div v-if="loading" class="flex justify-center items-center min-h-[300px]">
      <SfLoaderCircular size="2xl" class="text-neutral-400" />
    </div>
    <template v-else>
      <table class="w-full border border-neutral-300 rounded-md text-left">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header.key"
              scope="col"
              class="cursor-pointer select-none px-4 py-2 font-medium"
              @click="toggleSort(header.key)"
            >
              <span class="inline-flex items-center gap-1">
                {{ header.title }}
                <SfIconArrowUpward v-if="sortKey === header.key && sortDirection === 'asc'" size="sm" />
                <SfIconArrowDownward v-else-if="sortKey === header.key && sortDirection === 'desc'" size="sm" />
                <SfIconUnfoldMore v-else size="sm" class="text-neutral-400" />
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          <template v-for="item in pagedItems" :key="item.key">
            <UiImageTableSkeleton v-if="item.storageClass === UPLOADING_CLASS" />
            <tr v-else :class="item.key === props.selectedKey ? 'bg-[#EFF4F1]' : ''">
              <td class="px-4 py-2">
                <div class="flex flex-col gap-1 cursor-pointer" @click="onRowClick(item)">
                  <div class="flex items-center gap-2">
                    <NuxtImg
                      data-testid="image-table-thumbnail"
                      :src="item.previewUrl || item.publicUrl"
                      alt="table thumbnail"
                      class="w-8 h-8 rounded object-cover"
                    />
                    <span data-testid="image-table-file-name">{{ item.fileName }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-2" data-testid="image-table-path">{{ item.path }}</td>
              <td class="px-4 py-2" data-testid="image-table-size">{{ bytesToMB(item.size) }}</td>
              <td class="px-4 py-2" data-testid="image-table-last-modified">{{ formatDate(item.lastModified) }}</td>
            </tr>
          </template>
          <tr v-if="pagedItems.length === 0">
            <td colspan="4" class="text-center py-6 text-neutral-500">No images or folders found</td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-end items-center gap-2 mt-2">
        <UiButton
          size="sm"
          variant="tertiary"
          aria-label="Previous page"
          data-testid="image-table-pagination-previous"
          :disabled="page <= 1"
          @click="page--"
        >
          <template #prefix>
            <SfIconChevronLeft />
          </template>
        </UiButton>
        <UiButton
          size="sm"
          variant="tertiary"
          aria-label="Next page"
          data-testid="image-table-pagination-next"
          :disabled="page >= totalPages"
          @click="page++"
        >
          <template #suffix>
            <SfIconChevronRight />
          </template>
        </UiButton>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { StorageObject } from '@plentymarkets/shop-api';
import {
  SfLoaderCircular,
  SfIconSearch,
  SfInput,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconUnfoldMore,
  SfIconChevronLeft,
  SfIconChevronRight,
} from '@storefront-ui/vue';

const { data: items, loading, headers, bytesToMB, formatDate, getStorageMetadata } = useItemsTable();

const { setMetadata } = useImageMetadata();
const lastFetchedKey = ref<string | null>(null);

const props = defineProps<{
  selectedKey: string | null;
}>();
watch(
  () => props.selectedKey,
  (key) => {
    if (!key || key === lastFetchedKey.value) return;

    const row = items.value.find((item) => item.key === key);
    if (!row || row.storageClass === UPLOADING_CLASS) return;

    lastFetchedKey.value = key;

    emit('select', { name: row.key, image: row.publicUrl });
    fetchMetadata(key);
  },
  { immediate: false },
);

const search = ref('');

const itemsWithPath = computed(() =>
  items.value
    .filter((item: StorageObject) => !item.key.endsWith('/'))
    .map((item: StorageObject) => {
      const lastSlash = item.key.lastIndexOf('/');
      return {
        ...item,
        fileName: lastSlash >= 0 ? item.key.slice(lastSlash + 1) : item.key,
        path: lastSlash >= 0 ? item.key.slice(0, lastSlash + 1) : '',
      };
    }),
);

const filteredItems = computed(() => {
  if (!search.value) return itemsWithPath.value;
  const s = search.value.toLowerCase();
  return itemsWithPath.value.filter(
    (item) => item.fileName.toLowerCase().includes(s) || item.path.toLowerCase().includes(s),
  );
});

const sortKey = ref('fileName');
const sortDirection = ref<'asc' | 'desc'>('asc');

const toggleSort = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    return;
  }
  sortKey.value = key;
  sortDirection.value = 'asc';
};

const sortedItems = computed(() => {
  const direction = sortDirection.value === 'asc' ? 1 : -1;
  return [...filteredItems.value].sort((a, b) => {
    if (sortKey.value === 'size') {
      return (Number(a.size) - Number(b.size)) * direction;
    }
    if (sortKey.value === 'lastModified') {
      return (new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()) * direction;
    }
    if (sortKey.value === 'path') {
      return a.path.localeCompare(b.path) * direction;
    }
    return a.fileName.localeCompare(b.fileName) * direction;
  });
});

const PAGE_SIZE = 10;
const page = ref(1);
const totalPages = computed(() => Math.max(1, Math.ceil(sortedItems.value.length / PAGE_SIZE)));
const pagedItems = computed(() => sortedItems.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE));

watch([search, sortKey, sortDirection], () => {
  page.value = 1;
});

const onRowClick = (item: StorageObject) => {
  emit('update:selectedKey', item.key);
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
  (e: 'update:selectedKey', value: string | null): void;
  (e: 'select', item: { name: string; image: string }): void;
  (e: 'unselect'): void;
}>();

const handleRowClick = (item: StorageObject) => {
  emit('select', {
    name: item.key,
    image: item.publicUrl,
  });
};
</script>
