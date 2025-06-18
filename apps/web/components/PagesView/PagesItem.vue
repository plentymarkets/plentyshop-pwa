<template>
  <li
    class="border border-[#D9E2DC] rounded-[5px] mb-3"
    :class="[{ disabled: isDisabled }, hasEmptyDetails ? 'bg-disabled-200 opacity-70' : '']"
  >
    <div
      class="relative px-4 py-2 group flex items-center justify-between cursor-pointer"
      :class="[isActive ? 'bg-sky-100 border border-sky-400' : 'hover:bg-sky-50 border border-transparent']"
      @click="toggleOnTablet"
    >
      <span v-if="item.hasChildren" @click="toggleOnDesktop">
        <SfIconExpandMore v-if="!open" />
        <SfIconExpandLess v-else />
      </span>
      <router-link
        v-if="!isTablet && !hasEmptyDetails"
        :to="pagePath"
        class="flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis"
      >
        <span v-if="props.icon">
          <component :is="icon" class="w-4 h-4 mr-2" />
        </span>
        {{ itemDisplayName }}
      </router-link>

      <span
        v-else
        class="flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis cursor-pointer"
        @click="handleSettingsClick"
      >
        <span v-if="props.icon">
          <component :is="icon" class="w-4 h-4 mr-2" />
        </span>
        {{ itemDisplayName }}
      </span>
      <div class="flex items-center gap-x-2 ml-2">
        <NuxtImg v-if="isDisabled" width="24" height="24px" :src="disabled" @click="handleSettingsClick" />

        <SfTooltip
          v-if="isCategoryDirty(item.id)"
          label="You have unsaved changes on this page"
          :placement="'top'"
          :show-arrow="true"
          class="ml-2 z-10"
        >
          <SfIconError viewBox="0 0 24 24" class="w-5 h-5" />
        </SfTooltip>
        <SfIconBase
          v-if="!props.hideSettings"
          size="base"
          viewBox="0 0 24 24"
          class="text-primary-900 transition-opacity duration-200"
          :class="[isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100']"
          @click="handleSettingsClick"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path :d="gearPath" fill="#062633" />
          </svg>
        </SfIconBase>
      </div>
    </div>
  </li>
  <ul
    v-if="item.hasChildren && open"
    class="pl-3 relative border-[#D9E2DC]-200 max-h-[500px] overflow-auto"
    @scroll="handleChildrenScroll"
  >
    <hr class="absolute top-0 left-0 w-[1px] h-[calc(100%-0.75rem)] bg-gray-200" />
    <li
      v-if="childrenPagination.loading.value && childrenPagination.items.value.length"
      class="flex justify-center items-center py-4"
    >
      <SfLoaderCircular size="sm" />
    </li>
    <PagesItem v-for="child in childrenPagination.items.value" :key="child.id" :item="child" :parent-id="item.id" />
    <li
      v-if="childrenPagination.loading.value && childrenPagination.items.value.length > 0"
      class="flex justify-center items-center py-4"
    >
      <SfLoaderCircular size="sm" />
    </li>
  </ul>
</template>
<script setup lang="ts">
import {
  SfIconExpandMore,
  SfIconExpandLess,
  SfIconError,
  SfTooltip,
  SfLoaderCircular,
  SfIconBase,
} from '@storefront-ui/vue';
import type { PagesItemProps } from './types';

import { gearPath } from 'assets/icons/paths/gear';
import disabled from 'assets/icons/paths/disabled.svg';

const { isCategoryDirty, data: collectionData } = useCategorySettingsCollection();
const { usePaginatedChildren } = useCategoriesSearch();
const { setSettingsCategory, settingsType } = useSiteConfiguration();
const { getCategoryId, setCategoryId, setParentName, setPageType, setPageHasChildren } = useCategoryIdHelper();
const viewport = useViewport();
const isTablet = computed(() => viewport.isLessThan('lg') && viewport.isGreaterThan('sm'));

const props = defineProps<PagesItemProps>();
const item = props.item;

const isDisabled = computed(() => {
  let category = null;
  if (Array.isArray(collectionData.value)) {
    category = collectionData.value.find((cat) => cat.id === item.id);
  } else if (
    collectionData.value &&
    typeof collectionData.value === 'object' &&
    'id' in collectionData.value &&
    (collectionData.value as { id: number }).id === item.id
  ) {
    category = collectionData.value as { id: number; isLinkedToWebstore?: boolean };
  }
  if (!category) {
    return item.isLinkedToWebstore === false;
  }
  return category.isLinkedToWebstore === false;
});

const itemDisplayName = computed(() => item.details[0]?.name ?? `ID: ${item.id}`);
const hasEmptyDetails = computed(() => !item.details || item.details.length === 0);
const pagePath = computed(() => {
  if (item.details[0]?.pageView === 'Homepage') {
    return item.details[0]?.nameUrl || '/';
  }

  const firstSlashIndex = item.details[0]?.previewUrl?.indexOf('/', 8) ?? -1;
  return firstSlashIndex !== -1 ? item.details[0]?.previewUrl?.slice(firstSlashIndex) ?? '/' : '/';
});

const currentGeneralPageId = ref<number | null>(null);
const open = ref(false);
const childrenPagination = usePaginatedChildren(item);

const toggleOpen = async (isTabletCheck = false) => {
  if (item.level === 5) {
    setParentName(itemDisplayName.value);
  }
  if (isTabletCheck && !isTablet.value) return;

  open.value = !open.value;
  if (item.level === 5) {
    setParentName(itemDisplayName.value);
  }
  if (open.value && item.hasChildren && childrenPagination.items.value.length === 0) {
    await childrenPagination.fetchMore();
  }
};
const handleSettingsClick = () => {
  openSettingsMenu(item.id, item.type);
  setCategoryId({
    id: item.id,
    parentId: props.parentId,
    name: itemDisplayName.value,
    path: item.details[0]?.nameUrl || pagePath.value,
    level: item.level,
    previewUrl: item.details[0].previewUrl,
    details: item.details,
  });
  checkIfItemHasChildren();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const toggleOnDesktop = () => toggleOpen();
const toggleOnTablet = () => toggleOpen(true);

const handleChildrenScroll = async (e: Event) => {
  const el = e.target as HTMLElement;
  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
  if (nearBottom && childrenPagination.hasMore.value && !childrenPagination.loading.value) {
    await childrenPagination.fetchMore();
  }
};

const isActive = computed(() => item.id === getCategoryId.value && settingsType.value);
const openSettingsMenu = (id: number, pageType?: string) => {
  currentGeneralPageId.value = id;
  setSettingsCategory({} as CategoryTreeItem, 'general-menu');
  setPageType(pageType);
};

const checkIfItemHasChildren = () => {
  if (item.hasChildren) {
    setPageHasChildren(true);
  } else {
    setPageHasChildren(false);
  }
};

watch(
  () => item.children,
  (newChildren) => {
    childrenPagination.items.value = (newChildren ?? []).filter(Boolean);
  },
  { immediate: true, deep: true },
);
</script>
