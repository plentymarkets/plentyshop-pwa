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

    <p class="mb-6">{{ pageName }} page will be deleted</p>
    <form data-testid="add-page-form" class="flex flex-col rounded-md gap-4" novalidate>
      <div class="actions flex flex-col gap-4">
        <button type="button" data-testid="delete-btn" class="bg-editor-danger w-full py-2 rounded-md text-white" @click="deletePage(id)">
          Delete page
        </button>
        <button
          type="button"
          data-testid="another-action-btn"
          class="border border-editor-button w-full py-2 rounded-md text-editor-button"
        >
          Delete only {{ language }} translations
        </button>
        <button
          type="submit"
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

const { unlinkModalOpen, toggleDeleteModal } = useSiteConfiguration();
const { getCategoryId } = useCategoryIdHelper();
const { pages } = await usePages();
const pageName = ref('');
const id = ref(1);
const { locale } = useI18n();
const language = ref('');
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
watch(
  () => getCategoryId.value,
  (newId) => {
    const foundPage = findPageById(newId ?? null, pages.value);
    if (foundPage) {
      pageName.value = foundPage.name;
      id.value = foundPage.id;
    }
  },
  { immediate: true },
);
watch(
  locale,
  (newLocale) => {
    language.value = newLocale.toString() === 'en' ? 'english' : 'german';
  },
  { immediate: true },
);

const closeModal = () => {
  toggleDeleteModal(false);
};
const deletePage = async (id: number) => {
  await useSdk().plentysystems.deleteCategory({
    categoryId: id,
  });
}
</script>
