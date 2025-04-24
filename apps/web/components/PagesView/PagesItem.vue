<template>
  <li class="border-b">
    <div
      class="relative"
      :class="['px-4 py-2 flex items-center justify-between cursor-pointer', isActive ? 'bg-gray-200' : '']"
      @click="toggle"
    >
      <span v-if="item.hasChildren">
        <SfIconExpandMore />
      </span>
      <router-link
        :to="`${localePrefix}${item.details[0].nameUrl}`"
        class="flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis"
      >
        <span v-if="item.details[0].name === 'Homepage'">
          <SfIconHome class="w-4 h-4 mr-2" />
        </span>
        {{ item.details[0].name }}
      </router-link>

      <SfTooltip
        v-if="isCategoryDirty(item.id)"
        label="You have unsaved changes on this page"
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconError :size="'sm'" />
      </SfTooltip>

      <SfIconMoreHoriz @click.prevent="openMenu" />

      <SfDropdown v-model="isOpen" placement="right" class="absolute top-0 right-0 bottom-0">
        <div class="p-2 rounded bg-white w-max shadow-[0px_2px_4px_-1px_#0000000F]">
          <div
            class="p-1 flex"
            @click="
              openGeneralSettings(item.id);
              setCategoryId(item.id, parentId);
            "
          >
            <NuxtImg width="24" height="24px" :src="gearBlack" />
            <span class="ml-2">General Settings</span>
          </div>
          <div
            class="p-1 flex"
            @click="
              openSeoSettings(item.id);
              setCategoryId(item.id, parentId);
            "
          >
            <SfIconSearch />
            <span class="ml-2">SEO Settings</span>
          </div>
          <div
            class="p-1 flex"
            :class="{ 'opacity-50 cursor-not-allowed': item.details[0].name === 'Homepage' }"
            @click="
              item.details[0].name !== 'Homepage'
                ? (deletePage(item.id), setCategoryId(item.id, parentId, item.details[0].name))
                : null
            "
          >
            <SfIconDelete />
            <span class="ml-2">Delete Page</span>
          </div>
        </div>
      </SfDropdown>
    </div>
    <ul
      v-if="item.hasChildren && open"
      class="pl-4 border-l border-gray-200 max-h-[300px] overflow-auto"
      @scroll="handleChildrenScroll"
    >
      <li v-if="loadingChildren" class="px-4 py-2 text-sm text-gray-500">Loading...</li>
      <PagesItem v-for="child in children" :key="child.details[0].nameUrl" :item="child" :parent-id="item.id" />
      <li v-if="loadingChildren && children.length > 0" class="px-4 py-2 text-sm text-gray-500">Loading more...</li>
    </ul>
  </li>
</template>
<script setup lang="ts">
import {
  SfIconHome,
  SfIconExpandMore,
  SfIconMoreHoriz,
  useDisclosure,
  SfDropdown,
  SfIconDelete,
  SfIconSearch,
  SfIconError,
  SfTooltip,
} from '@storefront-ui/vue';
import gearBlack from 'assets/icons/paths/gear-black.svg';
import type { CategoryEntry, CategoryTreeItem } from '@plentymarkets/shop-api';
const { isCategoryDirty } = useCategorySettingsCollection();
const { data, getCategories } = useCategoriesSearch();

const { locale } = useI18n();
const localePrefix = computed(() => (locale.value.startsWith('/') ? locale.value : `/${locale.value}`));

const { item } = defineProps<{
  item: CategoryEntry;
  parentId: number | undefined;
}>();

const { isOpen, open: openMenu, close } = useDisclosure();
const { setSettingsCategory } = useSiteConfiguration();
const { toggleDeleteModal } = useCategorySettings();
const currentSeoPageId = ref<number | null>(null);
const currentGeneralPageId = ref<number | null>(null);
const { setCategoryId } = useCategoryIdHelper();
const { id: categoryId } = useCategorySettings();
const children = ref<CategoryEntry[]>([]);
const loadingChildren = ref(false);
const hasMoreChildren = ref(true);
const childrenPage = ref(1);
const open = ref(false);

const fetchChildren = async () => {
  if (loadingChildren.value || !hasMoreChildren.value) return;

  loadingChildren.value = true;
  try {
    await getCategories({
      parentCategoryId: item.id,
      itemsPerPage: 30,
      page: childrenPage.value,
      with: 'details,clients',
    });

    const entries = data.value.entries ?? [];
    children.value.push(...entries);
    hasMoreChildren.value = !data.value.isLastPage;
    childrenPage.value++;
  } catch (err) {
    console.error('Error fetching child categories', err);
  } finally {
    loadingChildren.value = false;
  }
};

const toggle = async () => {
  open.value = !open.value;

  if (open.value && item.hasChildren && children.value.length === 0) {
    await fetchChildren();
  }
};

const handleChildrenScroll = async (e: Event) => {
  if (loadingChildren.value || !hasMoreChildren.value) return;

  const el = e.target as HTMLElement;
  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;

  if (nearBottom) {
    await fetchChildren();
  }
};
const route = useRoute();
const isActive = computed(() => route.path === item?.details[0].nameUrl);

const openGeneralSettings = (id: number) => {
  close();
  currentGeneralPageId.value = id;
  setSettingsCategory({} as CategoryTreeItem, 'general-settings');
  categoryId.value = id;
};
const openSeoSettings = (id: number) => {
  close();
  currentSeoPageId.value = id;
  setSettingsCategory({} as CategoryTreeItem, 'seo-settings');
  categoryId.value = id;
};
const deletePage = (id: number) => {
  currentGeneralPageId.value = id;
  categoryId.value = id;
  toggleDeleteModal(true);
  close();
};
</script>
