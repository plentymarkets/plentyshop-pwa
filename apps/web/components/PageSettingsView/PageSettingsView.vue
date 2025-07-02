<template>
  <div
    v-if="!loading"
    class="sticky top-[52px] h-[calc(100vh-50px)] overflow-y-auto"
    data-testid="pages-general-settings-drawer"
  >
    <form data-testid="basic-settings-form" class="w-full shadow-[inset_0px_0px_20px_-20px_#111] absolute bg-white">
      <UiAccordionItem
        v-model="basicSettingsOpen"
        data-testid="open-basic-settings"
        summary-active-class="bg-neutral-100 border-t-0"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>Basics</h2>
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
            <SfInput v-model="pageName" type="text" data-testid="page-name">
              <template #suffix>
                <label for="page-name" class="rounded-lg cursor-pointer">
                  <input id="page-name" v-model="pageName" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </label>
        </div>
        <div class="py-2">
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
            v-model="parentPageValue"
            data-testid="new-parent-page"
            :options="filteredParentOptions"
            :custom-label="getLabel"
            placeholder="Select a parent page"
            :allow-empty="false"
            class="cursor-pointer"
            select-label=""
            deselect-label="Selected"
            :searchable="true"
            :internal-search="true"
            @search-change="handleSearch"
          />
        </div>

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
            <SfInput v-model="pageNameUrl" type="text" data-testid="page-url-slug">
              <template #suffix>
                <label for="page-url-slug" class="rounded-lg cursor-pointer">
                  <input id="page-url-slug" v-model="pageNameUrl" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </label>
        </div>
        <div class="py-2">
          <div class="flex justify-between">
            <UiFormLabel class="mb-1">Position </UiFormLabel>
            <SfTooltip
              label="The position determines the page order in the navigation and the editor. Lower positions come first."
              :placement="'top'"
              :show-arrow="true"
              class="ml-2 z-10"
            >
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
          <label>
            <SfInput v-model="pagePosition" type="text" data-testid="page-position">
              <template #suffix>
                <label for="page-position" class="rounded-lg cursor-pointer">
                  <input id="page-position" v-model="pagePosition" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </label>
        </div>
        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel class="mb-1">
              Activate page for store
              <SfTooltip
                label="If you deactivate this page, customers and search engines won't be able to access it via the navigation or direct links. You can reactivate the page at any time."
                :placement="'top'"
                :show-arrow="true"
                class="ml-2 z-10"
              >
                <SfIconInfo :size="'sm'" />
              </SfTooltip>
            </UiFormLabel>

            <SfSwitch
              v-model="data.isLinkedToWebstore"
              class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
            />
          </div>
        </div>
        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel class="mb-1">Display in header navigation</UiFormLabel>
            <SfSwitch
              v-model="isLinkedList"
              class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
            />
          </div>
        </div>
        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel class="mb-1">Login Necessary</UiFormLabel>
            <SfSwitch
              v-model="isLoginRequired"
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
import { SfIconInfo, SfInput, SfSwitch, SfTooltip, SfLoaderCircular } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import type { CategoryDetails } from '@plentymarkets/shop-api/lib/types/api/category';

const basicSettingsOpen = ref(true);

const { getCategoryId } = useCategoryIdHelper();
const { data, loading, fetchCategorySettings } = useCategorySettings();

const { allItems } = useCategoriesSearch();

const { handleSearch, getLabel, initializeModalState } = useAddPageModal();

const parentPageValue = computed({
  get() {
    if (
      data.value.parentCategoryId === 0 ||
      data.value.parentCategoryId === null ||
      data.value.parentCategoryId === undefined
    ) {
      return allItems.value.find((cat) => cat.id === 0) || null;
    }
    return (
      allItems.value.find((cat) => cat.id === data.value.parentCategoryId) ||
      allItems.value.find((cat) => cat.id === 0) ||
      null
    );
  },
  set(val) {
    data.value.parentCategoryId = val?.id === 0 ? 0 : val?.id || 0;
  },
});

const isLoginRequired = computed({
  get() {
    return data.value.right === 'customer';
  },
  set(value: boolean) {
    data.value.right = value ? 'customer' : 'all';
  },
});

const isLinkedList = computed({
  get() {
    return data.value.linklist === 'Y';
  },
  set(value: boolean) {
    data.value.linklist = value ? 'Y' : 'N';
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

const pageTypeOptions = [
  { label: 'Item', value: 'item' },
  { label: 'Content', value: 'content' },
];

const selectedPageType = computed({
  get() {
    return pageTypeOptions.find((option) => option.value === data.value.type) || null;
  },
  set(selectedOption) {
    data.value.type = selectedOption ? selectedOption.value : '';
  },
});

const detailField = <K extends keyof CategoryDetails>(field: K) =>
  computed({
    get() {
      return data.value.details[0]?.[field] ?? '';
    },
    set(val: CategoryDetails[K]) {
      if (!data.value.details.length) {
        data.value.details.push({} as CategoryDetails);
      }
      data.value.details[0][field] = val;
    },
  });

const pageName = detailField('name');
const pageNameUrl = detailField('nameUrl');
const pagePosition = detailField('position');

onMounted(() => {
  initializeModalState();
});

watch(getCategoryId, (newId) => {
  if (newId !== undefined) {
    initializeModalState();
  }
});

// Remove debug console.log to fix linter error
watch(
  () => data.value.parentCategoryId,
  () => {},
  { immediate: true },
);

const filteredParentOptions = computed(() => {
  return allItems.value.filter((cat) => cat.id !== data.value.id);
});
</script>
