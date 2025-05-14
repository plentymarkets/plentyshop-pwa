<template>
  <li class="border-b">
    <div
      class="relative"
      :class="['px-4 py-2 group flex items-center justify-between cursor-pointer', isActive ? 'bg-gray-200' : '']"
      @click="toggle"
    >
      <span v-if="item.hasChildren">
        <SfIconExpandMore v-if="!open" />
        <SfIconExpandLess v-else />
      </span>
      <router-link v-if="!isTablet" :to="pagePath" class="flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis">
        <span v-if="item.details[0].name === 'Homepage'">
          <SfIconHome class="w-4 h-4 mr-2" />
        </span>
        {{ item.details[0].name }}
      </router-link>

      <span
        v-else
        class="flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis cursor-pointer"
        @click="handleSettingsClick"
      >
        <span v-if="item.details[0].name === 'Homepage'">
          <SfIconHome class="w-4 h-4 mr-2" />
        </span>
        {{ item.details[0].name }}
      </span>
      <div class="flex items-center gap-x-2 ml-2">
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
          size="base"
          viewBox="0 0 24 24"
          class="text-primary-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          @click="handleSettingsClick"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path :d="gearPath" fill="#062633" />
          </svg>
        </SfIconBase>
      </div>
    </div>
    <ul
      v-if="item.hasChildren && open"
      class="pl-4 border-l border-gray-200 max-h-[300px] overflow-auto"
      @scroll="handleChildrenScroll"
    >
      <li
        v-if="childrenPagination.loading.value && childrenPagination.items.value.length"
        class="flex justify-center items-center py-4"
      >
        <SfLoaderCircular size="sm" />
      </li>
      <PagesItem
        v-for="child in childrenPagination.items.value"
        :key="child.details[0].nameUrl"
        :item="child"
        :parent-id="item.id"
      />
      <li
        v-if="childrenPagination.loading.value && childrenPagination.items.value.length > 0"
        class="flex justify-center items-center py-4"
      >
        <SfLoaderCircular size="sm" />
      </li>
    </ul>
  </li>
</template>
<script setup lang="ts">
import {
  SfIconHome,
  SfIconExpandMore,
  SfIconExpandLess,
  SfIconError,
  SfTooltip,
  SfLoaderCircular,
  SfIconBase,
} from '@storefront-ui/vue';
import type { CategoryEntry } from '@plentymarkets/shop-api';
import { gearPath } from 'assets/icons/paths/gear';
const { isCategoryDirty } = useCategorySettingsCollection();
const { usePaginatedChildren } = useCategoriesSearch();
const { setParentName } = useCategoryIdHelper();
const viewport = useViewport();
const isTablet = computed(() => viewport.isLessThan('lg') && viewport.isGreaterThan('sm'));

const { item, parentId } = defineProps<{
  item: CategoryEntry;
  parentId: number | undefined;
}>();
const pagePath = computed(() => {
  const firstSlashIndex = item.details[0]?.previewUrl?.indexOf('/', 8) ?? -1;
  return firstSlashIndex !== -1 ? item.details[0]?.previewUrl?.slice(firstSlashIndex) ?? '/' : '/';
});
const { setSettingsCategory } = useSiteConfiguration();
const currentGeneralPageId = ref<number | null>(null);
const { setCategoryId, setPageType, setPageHasChildren } = useCategoryIdHelper();
const open = ref(false);
const childrenPagination = usePaginatedChildren(item);

const toggle = async () => {
  open.value = !open.value;
  if (item.level === 5) {
    setParentName(item.details[0].name);
  }
  if (open.value && item.hasChildren && childrenPagination.items.value.length === 0) {
    await childrenPagination.fetchMore();
  }
};
const handleSettingsClick = () => {
  openSettingsMenu(item.id, item.type);
  setCategoryId({
    id: item.id,
    parentId: parentId,
    name: item.details[0].name,
    path: item.details[0].nameUrl,
    level: item.level,
  });
  checkIfItemHasChildren();
};

const handleChildrenScroll = async (e: Event) => {
  const el = e.target as HTMLElement;
  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
  if (nearBottom && childrenPagination.hasMore.value && !childrenPagination.loading.value) {
    await childrenPagination.fetchMore();
  }
};

const route = useRoute();
const isActive = computed(() => route.path === item?.details[0].nameUrl);
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
