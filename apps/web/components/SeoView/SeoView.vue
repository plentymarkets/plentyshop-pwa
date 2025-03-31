
<template>
  <div class="sticky top-[52px] h-[calc(100vh-50px)] overflow-y-auto" data-testid="pages-general-settings-drawer">
    <form data-testid="basic-settings-form" class="w-full abssolute bg-white">
      <UiAccordionItem
        v-model="metaData"
        data-testid="open-basic-settings"
        summary-active-class="bg-neutral-100 border-t-0"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>Meta Data</h2>
       </template>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>Title</UiFormLabel>
            <SfTooltip :label="titleTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>

          <label>
            <SfInput v-model="title" type="text" data-testid="seo-title" placeholder="Enter title" />
          </label>
        </div>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>Meta description</UiFormLabel>
            <SfTooltip :label="robotsTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
          <label>
            <SfInput v-model="description" type="text" data-testid="seo-description" placeholder="Enter description" />
          </label>
        </div>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>Meta keywords</UiFormLabel>
            <SfTooltip :label="keywordsTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
          <label>
            <SfInput v-model="keywords" type="text" data-testid="page-name" placeholder="Enter keywords" />
          </label>
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="robotsDropdown"
        data-testid="open-basic-settings"
        summary-active-class="bg-neutral-100 border-t-0"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>Robot settings</h2>
        </template>
        <div class="py-2">
          <div class="flex justify-between">
            <UiFormLabel class="mb-1">Robots </UiFormLabel>
            <SfTooltip :label="robotsTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>

          <Multiselect
            v-model="robots"
            data-testid="page-parent"
            :options="robotNames"
            placeholder="Select a parent page"
            :allow-empty="false"
            class="cursor-pointer"
            select-label=""
            deselect-label="Selected"
          />
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="furtherSettings"
        data-testid="open-basic-settings"
        summary-active-class="bg-neutral-100 border-t-0"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>Further settings</h2>
        </template>
        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>Canonical Link</UiFormLabel>
            <SfTooltip :label="canicalTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
          <label>
            <SfInput v-model="canonical" type="text" data-testid="seo-canonical" placeholder="Enter URL" />
          </label>
        </div>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel class="mb-1">Include page in Sitemap.xml</UiFormLabel>
            <SfSwitch v-model="includeSitemap" />
          </div>
        </div>
      </UiAccordionItem>
    </form>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfSwitch, SfTooltip, SfIconInfo } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
const { pages } = await usePages();
const metaData = ref(false);
const { getCategoryId } = useCategoryIdHelper();

// Import state and methods from useCategorySettings
const {
  title,
  description,
  keywords,
  canonicalLink: canonical,
  robots,
  includeSitemap,
 // getPageId,
} = useCategorySettings(getCategoryId);

const findPageById = (id: number | string) => {
  return pages.value.find((page) => page.id === id);
};


// Watch for changes in the page ID and update the form fields
watch(
  () => getCategoryId.value,
  (newId) => {
    const foundPage = newId !== null ? findPageById(newId) : null;
    if (foundPage) {
      if (title.value !== foundPage.name) title.value = foundPage.name;
      if (description.value !== foundPage.metaDescription) description.value = foundPage.metaDescription || '';
      if (keywords.value !== foundPage.metaKeywords) keywords.value = foundPage.metaKeywords || '';
      if (canonical.value !== foundPage.canonicalLink) canonical.value = foundPage.canonicalLink || '';
      if (robots.value !== foundPage.metaRobots) robots.value = foundPage.metaRobots || 'all';
      if (includeSitemap.value !== (foundPage.sitemap === 'y')) includeSitemap.value = foundPage.sitemap === 'y';
      
    }
  },
  { immediate: true },
);
const robotsDropdown = ref(false);
const furtherSettings = ref(false);
const robotNames = ['all', 'index', 'nofollow', 'noindex', 'no index, nofollow'];

const titleTooltip = 'Title displayed in search results of search engines.';
const robotsTooltip =
  'This setting controls how search engines treat your pages. Choose "all" to allow indexing and following links, or select other options to restrict them.';
const keywordsTooltip =
  'List of relevant terms, separated by commas. Some search engines may use them to improve discoverability,';
const canicalTooltip = 'Select a page to be used as the canonical URL for variations.';
</script>
