<template v-if="_isReady">
  <UiModal
    v-model="pageModalOpen"
    aria-labelledby="page-modal"
    tag="section"
    role="dialog"
    class="h-full md:w-[500px] md:h-fit m-0 p-0 overflow-y-auto page-modal font-editor"
    overlay-classes="z-[1000]"
  >
    <header class="flex items-center justify-between mb-2">
      <div class="flex items-center text-xl font-bold">Add page</div>
      <button class="absolute right-2 top-2 px-4 py-4" @click="closeModal">
        <SfIconClose />
      </button>
    </header>

    <p class="mb-6">Add name and type in order to add a new page</p>
    <form data-testid="add-page-form" class="flex flex-col rounded-md gap-4" novalidate @submit.prevent="onSubmit">
      <div class="mb-6">
        <UiFormLabel class="mb-1">Page Name</UiFormLabel>
        <SfInput
          v-bind="pageNameAttributes"
          v-model="pageName"
          name="pageName"
          type="text"
          placeholder="Page Name"
          data-testid="new-page-name"
          :invalid="Boolean(errors['pageName'])"
        />
        <ErrorMessage as="div" name="pageName" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Page Type</UiFormLabel>
        <Multiselect
          v-model="pageType"
          data-testid="new-page-type"
          :options="pageTypes"
          label="label"
          track-by="value"
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
          :options="categoriesWithFallback"
          :custom-label="getLabel"
          placeholder="Select a parent page"
          :allow-empty="false"
          class="cursor-pointer"
          select-label=""
          deselect-label="Selected"
          :searchable="true"
          :internal-search="false"
          @search-change="handleSearch"
        />
      </div>

      <div
        v-if="!isValidParentPage()"
        class="bg-red-700 w-full rounded-md text-white text-sm px-4 py-2 grid grid-cols-[auto,1fr] gap-2"
      >
        <span class="flex items-center">
          <SfIconWarning />
        </span>
        <span>
          {{ invalidParentMessage }}
        </span>
      </div>

      <div class="actions grid gap-4 grid-cols-2">
        <button
          type="button"
          data-testid="block-spacing-btn"
          class="border border-editor-button w-full py-2 rounded-md flex align-center justify-center text-editor-button"
          @click="closeModal"
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="block-spacing-btn"
          class="border border-editor-button bg-editor-button w-full py-2 rounded-md flex align-center justify-center text-white"
          :class="{ 'opacity-50 cursor-not-allowed': !isValidParentPage() }"
          :disabled="!isValidParentPage()"
        >
          Add page
        </button>
      </div>
    </form>
  </UiModal>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconWarning, SfInput } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import { ErrorMessage } from 'vee-validate';

const {
  _isReady,
  pageModalOpen,
  pageType,
  pageTypes,
  parentPage,
  categoriesWithFallback,
  pageName,
  pageNameAttributes,
  errors,
  getLabel,
  isValidParentPage,
  closeModal,
  onSubmit,
  handleSearch,
} = useAddPageModal();

const invalidParentMessage =
  "You've selected a level 6 category as parent page. Select a category of level 5 or lower.";
</script>
