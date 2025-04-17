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
          <ul class="bg-white shadow-md rounded-lg">
            <PagesItem
              v-for="item in contentItems"
              :key="item.path"
              :item="item"
              :parent-id="item.id"
            />
          </ul>
          <button
            class="mt-2 text-sm text-blue-600 hover:underline"
            @click="loadMoreContent"
          >
            Load more pages
          </button>
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
          <ul class="bg-white shadow-md rounded-lg">
            <PagesItem
              v-for="item in itemItems"
              :key="item.path"
              :item="item"
              :parent-id="item.id"
            />
          </ul>
          <button
            class="mt-2 text-sm text-blue-600 hover:underline"
            @click="loadMoreCategories"
          >
            Load more categories
          </button>
        </div>
      </UiAccordionItem>
    </div>

    <CategorySettingsDrawer v-if="settingsCategory" />
  </div>
</template>

<script setup lang="ts">
import PagesItem from '~/components/PagesView/PagesItem.vue';
import { SfIconClose, SfIconHelp, SfTooltip, SfIconAdd, SfLoaderCircular } from '@storefront-ui/vue';
import type { MenuItemType } from '~/components/PagesView/types';

const { locale } = useI18n();
const {
  pages,
  loadMoreContent,
  loadMoreCategories,
} = await usePages();

const contentPagesOpen = ref(false);
const productPagesOpen = ref(false);
const { closeDrawer, togglePageModal, settingsCategory } = useSiteConfiguration();
const { loading, hasChanges, save } = useCategorySettingsCollection();

const splitItemsByType = (items: MenuItemType[]) => {
  const result = {
    contentItems: [] as MenuItemType[],
    itemItems: [] as MenuItemType[],
  };

  items.forEach((item) => {
    switch (item.type) {
      case 'content':
        result.contentItems.push(item);
        break;
      case 'item':
        result.itemItems.push(item);
        break;
    }
  });

  return result;
};

const { contentItems, itemItems } = splitItemsByType(pages.value);

const openHelpPage = () => {
  const urls: Record<string, string> = {
    en: 'https://knowledge.plentymarkets.com/en-gb/manual/main/online-store/shop-editor.html',
    de: 'https://knowledge.plentymarkets.com/de-de/manual/main/webshop/shop-editor.html',
  };

  const targetUrl = urls[locale.value] ?? urls['en'] ?? null;

  if (targetUrl) window.open(targetUrl, '_blank');
};
</script>
