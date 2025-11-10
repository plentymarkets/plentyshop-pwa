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
      <UiButton variant="secondary" class="w-full">Cancel</UiButton>
      <UiButton variant="primary" class="w-full">Reset to default</UiButton>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';

const { unlinkModalOpen, resetType, toggleResetModal } = useResetProductPageModal();

const closeModal = () => {
  toggleResetModal(false);
};

const getModalText = () => {
  if (resetType.value === 'category') {
    return getEditorTranslation('resetCategoryText');
  } else if (resetType.value === 'detail') {
    return getEditorTranslation('resetDetailText');
  }
};
</script>

<i18n lang="json">
{
  "en": {
    "resetTitle": "Reset to default",
    "resetCategoryText": "All your customizations for the product category page will be permanently reseted to default.",
    "resetDetailText": "All your customizations for the product detail page will be permanently reseted to default.",
    "resetConfirmation": "Are you sure you want to continue?"
  },
  "de": {
    "resetTitle": "Reset to default",
    "resetCategoryMessage": "All your customizations for the product category page will be permanently reseted to default.",
    "resetDetailText": "All your customizations for the product detail page will be permanently reseted to default.",
    "resetConfirmation": "Are you sure you want to continue?"
  }
}
</i18n>
