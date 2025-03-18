<template>
  <div class="sticky top-[52px] h-[calc(100vh-50px)] overflow-y-auto" data-testid="pages-general-settings-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">
        General Settings
      </div>
      <button data-testid="pages-view-close" class="!p-0" @click="closeDrawer">
        <SfIconClose />
      </button>
    </header>

    <form data-testid="basic-settings-form" class="w-full absolute bg-white">
      <UiAccordionItem
        v-model="basicSettingsOpen"
        data-testid="open-basic-settings"
        summary-active-class="bg-neutral-100 border-t-0"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>Text</h2>
        </template>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>Page ID</UiFormLabel>
          </div>
          <label>
            <SfInput v-model="data.id" type="text" data-testid="page-id">
              <template #suffix>
                <label for="page-id" class="rounded-lg cursor-pointer">
                  <input id="page-id" v-model="data.id" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </label>
        </div>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>Page Type</UiFormLabel>
          </div>
          <label>
            <SfInput v-model="data.type" type="text" data-testid="page-type">
              <template #suffix>
                <label for="page-type" class="rounded-lg cursor-pointer">
                  <input id="page-type" v-model="data.type" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </label>
        </div>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>Page Name</UiFormLabel>
          </div>
          <label>
            <SfInput v-model="data.name" type="text" data-testid="page-name">
              <template #suffix>
                <label for="page-name" class="rounded-lg cursor-pointer">
                  <input id="page-name" v-model="data.name" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </label>
        </div>

        <div class="py-2">
          <UiFormLabel class="mb-1">Parent Page</UiFormLabel>
          <Multiselect
            v-model="data.parent"
            data-testid="page-parent"
            :options="categories"
            placeholder="Select a parent page"
            :allow-empty="false"
            class="cursor-pointer"
            select-label=""
            deselect-label="Selected"
          />
        </div>
        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>URL Slug</UiFormLabel>
          </div>
          <label>
            <SfInput v-model="data.nameUrl" type="text" data-testid="page-url-slug">
              <template #suffix>
                <label for="page-url-slug" class="rounded-lg cursor-pointer">
                  <input id="page-url-slug" v-model="data.nameUrl" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </label>
        </div>
        <div class="py-2">
          <UiFormLabel class="mb-1">Display in header navigation</UiFormLabel>
          <SfSwitch
            v-model="displayInHeader"
            class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
          />
        </div>
        <div class="py-2">
          <UiFormLabel class="mb-1">Login Necessary</UiFormLabel>
          <SfSwitch
            v-model="loginNecessary"
            class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
          />
        </div>
      </UiAccordionItem>
    </form>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfInput, SfSwitch } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';

const basicSettingsOpen = ref(false);
const displayInHeader = ref(true);
const loginNecessary = ref(true);
const { closeDrawer } = useSiteConfiguration();


const data = {
  id: 21,
  type: "content",
  right: "all",
  childCount: 1,
  itemCount: [],
  details: [],
  children: [],
  lang: "en",
  name: "Sofas",
  nameUrl: "sofas",
  metaTitle: "",
  imagePath: null,
  image2Path: null,
  parent: "Living room"
};
const categories = [
  { name: "Living room" },
  { name: "Armchairs & Stools" },
  { name: "Sofas" }
];
</script>
