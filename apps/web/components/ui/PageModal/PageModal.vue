<template>
  <UiModal
    v-model="pageModalOpen"
    aria-labelledby="page-modal"
    tag="section"
    role="dialog"
    class="h-full md:w-[500px] md:h-fit m-0 p-0 overflow-y-auto page-modal"
    overlay-classes="z-[1000]"
  >
    <header class="flex items-center justify-between mb-2">
      <div class="flex items-center text-xl font-bold">Adding New Page</div>
      <button class="absolute right-2 top-2 px-4 py-4" @click="togglePageModal(false)">
        <SfIconClose />
      </button>
    </header>

    <p class="mb-6">Add name and type in order to add new page</p>

    <div class="mb-6">
      <UiFormLabel class="mb-1">Page Name</UiFormLabel>
      <SfInput v-model="pageName" name="pageName" type="text" placeholder="Page Name" data-testid="new-page-name" />
    </div>
    <div class="mb-6">
      <UiFormLabel class="mb-1">Page Type</UiFormLabel>
      <Multiselect
        v-model="pageType"
        data-testid="new-page-type"
        :options="pageTypes"
        placeholder="Select a page type"
        :allow-empty="false"
        class="cursor-pointer"
        select-label=""
        deselect-label="Selected"
      />
    </div>
    <div class="mb-6">
      <UiFormLabel class="mb-1">Parent Page</UiFormLabel>
      <Multiselect
        v-model="parentPage"
        data-testid="new-parent-page"
        :options="pageTypes"
        placeholder="Select a parent page"
        :allow-empty="false"
        class="cursor-pointer"
        select-label=""
        deselect-label="Selected"
      />
    </div>

    <div class="actions grid gap-4 grid-cols-2">
      <button
        type="button"
        data-testid="block-spacing-btn"
        class="border border-editor-button w-full py-2 rounded-md flex align-center justify-center text-editor-button"
        @click="togglePageModal(false)"
      >
        Cancel
      </button>
      <button
        type="button"
        data-testid="block-spacing-btn"
        class="border border-editor-button bg-editor-button w-full py-2 rounded-md flex align-center justify-center text-white"
        @click="togglePageModal(false)"
      >
        Add New Page
      </button>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { SfIconClose, SfInput } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';

const { pageModalOpen, togglePageModal } = useSiteConfiguration();

const pageTypes = ref(['Content', 'Item category']);
const pageName = ref('');
const pageType = ref('');
const parentPage = ref('');
</script>
