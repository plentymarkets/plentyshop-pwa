<template>
  <EditorFormPanel
    v-model="globalPagesOpen"
    :title="getEditorTranslation('global-pages-label')"
    data-testid="global-pages-section"
  >
    <div class="mt-4">
      <p class="mb-4">{{ getEditorTranslation('global-pages-description') }}</p>
    </div>

    <div class="border-b border-neutral-200 my-4" />

    <template v-for="(pageSection, index) in globalPagesButtons" :key="pageSection.type">
      <p class="mb-4 font-medium">{{ getEditorTranslation(pageSection.labelKey) }}</p>
      <div class="mt-3 flex flex-col gap-2">
        <button
          type="button"
          class="flex-[10] border border-slate-900 text-slate-900 h-[40px] px-3 py-1.5 rounded-md hover:bg-gray-100 flex items-center justify-center"
          @click="pageSection.onEdit"
        >
          <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer mr-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path :d="editPath" fill="black" />
            </svg>
          </SfIconBase>
          {{ getEditorTranslation('global-pages-edit-label') }}
        </button>
        <button
          type="button"
          class="border border-slate-900 text-slate-900 h-[40px] px-3 py-1.5 rounded-md hover:bg-gray-100 flex items-center justify-center"
          @click="pageSection.onReset"
        >
          <SfIconUndo class="fill-primary-900 cursor-pointer mr-2" />
          {{ getEditorTranslation('global-pages-reset-label') }}
        </button>
      </div>

      <div v-if="index < globalPagesButtons.length - 1" class="border-b border-neutral-200 my-4" />
    </template>
  </EditorFormPanel>
</template>

<script setup lang="ts">
import { SfIconBase, SfIconUndo } from '@storefront-ui/vue';
import { editPath } from '~/assets/icons/paths/edit';

const router = useRouter();
const { toggleResetModal } = useResetProductPageModal();

const globalPagesOpen = ref(false);

const globalPagesButtons = [
  {
    type: 'category',
    labelKey: 'global-pages-product-category',
    onEdit: () => router.push(paths.globalItemCategory),
    onReset: () => toggleResetModal(true, 'category'),
  },
  {
    type: 'detail',
    labelKey: 'global-pages-product-detail',
    onEdit: () => router.push(paths.globalItemDetails),
    onReset: () => toggleResetModal(true, 'product'),
  },
];
</script>

<i18n lang="json">
{
  "en": {
    "global-pages-label": "Page Layouts",
    "global-pages-description": "Quick access to edit page layout, or reset to the default.",
    "global-pages-product-category": "Product category page",
    "global-pages-product-detail": "Product detail page",
    "global-pages-edit-label": "Edit page",
    "global-pages-reset-label": "Reset to default"
  },
  "de": {
    "global-pages-label": "Page Layouts",
    "global-pages-description": "Quick access to edit page layout, or reset to the default.",
    "global-pages-product-category": "Product category page",
    "global-pages-product-detail": "Product detail page",
    "global-pages-edit-label": "Edit page",
    "global-pages-reset-label": "Reset to default"
  }
}
</i18n>
