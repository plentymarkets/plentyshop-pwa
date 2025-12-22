<template>
  <UiModal
    v-model="unlinkModalOpen"
    aria-labelledby="page-modal"
    tag="section"
    role="dialog"
    class="h-full md:w-[500px] md:h-fit m-0 p-0 overflow-y-auto page-modal"
    overlay-classes="z-[1000]"
  >
    <header class="flex items-center justify-between mb-6">
      <div class="flex items-center text-xl font-bold">{{ getEditorTranslation('resetTitle') }}</div>
      <button class="absolute right-2 top-2 px-4 py-4" @click="closeModal">
        <SfIconClose />
      </button>
    </header>
    <p class="mb-6">{{ getModalText() }}</p>
    <p class="mb-6">{{ getEditorTranslation('resetConfirmation') }}</p>
    <div class="flex items-center justify-between gap-4">
      <button
        type="button"
        data-testid="reset-modal-cancel-button"
        class="border border-editor-button w-full py-2 rounded-md flex align-center justify-center text-editor-button"
        @click="closeModal"
      >
        {{ getEditorTranslation('cancel') }}
      </button>
      <button
        type="button"
        data-testid="reset-modal-confirm-button"
        class="border border-editor-button bg-editor-button w-full py-2 rounded-md flex align-center justify-center text-white"
        @click="() => deleteBlocks('TEST', '1231312')"
      >
        {{ getEditorTranslation('resetButton') }}
      </button>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';

const { unlinkModalOpen, resetType, toggleResetModal, deleteBlocks } = useResetProductPageModal();

const closeModal = () => {
  toggleResetModal(false);
};

const getModalText = () => {
  if (resetType.value === 'category') {
    return getEditorTranslation('resetCategoryText');
  } else if (resetType.value === 'detail') {
    return getEditorTranslation('resetDetailText');
  }

  return '';
};
</script>

<i18n lang="json">
{
  "en": {
    "resetTitle": "Reset to default",
    "resetCategoryText": "All your customisations for the product category page will be permanently reset to default.",
    "resetDetailText": "All your customisations for the product detail page will be permanently reset to default.",
    "resetConfirmation": "Are you sure you want to continue?",
    "cancel": "Cancel",
    "resetButton": "Reset to default"
  },
  "de": {
    "resetTitle": "Reset to default",
    "resetCategoryText": "All your customisations for the product category page will be permanently reset to default.",
    "resetDetailText": "All your customisations for the product detail page will be permanently reset to default.",
    "resetConfirmation": "Are you sure you want to continue?",
    "cancel": "Cancel",
    "resetButton": "Reset to default"
  }
}
</i18n>
