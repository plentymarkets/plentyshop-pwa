<template>
  <div
    class="page-search z-1000 absolute p-2 top-full mt-2 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden w-[400px] flex flex-col"
    data-testid="page-search"
  >
    <div>
      <Multiselect
        ref="multiselectRef"
        v-model="inputModel"
        data-testid="page-select"
        :options="options"
        placeholder="Search"
        label="name"
        track-by="name"
        :close-on-select="true"
        :allow-empty="false"
        select-label=""
        deselect-label="Selected"
        :open="isOpen"
        :style="multiselectStyle"
        @select="selectValue"
      >
        <template #option="{ option }">
          <div class="flex items-center px-2 max-h-[300px] w-auto">
            <span class="flex items-center">
              <SfIconHome v-if="option.name === t('homepage.title')" class="w-4 h-4 mr-2 font-bold text-gray-900" />
              {{ option.name }}
            </span>
            <span v-if="option.path.split('/').length > 2" class="text-xs ml-2">
              {{ trimPath(option.path) }}
            </span>
          </div>
        </template>
      </Multiselect>
    </div>
    <div class="px-1 mt-5">
      <SfButton class="w-full" @click="openPages">
        <SfIconMenu />
        Manage pages
      </SfButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

import { SfIconHome, SfIconMenu, SfButton } from '@storefront-ui/vue';

const { openDrawerWithView } = useSiteConfiguration();
const emit = defineEmits(['pageSelected', 'close']);
const inputModel = ref('');

const { pages } = await usePages();

const { t, locale } = useI18n();
const isOpen = ref(true);
const multiselectRef = ref<InstanceType<typeof Multiselect> | null>(null);

const flattenPages = (
  pages: { name: string; path: string; children?: unknown[] }[],
): { name: string; path: string }[] => {
  return pages.reduce<{ name: string; path: string }[]>((acc, page) => {
    acc.push({ name: page.name, path: page.path });
    if (page.children) {
      acc.push(...flattenPages(page.children as { name: string; path: string; children?: unknown[] }[]));
    }
    return acc;
  }, []);
};

const options = ref(flattenPages(pages.value));

const trimPath = (path: string): string => {
  const parts = path.split('/').filter(Boolean);

  if (parts.length >= 2) {
    return `/${parts.slice(0, -1).join('/')}/`;
  }

  return `/${parts[0] || ''}`;
};

const open = () => {
  if (multiselectRef.value) {
    multiselectRef.value.activate();
  }
};

const selectValue = (page: { name: string; path: string }) => {
  emit('pageSelected', { name: page.name, icon: page.name === t('homepage.title') ? 'home' : 'sell' });
  navigateTo(`/${locale.value}${page.path}`);
};
onMounted(() => {
  open();
});

const openPages = () => {
  openDrawerWithView('PagesView');
  emit('close');
};

const maxHeight = 450;
const rowHeight = 40;
const baseHeight = 56;
const multiselectStyle = computed(() => {
  const dynamicHeight = Math.min(baseHeight + options.value.length * rowHeight, maxHeight);
  return {
    height: dynamicHeight + 'px',
    maxHeight: maxHeight + 'px',
    minHeight: baseHeight + 'px',
  };
});
</script>

<style scoped>
:deep(.multiselect__option--highlight) {
  background-color: #f7fafc !important;
  color: #1a202c;
}

:deep(.multiselect__content-wrapper) {
  max-height: 400px !important;
}
</style>
