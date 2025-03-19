<template>
    <div class="sticky top-[52px] h-[calc(100vh-50px)] overflow-y-auto" data-testid="pages-general-settings-drawer">
      <header class="flex items-center justify-between px-4 py-5 border-b">
        <div class="flex items-center text-xl font-bold">SEO Settings</div>
        <button data-testid="pages-view-close" class="!p-0" @click="closeDrawer">
          <SfIconClose />
        </button>
      </header>
  
      <form data-testid="basic-settings-form" class="w-full absolute bg-white">
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
              <SfTooltip :label="data.titleTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
                <SfIconInfo :size="'sm'" />
              </SfTooltip>
            </div>
  
            <label>
              <SfInput v-model="data.title" type="text" data-testid="seo-title" placeholder="Enter title">
                <template #suffix>
                  <label for="page-id" class="rounded-lg cursor-pointer">
                    <input id="page-id" v-model="data.title" type="text" class="invisible w-8" />
                  </label>
                </template>
              </SfInput>
            </label>
          </div>
  
          <div class="py-2">
            <div class="flex justify-between mb-2">
              <UiFormLabel>Meta description</UiFormLabel>
              <SfTooltip :label="data.robotsTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
                <SfIconInfo :size="'sm'" />
              </SfTooltip>
            </div>
            <label>
              <SfInput
                v-model="data.description"
                type="text"
                data-testid="seo-description"
                placeholder="Enter description"
              >
                <template #suffix>
                  <label for="page-type" class="rounded-lg cursor-pointer">
                    <input id="page-type" v-model="data.description" type="text" class="invisible w-8" />
                  </label>
                </template>
              </SfInput>
            </label>
          </div>
  
          <div class="py-2">
            <div class="flex justify-between mb-2">
              <UiFormLabel>Meta keywords</UiFormLabel>
              <SfTooltip :label="data.keywordsTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
                <SfIconInfo :size="'sm'" />
              </SfTooltip>
            </div>
            <label>
              <SfInput v-model="data.keywords" type="text" data-testid="page-name">
                <template #suffix>
                  <label for="page-name" class="rounded-lg cursor-pointer">
                    <input id="page-name" v-model="data.keywords" type="text" class="invisible w-8" />
                  </label>
                </template>
              </SfInput>
            </label>
          </div>
        </UiAccordionItem>
  
        <UiAccordionItem
          v-model="robots"
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
                <SfTooltip :label="data.robotsTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
                  <SfIconInfo :size="'sm'" /> </SfTooltip
              ></UiFormLabel>
              <SfTooltip :label="data.robotsTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
                <SfIconInfo :size="'sm'" />
              </SfTooltip>
            </div>
  
            <Multiselect
              v-model="selectedFont"
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
              <SfTooltip :label="data.canicalTooltip" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
                <SfIconInfo :size="'sm'" />
              </SfTooltip>
            </div>
            <label>
              <SfInput v-model="data.canonical" type="text" data-testid="seo-canonical" placeholder="Enter URL">
                <template #suffix>
                  <label for="page-id" class="rounded-lg cursor-pointer">
                    <input id="page-id" v-model="data.title" type="text" class="invisible w-8" />
                  </label>
                </template>
              </SfInput>
            </label>
          </div>
  
          <div class="py-2">
            <div class="flex justify-between mb-2">
              <UiFormLabel class="mb-1">Include page in Sitemap.xml</UiFormLabel>
              <SfSwitch
                v-model="loginNecessary"
                class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
              />
            </div>
          </div>
        </UiAccordionItem>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { SfIconClose, SfInput, SfSwitch, SfTooltip, SfIconInfo } from '@storefront-ui/vue';
  import Multiselect from 'vue-multiselect';
  const selectedFont = ref('');
  const metaData = ref(false);
  const robots = ref(false);
  const loginNecessary = ref(false);
  const furtherSettings = ref(false);
  const { closeDrawer } = useSiteConfiguration();
  const data = {
    title: 'Seo Title',
    description: 'Meta description',
    keywords: 'Meta keywords',
    canonical: 'Canonical URl',
    titleTooltip: 'Title displayed in search results of search engines.',
    descTooltip:
      'Short description of the page shown in search results of search engines. Should be engaging and informative.',
    keywordsTooltip:
      'List of relevant terms, separated by commas. Some search engines may use them to improve discoverability,',
    robotsTooltip:
      'This setting controls how search engines treat your pages. Choose "all" to allow indexing and following links, or select other options to restrict them.',
    canicalTooltip: 'Select a page to be used as the canonical URL for variations.',
  };
  // const categories = [{ name: 'Living room' }, { name: 'Armchairs & Stools' }, { name: 'Sofas' }];
  
  const robotNames = ['all', 'index', 'nofollow', 'noindex', 'no index, nofollow'];
  </script>
  