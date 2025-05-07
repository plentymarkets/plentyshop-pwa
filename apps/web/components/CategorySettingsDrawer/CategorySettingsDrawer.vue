<template>
  <SfDrawer
    v-model="open"
    class="bg-white border-0 shadow-[inset_0px_0px_20px_-20px_#111] category-drawer !absolute ml-[100%] w-[430px] min-w-[300px]"
    :placement="placement"
    :disable-click-away="true"
    :class="[{ 'max-w-[370px]': placement === 'left' || placement === 'right' }]"
  >
    <div class="px-4 py-5 border-b flex justify-between items-center">
      <h3 class="font-bold typography-headline-3">
        {{ getCategoryName }}
      </h3>
      <SfIconChevronLeft class="cursor-pointer" @click="handleBack" />
    </div>

    <div v-if="activeView" class="flex px-4 pt-2 gap-4 pb-2">
      <button
        :class="[
          'py-1 px-3 rounded-md font-medium',
          activeView === 'general' ? 'bg-primary-900 text-white' : 'text-gray-600 hover:text-primary-900',
        ]"
        @click="activeView = 'general'"
      >
        General
      </button>
      <button
        :class="[
          'py-1 px-3 rounded-md font-medium',
          activeView === 'seo' ? 'bg-primary-900 text-white' : 'text-gray-600 hover:text-primary-900',
        ]"
        @click="activeView = 'seo'"
      >
        SEO
      </button>
    </div>
    <ul v-if="!activeView" class="flex flex-col gap-1 flex-grow">
      <li
        class="flex justify-between items-center px-4 py-3 border-b cursor-pointer hover:bg-gray-50 rounded"
        @click="activeView = 'general'"
      >
        <span>General settings</span>
        <SfIconChevronRight />
      </li>
      <li
        class="flex justify-between items-center px-4 py-3 border-b cursor-pointer hover:bg-gray-50 rounded"
        @click="activeView = 'seo'"
      >
        <span>SEO settings</span>
        <SfIconChevronRight />
      </li>
    </ul>

    <PageSettingsView v-if="activeView === 'general'" class="mt-2" />
    <PageSeoView v-if="activeView === 'seo'" class="mt-2" />

    <div v-if="!activeView" class="py-4">
      <h3 class="font-bold text-center mb-3">Actions</h3>
      <div class="flex flex-col gap-4 justify-center items-center">
        <button
          class="border border-editor-button py-2 rounded-md flex items-center justify-center w-[90%] text-editor-button hover:bg-gray-50"
          @click="redirectToPage()"
        >
          <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer mr-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path :d="editPath" fill="black" />
            </svg>
          </SfIconBase>
          Edit page
        </button>
        <button
          class="border border-editor-button py-2 rounded-md flex items-center justify-center w-[90%] text-editor-button hover:bg-gray-50"
          @click="toggleDeleteModal(true)"
        >
          <SfIconDelete class="mr-2" />
          Delete page
        </button>
      </div>
    </div>
  </SfDrawer>
</template>

<script setup lang="ts">
import { SfDrawer, SfIconBase, SfIconChevronLeft, SfIconChevronRight, SfIconDelete } from '@storefront-ui/vue';
import { editPath } from 'assets/icons/paths/edit';
const { toggleDeleteModal } = useCategorySettings();
const { setSettingsCategory } = useSiteConfiguration();
const placement = ref<'left' | 'right'>('left');
const open = ref(true);
const { getCategoryName, getCategoryPath } = useCategoryIdHelper();

const { locale } = useI18n();
const localePrefix = computed(() => (locale.value.startsWith('/') ? locale.value : `/${locale.value}`));

const activeView = ref<null | 'general' | 'seo'>(null);
const redirectToPage = () => {
  const targetUrl = `${localePrefix.value}/${getCategoryPath.value}`;
  navigateTo(targetUrl);
  setSettingsCategory(null);
};
const handleBack = () => {
  if (activeView.value !== null) {
    activeView.value = null;
  } else {
    setSettingsCategory(null);
  }
};
</script>
