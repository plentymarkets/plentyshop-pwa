<template>
  <div
    v-if="ready"
    class="sticky top-[52px] h-[calc(100vh-50px)] overflow-y-auto"
    data-testid="pages-general-settings-drawer"
  >
    <form data-testid="basic-settings-form" class="w-full absolute bg-white">
      <UiAccordionItem
        v-model="basicSettingsOpen"
        data-testid="open-basic-settings"
        summary-active-class="bg-neutral-100 border-t-0"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>Text</h2>
          {{ data.id }}
        </template>
        <div class="py-2">
          <div class="flex justify-between">
            <UiFormLabel class="mb-1">Page ID </UiFormLabel>
            <SfTooltip
              label="Unique ID of the page. Cannot be changed."
              :placement="'top'"
              :show-arrow="true"
              class="ml-2 z-10"
            >
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
          <label>
            <SfInput
              v-model="data.id"
              type="text"
              data-testid="page-id"
              wrapper-class="!bg-disabled-100 !ring-disabled-300 !ring-1"
              disabled
            >
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
            <SfTooltip
              label="The page type defines the purpose and functionality of a page. A content page can be freely filled with content, while a category page is used to assign and display products."
              :placement="'top'"
              :show-arrow="true"
              class="ml-2 z-100"
            >
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
          <Multiselect
            v-model="selectedPageType"
            data-testid="new-page-type"
            :options="pageTypeOptions"
            label="label"
            track-by="value"
            placeholder="Select a page type"
            :allow-empty="false"
            class="cursor-pointer"
            select-label=""
            deselect-label="Selected"
          />
        </div>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>Page Name</UiFormLabel>
            <SfTooltip
              label="The page name is used to identify the page in the page list and can be visible in the navigation, depending on the settings. It can be changed at any time."
              :placement="'top'"
              :show-arrow="true"
              class="ml-2 z-10"
            >
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
          <label>
            <SfInput v-model="data.details[0].name" type="text" data-testid="page-name">
              <template #suffix>
                <label for="page-name" class="rounded-lg cursor-pointer">
                  <input id="page-name" v-model="data.details[0].name" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </label>
        </div>
        <!-- <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel class="mb-1">Parent Page</UiFormLabel>
            <SfTooltip
              label="Select a parent to create a subpage. The parent page can also be left empty."
              :placement="'top'"
              :show-arrow="true"
              class="ml-2 z-10"
            >
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
          <Multiselect
            v-model="selectedPage"
            data-testid="page-parent"
            :options="pageOptions"
            label="name"
            placeholder="Select a parent page"
            :allow-empty="false"
            class="cursor-pointer"
            select-label=""
            track-by="id"
            deselect-label="Selected"
          />
        </div> -->

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>URL Slug</UiFormLabel>
            <SfTooltip
              label="The URL slug defines the page’s web address and affects SEO as well as URL readability. Changing it may break existing links."
              :placement="'top'"
              :show-arrow="true"
              class="ml-2 z-10"
            >
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
          <label>
            <SfInput v-model="data.details[0].nameUrl" type="text" data-testid="page-url-slug">
              <template #suffix>
                <label for="page-url-slug" class="rounded-lg cursor-pointer">
                  <input id="page-url-slug" v-model="data.details[0].nameUrl" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </label>
        </div>
        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel class="mb-1">Display in header navigation</UiFormLabel>
            <SfSwitch
              v-model="data.linklist"
              class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
            />
          </div>
        </div>
        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel class="mb-1">Login Necessary</UiFormLabel>
            <SfSwitch
              v-model="data.right"
              class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
            />
          </div>
        </div>
      </UiAccordionItem>
    </form>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfInput, SfSwitch, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';

const basicSettingsOpen = ref(false);

const { getCategoryId } = useCategoryIdHelper();
const { data, ready, fetchCategorySettings } = useCategorySettings();

watch(
  getCategoryId,
  async (newId: number | undefined) => {
    if (newId !== undefined) {
      ready.value = false;
      await fetchCategorySettings(newId);
      ready.value = true;
      console.log('Category data ready for ID:', newId);
    }
  },
  { immediate: true },
);

const pageTypeOptions = [
  { label: 'Item', value: 'item' },
  { label: 'Content', value: 'content' },
  { label: 'Container', value: 'container' },
  { label: 'Blog', value: 'blog' },
];

const selectedPageType = computed({
  get() {
    return pageTypeOptions.find((option) => option.value === data.value.type) || null;
  },
  set(selectedOption) {
    data.value.type = selectedOption ? selectedOption.value : null;
  },
});

const findPageById = (id: number | null, pagesList: Page[]): Page | undefined => {
  for (const page of pagesList) {
    if (page.id === id) {
      return page;
    }
    if (page.children) {
      const foundPage = findPageById(id, page.children);
      if (foundPage) {
        return foundPage;
      }
    }
  }
  return undefined;
};
</script>
