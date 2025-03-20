<template>
  <div class="sticky top-[52px] h-[calc(100vh-50px)] overflow-y-auto" data-testid="pages-general-settings-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">SEO Settings</div>
      <button data-testid="pages-view-close" class="!p-0" @click="closeDrawer">
        <SfIconChevronLeft />
      </button>
    </header>

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
            <SfInput v-model="title" type="text" data-testid="seo-title" placeholder="Enter title">
              <template #suffix>
                <label for="page-id" class="rounded-lg cursor-pointer">
                  <input id="page-id" v-model="title" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
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
            <SfInput
              v-model="description"
              type="text"
              data-testid="seo-description"
              placeholder="Enter description"
            >
              <template #suffix>
                <label for="page-type" class="rounded-lg cursor-pointer">
                  <input id="page-type" v-model="description" type="text" class="invisible w-8" />
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
            <SfInput v-model="keywords" type="text" data-testid="page-name" placeholder="Enter keywords">
              <template #suffix>
                <label for="page-name" class="rounded-lg cursor-pointer">
                  <input id="page-name" v-model="keywords" type="text" class="invisible w-8" />
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
            <UiFormLabel class="mb-1"
              >Robots
              <SfTooltip :label="robotsTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
                <SfIconInfo :size="'sm'" /> </SfTooltip
            ></UiFormLabel>
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
            <UiFormLabel>Title</UiFormLabel>
            <SfTooltip :label="canicalTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
          <label>
            <SfInput v-model="canonical" type="text" data-testid="seo-canonical" placeholder="Enter URL">
              <template #suffix>
                <label for="page-id" class="rounded-lg cursor-pointer">
                  <input id="page-id" v-model="canonical" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </label>
        </div>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel class="mb-1">Include page in Sitemap.xml</UiFormLabel>
            <SfSwitch
              v-model="includeSitemap"
              class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
            />
          </div>
        </div>
      </UiAccordionItem>
    </form>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfSwitch, SfTooltip, SfIconInfo, SfIconChevronLeft } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import { useSeoConfiguration } from '~/composables/useSeoConfiguration';

const robotsDropdown = ref(false);
const { title, description, keywords, robots, canonical, includeSitemap } = useSeoConfiguration();
const { closeDrawer } = useSiteConfig();
const metaData = ref(false);
const furtherSettings = ref(false);
const robotNames = ['all', 'index', 'nofollow', 'noindex', 'no index, nofollow'];

const titleTooltip = 'Title displayed in search results of search engines.';
const robotsTooltip = 'This setting controls how search engines treat your pages. Choose "all" to allow indexing and following links, or select other options to restrict them.';
const keywordsTooltip = 'List of relevant terms, separated by commas. Some search engines may use them to improve discoverability,';
const canicalTooltip = 'Select a page to be used as the canonical URL for variations.';
</script>
