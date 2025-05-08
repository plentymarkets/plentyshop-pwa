<template>
  <UiModal
    v-model="unlinkModalOpen"
    aria-labelledby="page-modal"
    tag="section"
    role="dialog"
    class="h-full md:w-[500px] md:h-fit m-0 p-0 overflow-y-auto page-modal"
    overlay-classes="z-[1000]"
  >
    <header class="flex items-center justify-between mb-2">
      <div class="flex items-center text-xl font-bold">Delete page?</div>
      <button class="absolute right-2 top-2 px-4 py-4" @click="closeModal">
        <SfIconClose />
      </button>
    </header>

    <p class="mb-6">{{ getCategoryName }} page will be deleted</p>
    <form data-testid="add-page-form" class="flex flex-col rounded-md gap-4" novalidate>
      <div class="actions flex flex-col gap-4">
        <button
          type="button"
          aria-label="deleteButton"
          data-testid="delete-btn"
          class="bg-red-700 w-full py-2 rounded-md text-white"
          @click="deletePage(currentCategoryId!, getCategoryName!)"
        >
          Delete page
        </button>
        <button
          type="button"
          aria-label="cancelButton"
          data-testid="cancel-btn"
          class="border border-editor-button w-full py-2 rounded-md text-editor-button"
          @click="closeModal"
        >
          Keep Page
        </button>
      </div>
    </form>
  </UiModal>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';
const { unlinkModalOpen, toggleDeleteModal, deletePage } = useCategorySettings();
const { getCategoryId, getCategoryName } = useCategoryIdHelper();

const currentCategoryId = computed(() => getCategoryId.value);

const closeModal = () => {
  toggleDeleteModal(false);
};
</script>
