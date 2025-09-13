<template>
  <div class="sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
    <UiAccordionItem
      v-model="textSettings"
      data-testid="open-text-settings"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('text-group-label') }}</h2>
      </template>

      <div data-testid="image-text-form">
        <div v-if="multiGridStructure.layout" class="py-2">
          <UiFormLabel>{{ getEditorTranslation('margin-label') }}</UiFormLabel>
          <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowUpward /></span>
              <input
                v-model.number="multiGridStructure.layout.marginTop"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="margin-top"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowDownward /></span>
              <input
                v-model.number="multiGridStructure.layout.marginBottom"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="margin-bottom"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowBack /></span>
              <input
                v-model.number="multiGridStructure.layout.marginLeft"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="margin-left"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
              <span><SfIconArrowForward /></span>
              <input
                v-model.number="multiGridStructure.layout.marginRight"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="margin-right"
              />
            </div>
          </div>
        </div>

        <div class="py-2">
          <UiFormLabel>{{ getEditorTranslation('gap-label') }}</UiFormLabel>
          <div class="border-b py-1">
            <button
              v-for="gapOption in gapOptions"
              :key="gapOption"
              type="button"
              data-testid="gap-btn"
              :class="[gapBtnClasses, { 'bg-editor-button text-white': gapOption === gapValue }]"
              @click="gapValue = gapOption"
            >
              {{ getEditorTranslation('gap-size-' + gapOption.toLowerCase()) }}
            </button>
          </div>
        </div>

        <div class="px-4 py-3">
          <span class="typography-text-xs text-neutral-700">
            {{ getEditorTranslation('spacing-around') }}
          </span>
        </div>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="layoutBackground"
      data-testid="open-text-settings"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Layout Background</h2>
      </template>

      <div v-if="multiGridStructure.layout" class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('background-color-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="multiGridStructure.layout.backgroundColor" type="text" data-testid="input-background-color">
            <template #suffix>
              <label
                for="background-color"
                :style="{ backgroundColor: multiGridStructure.layout.backgroundColor || '#ffffff' }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input
                  id="background-color"
                  v-model="multiGridStructure.layout.backgroundColor"
                  data-testid="color-input-background"
                  type="color"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import type { ColumnBlock } from '~/components/blocks/structure/MultiGrid/types';
import {
  SfInput,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconArrowBack,
  SfIconArrowForward,
} from '@storefront-ui/vue';
const { blockUuid } = useSiteConfiguration();
const { data } = useCategoryTemplate();
const { findOrDeleteBlockByUuid } = useBlockManager();

const multiGridStructure = computed(() => {
  const block = (findOrDeleteBlockByUuid(data.value, blockUuid.value) as ColumnBlock) || { content: [] };
  if (!block.layout) {
    block.layout = {
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      backgroundColor: '#ffffff',
    };
  } else if (!block.layout.backgroundColor) {
    block.layout.backgroundColor = '#ffffff';
  }
  return block;
});

const gapOptions = ['None', 'M', 'L', 'XL'];
const gapBtnClasses =
  'py-2 leading-6 px-4 gap-2 !hover:bg-gray-100 uppercase inline-flex items-center justify-center font-medium text-base focus-visible:outline focus-visible:outline-offset rounded-md disabled:text-disabled-500 disabled:bg-disabled-300 disabled:shadow-none disabled:ring-0 disabled:cursor-not-allowed';
const gapValue = ref('None');

const textSettings = ref(false);
const layoutBackground = ref(false);
</script>

<i18n lang="json">
{
  "en": {
    "margin-label": "Margin",
    "gap-label": "Gap between columns",
    "gap-size-none": "None",
    "gap-size-m": "M",
    "gap-size-l": "L",
    "gap-size-xl": "XL",
    "spacing-around": "Spacing around"
  },
  "de": {
    "margin-label": "Margin",
    "gap-label": "Abstand zwischen Spalten",
    "gap-size-none": "Keiner",
    "gap-size-m": "M",
    "gap-size-l": "L",
    "gap-size-xl": "XL",
    "spacing-around": "Abstand um"
  }
}
</i18n>
