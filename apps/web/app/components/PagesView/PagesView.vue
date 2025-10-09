<template>
  <div class="pages-view sticky top-[52px] z-[2]" data-testid="pages-management-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">
        {{ getEditorTranslation('label') }}
        <SfTooltip
          :label="getEditorTranslation('open-manual-tooltip')"
          placement="right"
          :show-arrow="true"
          class="flex"
        >
          <SfIconHelp class="ml-2 cursor-pointer" @click="openHelpPage" />
        </SfTooltip>
      </div>
      <button data-testid="pages-view-close" class="!p-0" @click="closeDrawer">
        <SfIconClose />
      </button>
    </header>
    <div class="h-[80vh] overflow-y-auto">
      <div v-if="isDefaultLocale" class="mx-4 mb-4 mt-4">
        <button
          type="button"
          data-testid="add-page-btn"
          class="border border-editor-button w-full py-1 rounded-md flex align-center justify-center text-editor-button"
          @click="togglePageModal(true)"
        >
          <SfIconAdd /> {{ getEditorTranslation('add-page-label') }}
        </button>
      </div>

      <div v-else class="mx-4 mb-4 mt-4">
        <SfTooltip
          :label="getEditorTranslation('add-page-disabled-tooltip')"
          placement="right"
          :show-arrow="true"
          class="flex"
        >
          <button
            type="button"
            data-testid="add-page-btn"
            class="border border-editor-button w-full py-1 rounded-md flex align-center justify-center text-editor-button opacity-40 cursor-not-allowed"
            disabled="true"
            @click="null"
          >
            <SfIconAdd /> {{ getEditorTranslation('add-page-label') }}
          </button>
        </SfTooltip>
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
          <template v-else>{{ getEditorTranslation('save-settings-label') }}</template>
        </button>
      </div>
      <div class="mx-4 mt-4 mb-4 flex items-start gap-2 text-sm text-neutral-600">
        <SfIconWarning class="mt-0.5 shrink-0 text-yellow-500" />
        <span class="italic">{{ getEditorTranslation('reload-hint') }}</span>
      </div>

      <UiAccordionItem
        v-model="contentPagesOpen"
        data-testid="content-pages-section"
        summary-active-class="bg-neutral-100 border-t-0"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between select-none border-b"
      >
        <template #summary>
          <h2>{{ getEditorTranslation('content-pages-label') }}</h2>
        </template>

        <div
          :class="['mb-6 mt-4 overflow-auto', limitAccordionHeight ? 'max-h-[400px]' : 'max-h-[500px]']"
          @scroll="(e: Event) => handleScroll(e, 'content')"
        >
          <ul class="rounded-lg">
            <PagesItem
              :key="locale"
              :item="homepageItem"
              :parent-id="undefined"
              :icon="SfIconHome"
              :hide-settings="true"
            />
            <PagesItem v-for="item in contentItems" :key="`${item.id}-${locale}`" :item="item" :parent-id="item.id" />
            <li v-if="loadingContent" class="flex justify-center items-center py-4">
              <SfLoaderCircular size="sm" />
            </li>
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
          <h2>{{ getEditorTranslation('product-categories-label') }}</h2>
        </template>

        <div
          :class="['mb-6 mt-4 overflow-auto', limitAccordionHeight ? 'max-h-[400px]' : 'max-h-[500px]']"
          @scroll="(e: Event) => handleScroll(e, 'item')"
        >
          <ul class="rounded-lg">
            <PagesItem v-for="item in itemItems" :key="item.id" :item="item" :parent-id="item.id" />
            <li v-if="loadingItem" class="flex justify-center items-center py-4">
              <SfLoaderCircular size="sm" />
            </li>
          </ul>
        </div>
      </UiAccordionItem>
    </div>
  </div>
  <CategorySettingsDrawer v-if="settingsCategory" />
</template>

<script setup lang="ts">
import PagesItem from '~/components/PagesView/PagesItem.vue';
import {
  SfIconClose,
  SfIconHelp,
  SfTooltip,
  SfIconAdd,
  SfIconHome,
  SfLoaderCircular,
  SfIconWarning,
} from '@storefront-ui/vue';
import type { CategoryEntry } from '@plentymarkets/shop-api';
const { locale, defaultLocale } = useI18n();

const { closeDrawer, togglePageModal, settingsCategory } = useSiteConfiguration();
const { loading, hasChanges, save } = useCategorySettingsCollection();

const { contentItems, itemItems, loadingContent, loadingItem, fetchCategories, resetCategories } =
  useCategoriesSearch();

const contentPagesOpen = ref(false);
const productPagesOpen = ref(false);

const isDefaultLocale = computed(() => locale.value === defaultLocale);

const limitAccordionHeight = computed(() => contentPagesOpen.value && productPagesOpen.value);

const handleScroll = async (e: Event, type: 'content' | 'item') => {
  const el = e.target as HTMLElement;
  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;

  if (nearBottom) {
    await fetchCategories(type);
  }
};
onBeforeUnmount(() => {
  resetCategories();
});

watch(contentPagesOpen, (opened) => {
  if (opened && contentItems.value.length === 0) {
    fetchCategories('content');
  }
});

watch(productPagesOpen, (opened) => {
  if (opened && itemItems.value.length === 0) {
    fetchCategories('item');
  }
});

watch(locale, () => {
  if (contentPagesOpen.value) {
    resetCategories();
    fetchCategories('content');
  }
  if (productPagesOpen.value) {
    resetCategories();
    fetchCategories('item');
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

const homepageItem = computed<CategoryEntry>(() => ({
  clients: [],
  details: [
    {
      canonicalLink: '/',
      categoryId: '0',
      description: '',
      description2: '',
      fulltext: '',
      image: null,
      image2: null,
      image2Path: null,
      imagePath: null,
      itemListView: '',
      lang: locale.value,
      metaDescription: '',
      metaKeywords: '',
      metaRobots: 'index, follow',
      metaTitle: 'Homepage',
      name: 'Homepage',
      nameUrl: locale.value === defaultLocale ? '/' : `/${locale.value}`,
      pageView: 'Homepage',
      plenty_category_details_image_path: '',
      plenty_category_details_image2_path: '',
      plentyId: 0,
      position: '0',
      shortDescription: '',
      singleItemView: '',
      updatedAt: '',
      updatedBy: '',
    },
  ],
  hasChildren: false,
  id: 0,
  level: 1,
  linklist: '',
  parentCategoryId: 0,
  right: 'ALL',
  sitemap: 'Y',
  type: 'immutable',
  isLinkedToWebstore: true,
}));
</script>

<i18n lang="json">
{
  "en": {
    "label": "Pages",
    "open-manual-tooltip": "Open manual",
    "add-page-label": "Add Page",
    "add-page-disabled-tooltip": "You can only add pages in the default language of your shop.",
    "save-settings-label": "Save Settings",
    "reload-hint": "Changes to page settings are only reflected on reload.",
    "content-pages-label": "Content Pages",
    "product-categories-label": "Product Categories"
  },
  "de": {
    "label": "Pages",
    "open-manual-tooltip": "Open manual",
    "add-page-label": "Add Page",
    "add-page-disabled-tooltip": "You can only add pages in the default language of your shop.",
    "save-settings-label": "Save Settings",
    "reload-hint": "Changes to page settings are only reflected on reload.",
    "content-pages-label": "Content Pages",
    "product-categories-label": "Product Categories"
  }
}
</i18n>
