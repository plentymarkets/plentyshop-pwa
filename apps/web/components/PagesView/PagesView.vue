<template>
  <div class="site-settings-view sticky top-[52px] h-[calc(100vh-50px)] overflow-y-auto" data-testid="site-settings-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">Pages
        <SfTooltip
          label="Open manual"
          placement="left"
          :show-arrow="true"
          class="flex"
        >   <SfIconHelp class="ml-2 cursor-pointer" @click="openHelpPage"/></SfTooltip>
      </div>
      <button data-testid="design-view-close" class="!p-0" @click="closeDrawer">
        <SfIconClose />
      </button>
    </header>
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
          <PagesItem v-for="item in contentItems" :key="item.path" :item="item" />
        </ul>
      </div>
    </UiAccordionItem>
    <UiAccordionItem
      v-model="ProductPagesOpen"
      data-testid="content-pages-section"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between select-none border-b"
    >
      <template #summary>
        <h2>Product Categories</h2>
      </template>

      <div class="mb-6 mt-4">
        <ul class="bg-white shadow-md rounded-lg">
          <PagesItem v-for="item in itemItems" :key="item.path"  :item="item" />
        </ul>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import PagesItem from '~/components/PagesView/PagesItem.vue';
import { SfIconClose, SfIconHelp, SfTooltip } from '@storefront-ui/vue';
import type { MenuItemType } from '~/components/PagesView/types';
const { $i18n } = useNuxtApp();
const currentLocale = ref($i18n.locale.value);

const { pages } = await usePages();
const contentPagesOpen = ref(false);
const ProductPagesOpen = ref(false);
const { closeDrawer } = useSiteConfiguration();

const splitItemsByType = (items: MenuItemType[]) => {
  const result = {
    contentItems: [] as MenuItemType[],
    itemItems: [] as MenuItemType[],
  };

  items.forEach((item) => {
    if (item.type === 'content') {
      result.contentItems.push(item);
    } else if (item.type === 'item') {
      result.itemItems.push(item);
    }
  });

  return result;
};
const { contentItems, itemItems } = splitItemsByType(pages.value);
const openHelpPage = () => {
  const urls = {
    en: ' https://knowledge.plentymarkets.com/en-gb/manual/main/online-store/shop-editor.html',
    de: 'https://knowledge.plentymarkets.com/de-de/manual/main/webshop/shop-editor.html',
  };

  const targetUrl = currentLocale.value === 'de' ? urls.de : urls.en;
  window.open(targetUrl, '_blank');
};

</script>
