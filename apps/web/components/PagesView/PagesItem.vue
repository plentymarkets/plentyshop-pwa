<template>
  <li class="border-b">
    <div
      class="relative"
      :class="['px-4 py-2  group flex items-center justify-between cursor-pointer', isActive ? 'bg-gray-200' : '']"
      @click="toggle"
    >
      <span v-if="item.hasChildren">
        <SfIconExpandMore />
      </span>
      <router-link
        v-if="!isTablet"
        :to="`${localePrefix}/${item.details[0].nameUrl}`"
        class="flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis"
      >
        <span v-if="item.details[0].name === 'Homepage'">
          <SfIconHome class="w-4 h-4 mr-2" />
        </span>
        {{ item.details[0].name }}
      </router-link>

      <span
        v-else
        class="flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis cursor-pointer"
        @click="
          openSettingsMenu(item.id);
          setCategoryId(item.id, parentId, item.details[0].name, item.details[0].nameUrl);
        "
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
        @click="
          openSettingsMenu(item.id);
          setCategoryId(item.id, parentId, item.details[0].name, item.details[0].nameUrl);
        "
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
import { SfIconHome, SfIconExpandMore, SfIconError, SfTooltip, SfLoaderCircular, SfIconBase } from '@storefront-ui/vue';
import type { CategoryEntry } from '@plentymarkets/shop-api';
import { gearPath } from 'assets/icons/paths/gear';
const { isCategoryDirty } = useCategorySettingsCollection();
const { usePaginatedChildren } = useCategoriesSearch();
const viewport = useViewport();
const isTablet = computed(() => viewport.isLessThan('lg') && viewport.isGreaterThan('sm'));

const { locale } = useI18n();
const localePrefix = computed(() => (locale.value.startsWith('/') ? locale.value : `/${locale.value}`));

const { item } = defineProps<{
  item: CategoryEntry;
  parentId: number | undefined;
}>();

const { setSettingsCategory } = useSiteConfiguration();
const currentGeneralPageId = ref<number | null>(null);
const { setCategoryId } = useCategoryIdHelper();
const open = ref(false);
const childrenPagination = usePaginatedChildren(item.id);

const toggle = async () => {
  open.value = !open.value;
  if (open.value && item.hasChildren && childrenPagination.items.value.length === 0) {
    await childrenPagination.fetchMore();
  }
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
const openSettingsMenu = (id: number) => {
  currentGeneralPageId.value = id;
  setSettingsCategory({} as CategoryTreeItem, 'general-menu');
};
</script>
