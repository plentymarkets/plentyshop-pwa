<template>
  <div>
    <UiAccordionItem
      v-model="textOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="item-grid-card"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('item-card-label') }}</h2>
      </template>

      <div class="py-4">
        <draggable
          v-if="categoryDataBlock.fieldsOrder.length"
          v-model="categoryDataBlock.fieldsOrder"
          item-key="meta.uuid"
          handle=".drag-slides-handle"
          class="rounded"
          :filter="'.no-drag'"
        >
          <template #item="{ element: elem, index }: { element: CategoryDataFieldKey; index: number }">
            <div :key="elem" class="flex items-center justify-between drag-slides-handle cursor-move">
              <div class="flex items-center gap-3">
                <button
                  class="drag-slides-handle top-2 left-2 z-50 cursor-grab p-2 hover:bg-gray-100 rounded-full"
                  :aria-label="getEditorTranslation('drag-reorder-aria')"
                  :data-testid="`actions-drag-slide-handle-${index}`"
                >
                  <NuxtImg width="18" height="18" :src="dragIcon" />
                </button>

                <span>{{ fieldLabels[elem] }}</span>
              </div>
              <SfSwitch
                v-model="categoryDataBlock.fields[elem]"
                :disabled="categoryDataBlock.fieldsDisabled?.includes(elem)"
                :data-testid="`item-grid-field-${elem}`"
              />
            </div>
          </template>
        </draggable>
      </div>

      <div class="py-2">
        <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
        <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowUpward /></span>
            <input
              v-model.number="categoryDataBlock.layout.paddingTop"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-top"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowDownward /></span>
            <input
              v-model.number="categoryDataBlock.layout.paddingBottom"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-bottom"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowBack /></span>
            <input
              v-model.number="categoryDataBlock.layout.paddingLeft"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-left"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
            <span><SfIconArrowForward /></span>
            <input
              v-model.number="categoryDataBlock.layout.paddingRight"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-right"
            />
          </div>
        </div>
        <div class="px-4 py-3">
          <span class="typography-text-xs text-neutral-700">
            {{ getEditorTranslation('spacing-around') }}
          </span>
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import type { CategoryDataContent, CategoryDataFieldKey } from './types';
import {
  SfIconArrowBack,
  SfIconArrowDownward,
  SfIconArrowForward,
  SfIconArrowUpward,
  SfSwitch,
} from '@storefront-ui/vue';
import dragIcon from 'assets/icons/paths/drag.svg';
import draggable from 'vuedraggable/src/vuedraggable';

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const textOpen = ref(true);

const categoryDataBlock = computed(
  () => findOrDeleteBlockByUuid(data.value, blockUuid.value)?.content as CategoryDataContent,
);

const fieldLabels: Record<CategoryDataFieldKey, string> = {
  name: getEditorTranslation('category-name'),
  description1: getEditorTranslation('category-description-1'),
  description2: getEditorTranslation('category-description-2'),
  shortDescription: getEditorTranslation('short-description'),
};
</script>

<i18n lang="json">
{
  "en": {
    "item-card-label": "Category text",
    "category-placeholder": "Category name",
    "category-name": "Category name",
    "category-description-1": "Category description 1",
    "category-description-2": "Category description 2",
    "short-description": "Short description",
    "drag-reorder-aria": "Drag to reorder",
    "padding-label": "Padding",
    "spacing-around": "Spacing around the text elements"
  },
  "de": {
    "item-card-label": "Category text",
    "category-placeholder": "Category name",
    "category-name": "Category name",
    "category-description-1": "Category description 1",
    "category-description-2": "Category description 2",
    "short-description": "Short description",
    "drag-reorder-aria": "Drag to reorder",
    "padding-label": "Padding",
    "spacing-around": "Spacing around the text elements"
  }
}
</i18n>
