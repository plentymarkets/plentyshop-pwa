<template>
  <li class="border-b">
    <div
      class="relative"
      :class="['px-4 py-2 flex items-center justify-between cursor-pointer', isActive ? 'bg-gray-200' : '']"
      @click="toggle"
    >
      <span v-if="item.children && item.children.length > 0">
        <SfIconExpandMore />
      </span>
      <router-link
        :to="`${localePrefix}${item.path}`"
        class="flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis"
      >
        <span v-if="item.name === 'Homepage'">
          <SfIconHome class="w-4 h-4 mr-2" />
        </span>
        {{ item.name }}
      </router-link>

      <SfIconMoreHoriz @click.prevent="openMenu" />

      <SfDropdown v-model="isOpen" placement="right" class="absolute top-0 right-0 bottom-0">
        <div class="p-2 rounded bg-white w-max">
          <div
            class="p-1 flex"
            @click="
              openGeneralSettings(item.id);
              setPageId(item.id, parentId);
            "
          >
            <NuxtImg width="24" height="24px" :src="gearBlack" />
            <span class="ml-2">General Settings</span>
          </div>
          <div
            class="p-1 flex"
            @click="
              openSeoSettings(item.id);
              setPageId(item.id, parentId);
            "
          >
            <SfIconSearch />
            <span class="ml-2">SEO Settings</span>
          </div>
          <div
            class="p-1 flex"
            :class="{ 'opacity-50 cursor-not-allowed': item.name === 'Homepage' }"
            @click="item.name !== 'Homepage' ? (deletePage(item.id), setPageId(item.id, parentId)) : null"
          >
            <SfIconDelete />
            <span class="ml-2">Delete Page</span>
          </div>
        </div>
      </SfDropdown>
    </div>
    <ul v-if="item.children && open" class="pl-4 border-l border-gray-200">
      <PagesItem v-for="child in item.children" :key="child.path" :item="child" :parent-id="item.id" />
    </ul>
  </li>
</template>
<script setup lang="ts">
import type { MenuItemType } from '~/components/PagesView/types';
import {
  SfIconHome,
  SfIconExpandMore,
  SfIconMoreHoriz,
  useDisclosure,
  SfDropdown,
  SfIconDelete,
  SfIconSearch,
} from '@storefront-ui/vue';
import gearBlack from 'assets/icons/paths/gear-black.svg';
import type { CategoryTreeItem } from '@plentymarkets/shop-api';

const { locale } = useI18n();
const localePrefix = computed(() => (locale.value.startsWith('/') ? locale.value : `/${locale.value}`));

const { item } = defineProps<{
  item: MenuItemType;
  parentId: number | undefined;
}>();

const { isOpen, open: openMenu, close } = useDisclosure();
const { setSettingsCategory, toggleDeleteModal } = useSiteConfiguration();
const currentSeoPageId = ref<number | null>(null);
const currentGeneralPageId = ref<number | null>(null);
const { setPageId } = useCategorySettings();
const open = ref(false);
const toggle = () => (open.value = !open.value);
const route = useRoute();
const isActive = computed(() => route.path === item.path);

const openGeneralSettings = (id: number) => {
  close();
  currentGeneralPageId.value = id;
  setSettingsCategory({} as CategoryTreeItem, 'general-settings');
};
const openSeoSettings = (id: number) => {
  close();
  currentSeoPageId.value = id;
  setSettingsCategory({} as CategoryTreeItem, 'seo-settings');
};
const deletePage = (id: number) => {
  currentGeneralPageId.value = id;
  toggleDeleteModal(true)
  close();
};
</script>
