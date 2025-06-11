<template>
  <div
    v-if="!loading"
    class="sticky top-[52px] h-[calc(100vh-50px)] overflow-y-auto"
    data-testid="pages-seo-settings-drawer"
  >
    <form data-testid="basic-settings-form" class="w-full shadow-[inset_0px_0px_20px_-20px_#111] absolute bg-white">
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
            <SfInput v-model="data.details[0].metaTitle" type="text" data-testid="seo-title" placeholder="Enter title">
              <template #suffix>
                <label for="page-id" class="rounded-lg cursor-pointer">
                  <input id="page-id" v-model="data.details[0].metaTitle" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </label>
        </div>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>Meta description</UiFormLabel>
            <SfTooltip :label="descTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
          <label>
            <SfInput
              v-model="data.details[0].metaDescription"
              type="text"
              data-testid="seo-description"
              placeholder="Enter description"
            >
              <template #suffix>
                <label for="page-type" class="rounded-lg cursor-pointer">
                  <input id="page-type" v-model="data.details[0].metaDescription" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
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
            <SfInput
              v-model="data.details[0].metaKeywords"
              type="text"
              data-testid="page-name"
              placeholder="Enter keywords"
            >
              <template #suffix>
                <label for="page-name" class="rounded-lg cursor-pointer">
                  <input id="page-name" v-model="data.details[0].metaKeywords" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
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
            v-model="selectedRobot"
            data-testid="page-parent"
            :options="robotNames"
            label="label"
            track-by="value"
            placeholder="Select robots"
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
            <UiFormLabel>Canonical URL</UiFormLabel>
            <SfTooltip :label="canicalTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
          <label>
            <SfInput
              v-model="data.details[0].canonicalLink"
              type="text"
              data-testid="seo-canonical"
              placeholder="Enter URL"
            >
              <template #suffix>
                <label for="page-id" class="rounded-lg cursor-pointer">
                  <input id="page-id" v-model="data.sitemap" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </label>
        </div>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel class="mb-1">Include page in Sitemap.xml</UiFormLabel>
            <SfSwitch
              v-model="isInSitemap"
              class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
            />
          </div>
        </div>
      </UiAccordionItem>
    </form>
  </div>

  <div v-else class="flex justify-center items-center mt-5">
    <SfLoaderCircular />
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfSwitch, SfTooltip, SfIconInfo, SfLoaderCircular } from '@storefront-ui/vue';

import Multiselect from 'vue-multiselect';
const metaData = ref(false);

const { getCategoryId } = useCategoryIdHelper();

const { data, loading, fetchCategorySettings } = useCategorySettings();
const isInSitemap = computed({
  get() {
    return data.value.sitemap === 'Y';
  },
  set(value: boolean) {
    data.value.sitemap = value ? 'Y' : 'N';
  },
});

watch(
  getCategoryId,
  async (newId: number | undefined) => {
    if (newId !== undefined) {
      await fetchCategorySettings(newId);
    }
  },
  { immediate: true },
);

const robotsDropdown = ref(false);
const furtherSettings = ref(false);
const robotNames = [
  { label: 'All', value: 'ALL' },
  { label: 'No Index', value: 'NOINDEX' },
  { label: 'No Follow', value: 'NOFOLLOW' },
  { label: 'No Index, No Follow', value: 'NOINDEX_NOFOLLOW' },
];

const selectedRobot = computed({
  get() {
    return robotNames.find((option) => option.value === data.value.details[0].metaRobots) || null;
  },
  set(selectedOption) {
    data.value.details[0].metaRobots = selectedOption ? selectedOption.value : '';
  },
});

const titleTooltip =
  'Title displayed in search results of search engines. Enter text here to add a prefix before the shop name in the page title (shown as “your text / shop name”).';
const descTooltip =
  'Short description of the page shown in search results of search engines. Should be engaging and informative.';
const robotsTooltip =
  'This setting controls how search engines treat your pages. Choose "all" to allow indexing and following links, or select other options to restrict them.';
const keywordsTooltip =
  'List of relevant terms, separated by commas. Some search engines may use them to improve discoverability,';
const canicalTooltip = 'Select a page to be used as the canonical URL for variations.';
</script>
