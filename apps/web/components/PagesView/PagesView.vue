<template>
  <div class="relative">
    <div class="pages-view sticky top-[52px] h-[calc(100vh-50px)] z-[2]" data-testid="pages-management-drawer">
      <header class="flex items-center justify-between px-4 py-5 border-b">
        <div class="flex items-center text-xl font-bold">
          Pages
          <SfTooltip label="Open manual" placement="right" :show-arrow="true" class="flex">
            <SfIconHelp class="ml-2 cursor-pointer" @click="openHelpPage" />
          </SfTooltip>
        </div>
        <button data-testid="pages-view-close" class="!p-0" @click="closeDrawer">
          <SfIconClose />
        </button>
      </header>

      <div class="mx-4 mb-4 mt-4">
        <button
          type="button"
          data-testid="add-page-btn"
          class="border border-editor-button w-full py-1 rounded-md flex align-center justify-center text-editor-button"
          @click="togglePageModal(true)"
        >
          <SfIconAdd /> Add Page
        </button>
      </div>

      <div class="mx-4 mb-4 mt-4">
        <button
          type="button"
          variant="primary"
          data-testid="add-page-btn"
          class="border border-editor-button bg-editor-button text-white w-full py-1 rounded-md flex align-center justify-center text-editor-button"
          :class="{ 'opacity-40 cursor-not-allowed': !hasChanges || loading }"
          :disabled="!hasChanges || loading"
          @click="save"
        >
          <template v-if="loading">
            <SfLoaderCircular class="animate-spin w-4 h-4 text-white mr-[5px]" />
          </template>
          <template v-else> Save Settings </template>
        </button>
      </div>

      <UiAccordionItem
        v-model="contentPagesOpen"
        data-testid="content-pages-section"
        summary-active-class="bg-neutral-100 border-t-0"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between select-none border-b"
      >
        <template #summary>
          <h2>Content Pages</h2>
        </template>

        <div class="mb-6 mt-4">
          <ul class="bg-white shadow-md rounded-lg max-h-[500px] overflow-auto" @scroll="(e) => handleScroll(e, 'content')">
            <PagesItem v-for="item in contentItems" :key="item.details[0].nameUrl" :item="item" :parent-id="item.id" />
            <li v-if="loadingContent" class="px-4 py-2 text-sm text-gray-500">Loading...</li>
          </ul>
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="productPagesOpen"
        data-testid="product-pages-section"
        summary-active-class="bg-neutral-100 border-t-0"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between select-none border-b"
      >
        <template #summary>
          <h2>Product Categories</h2>
        </template>

        <div class="mb-6 mt-4">
          <ul class="bg-white shadow-md rounded-lg max-h-[500px] overflow-auto" @scroll="(e) => handleScroll(e, 'item')">
            <PagesItem v-for="item in itemItems" :key="item.details[0].nameUrl" :item="item" :parent-id="item.id" />
            <li v-if="loadingItem" class="px-4 py-2 text-sm text-gray-500">Loading...</li>
          </ul>
        </div>
      </UiAccordionItem>
    </div>

    <CategorySettingsDrawer v-if="settingsCategory" />
  </div>
</template>

<script setup lang="ts">
import PagesItem from '~/components/PagesView/PagesItem.vue';
import {
  SfIconClose,
  SfIconHelp,
  SfTooltip,
  SfIconAdd,
  SfLoaderCircular
} from '@storefront-ui/vue';
import { useSiteConfiguration } from '~/composables/useSiteConfiguration';
const { locale } = useI18n();

const { data, getCategories } = useCategoriesSearch();
await getCategories({
  'level': 1,
  'type': 'in:item,content',
  'sortBy':'position_asc',
  'page': 1,
  'itemsPerPage': 150,
  'with': 'details,clients'
})
const contentPagesOpen = ref(false);
const productPagesOpen = ref(false);
const { closeDrawer, togglePageModal, settingsCategory } = useSiteConfiguration();
const { loading, hasChanges, save } = useCategorySettingsCollection();

const {
  contentItems,
  itemItems,
  loadingContent,
  loadingItem,
  hasMoreContent,
  hasMoreItem,
  fetchContentCategories,
  fetchItemCategories
} = useCategoriesSearch();

const contentPagesOpen = ref(false);
const productPagesOpen = ref(false);

const handleScroll = async (e: Event, type: 'content' | 'item') => {
  const el = e.target as HTMLElement;
  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;

  if (nearBottom) {
    if (type === 'content' && hasMoreContent.value) {
      await fetchContentCategories();
    } else if (type === 'item' && hasMoreItem.value) {
      await fetchItemCategories();
    }
  }
};

watch(contentPagesOpen, (opened) => {
  if (opened && contentItems.value.length === 0) {
    fetchContentCategories();
  }
});

watch(productPagesOpen, (opened) => {
  if (opened && itemItems.value.length === 0) {
    fetchItemCategories();
  }
});

const openHelpPage = () => {
  const urls: Record<string, string> = {
    en: 'https://knowledge.plentymarkets.com/en-gb/manual/main/online-store/shop-editor.html',
    de: 'https://knowledge.plentymarkets.com/de-de/manual/main/webshop/shop-editor.html',
  };

  const targetUrl = urls[locale.value] ?? urls['en'] ?? null;
  if (targetUrl) window.open(targetUrl, '_blank');
};
</script>
