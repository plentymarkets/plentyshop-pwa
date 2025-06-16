<template>
  <div class="site-settings-view sticky top-[52px]" data-testid="seo-settings-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">SEO Settings</div>
      <button class="!p-0" @click="closeDrawer">
        <SfIconClose />
      </button>
    </header>

    <div class="flex flex-col px-4 py-5 border-b text-sm">
      <p class="pb-2">
        <SfIconInfo size="sm" />
        <span class="px-2 align-middle font-bold">Global defaults</span>
      </p>
      <p>
        {{ globalDefaults }}
      </p>
    </div>
    <div class="h-[calc(100vh-150px)] overflow-y-auto">
      <UiAccordionItem
        v-model="metaData"
        data-testid="meta-settings"
        summary-active-class="bg-neutral-100 border-t-0"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>Meta data</h2>
        </template>

        <div class="py-2 px-4">
          <div class="mb-4">
            <div class="flex justify-between mb-2">
              <UiFormLabel>Title</UiFormLabel>
              <SfTooltip :label="titleTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
                <SfIconInfo :size="'sm'" />
              </SfTooltip>
            </div>
            <SfInput v-model="seoSettings.title" type="text" data-testid="seo-title" placeholder="Enter title" />
          </div>

          <div class="mb-4">
            <div class="flex justify-between mb-2">
              <UiFormLabel>Meta description</UiFormLabel>
              <SfTooltip :label="descTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
                <SfIconInfo :size="'sm'" />
              </SfTooltip>
            </div>
            <SfTextarea
              v-model="seoSettings.description"
              data-testid="seo-description"
              class="w-full"
              placeholder="Enter description"
              rows="3"
            />
          </div>

          <div class="mb-4">
            <div class="flex justify-between mb-2">
              <UiFormLabel>Meta keywords</UiFormLabel>
              <SfTooltip :label="keywordsTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
                <SfIconInfo :size="'sm'" />
              </SfTooltip>
            </div>
            <SfInput
              v-model="seoSettings.keywords"
              type="text"
              data-testid="seo-keywords"
              placeholder="Enter keywords"
            />
          </div>
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="robotsOpen"
        data-testid="robots-settings"
        summary-active-class="bg-neutral-100 border-t-0"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>Robots settings</h2>
        </template>

        <div class="py-2 px-4">
          <div class="mb-4">
            <div class="flex justify-between mb-2">
              <UiFormLabel>Robots</UiFormLabel>
              <SfTooltip :label="robotsTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
                <SfIconInfo :size="'sm'" />
              </SfTooltip>
            </div>
            <Multiselect
              v-model="seoSettings.robots"
              :options="robotOptions"
              placeholder="Select robots meta tag"
              :searchable="false"
              :allow-empty="false"
              data-testid="seo-robots"
            />
          </div>
        </div>
      </UiAccordionItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconInfo, SfInput, SfTextarea, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';

const { closeDrawer } = useSiteConfiguration();
const state = useState<UseSiteConfigurationState>('siteConfiguration');

const metaData = ref(false);
const robotsOpen = ref(false);

const seoSettings = computed({
  get: () => state.value.seoSettings,
  set: (value) => {
    state.value.seoSettings = value;
  },
});

const robotOptions = ['all', 'noindex', 'nofollow', 'noindex, nofollow'];

const globalDefaults = 'The settings below apply to any page without its own, page-specific settings.';
const titleTooltip =
  'Title displayed in search results of search engines (format: Title | Shop name). To update the shop name, open your Plenty system and go to Setup » Client » [Client name] » Settings.';
const descTooltip =
  'Short description of the page shown in search results of search engines. Should be engaging and informative.';
const keywordsTooltip =
  'List of relevant terms, separated by commas. Some search engines may use them to improve discoverability.';
const robotsTooltip =
  'Controls how search engines treat your pages. Choose "all" to allow indexing and following links, or select other options to restrict them.';
</script>
