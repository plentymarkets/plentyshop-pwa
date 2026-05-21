<template>
  <div class="sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
    <UiAccordionItem
      v-model="textSettings"
      data-testid="open-layout-settings"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('layout-settings') }}</h2>
      </template>

      <div data-testid="image-text-form">
        <div v-if="isTwoColumnMultigrid" class="py-4">
          <UiFormLabel>{{ getEditorTranslation('column-size') }}</UiFormLabel>
          <ColumnWidthInput
            :multi-grid-structure="multiGridStructure"
            @update:column-widths="multiGridStructure.configuration.columnWidths = $event"
          />
        </div>

        <div v-if="multiGridStructure.configuration.layout" class="py-2">
          <UiFormLabel>{{ getEditorTranslation('margin-label') }}</UiFormLabel>
          <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowUpward /></span>
              <input
                v-model.number="multiGridStructure.configuration.layout.marginTop"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="margin-top"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowDownward /></span>
              <input
                v-model.number="multiGridStructure.configuration.layout.marginBottom"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="margin-bottom"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowBack /></span>
              <input
                v-model.number="multiGridStructure.configuration.layout.marginLeft"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="margin-left"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
              <span><SfIconArrowForward /></span>
              <input
                v-model.number="multiGridStructure.configuration.layout.marginRight"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="margin-right"
              />
            </div>
          </div>
        </div>

        <div v-if="multiGridStructure.configuration.layout" class="py-2">
          <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
          <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowUpward /></span>
              <input
                v-model.number="multiGridStructure.configuration.layout.paddingTop"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-top"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowDownward /></span>
              <input
                v-model.number="multiGridStructure.configuration.layout.paddingBottom"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-bottom"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowBack /></span>
              <input
                v-model.number="multiGridStructure.configuration.layout.paddingLeft"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-left"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
              <span><SfIconArrowForward /></span>
              <input
                v-model.number="multiGridStructure.configuration.layout.paddingRight"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-right"
              />
            </div>
          </div>
        </div>

        <div v-if="multiGridStructure.configuration.layout" class="py-2">
          <UiFormLabel>{{ getEditorTranslation('gap-label') }}</UiFormLabel>
          <div class="border-b py-1 flex gap-2">
            <button
              v-for="gapOption in gapOptions"
              :key="gapOption"
              type="button"
              data-testid="gap-btn"
              :class="[
                gapBtnClasses,
                { 'bg-editor-button text-white': gapOption === multiGridStructure.configuration.layout.gap },
              ]"
              @click="multiGridStructure.configuration.layout.gap = gapOption"
            >
              {{ getEditorTranslation('gap-size-' + gapOption.toLowerCase()) }}
            </button>
          </div>
          <div class="mt-2 text-xs text-neutral-700">
            {{ getEditorTranslation('spacing-between') }} {{ getGapPx(multiGridStructure.configuration.layout.gap) }}px
          </div>
        </div>

        <div v-if="multiGridStructure.configuration.layout" class="py-2 mt-2">
          <UiFormLabel>{{ getEditorTranslation('mobile-columns') }}</UiFormLabel>
          <div class="border-b py-1 flex gap-2">
            <button
              type="button"
              :class="[
                gapBtnClasses,
                { 'bg-editor-button text-white': multiGridStructure.configuration.layout.mobileCols === 1 },
              ]"
              @click="multiGridStructure.configuration.layout.mobileCols = 1"
            >
              1
            </button>
            <button
              type="button"
              :class="[
                gapBtnClasses,
                { 'bg-editor-button text-white': multiGridStructure.configuration.layout.mobileCols === 2 },
              ]"
              @click="multiGridStructure.configuration.layout.mobileCols = 2"
            >
              2
            </button>
          </div>
        </div>

      </div>
      <div v-if="multiGridStructure.configuration.columnWidths?.length" class="py-4">
        <UiFormLabel>{{ getEditorTranslation('sticky-columns') }}</UiFormLabel>

        <div class="grid grid-cols-3 gap-2 mt-2">
          <button
            v-for="i in numColumns"
            :key="`sticky-col-${i}`"
            type="button"
            class="px-3 py-2 rounded-md border text-sm"
            :class="
              isSticky(i - 1)
                ? 'border-neutral-900 ring-2 ring-neutral-900 bg-neutral-50'
                : 'border-neutral-300 hover:border-neutral-400'
            "
            @click="toggleSticky(i - 1)"
          >
            {{ getEditorTranslation('column') }} {{ i }}
          </button>
        </div>
      </div>
      <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="blockUuid" />
    </UiAccordionItem>

    <UiAccordionItem
      v-model="layoutBackground"
      data-testid="open-layout-background-settings"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('layout-background') }}</h2>
      </template>

      <div v-if="multiGridStructure.configuration.layout" class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('background-color-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput
            v-model="multiGridStructure.configuration.layout.backgroundColor"
            type="text"
            data-testid="input-background-color"
          >
            <template #suffix>
              <label
                for="background-color"
                :style="{ backgroundColor: multiGridStructure.configuration.layout.backgroundColor || '#ffffff' }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input
                  id="background-color"
                  v-model="multiGridStructure.configuration.layout.backgroundColor"
                  data-testid="color-input-background"
                  type="color"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div v-if="multiGridStructure.configuration.layout" class="py-2 flex items-center justify-between gap-3">
        <UiFormLabel for="full-width-background-toggle" class="m-0">
          {{ getEditorTranslation('full-width-background-label') }}
        </UiFormLabel>
        <SfSwitch
          id="full-width-background-toggle"
          v-model="multiGridStructure.configuration.layout.fullWidthBackground"
          data-testid="full-width-background-toggle"
          class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
        />
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
  SfSwitch,
} from '@storefront-ui/vue';
import ColumnWidthInput from '~/components/editor/ColumnWidthInput.vue';

const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();
const { getSetting: getBlockSize } = useSiteSettings('blockSize');
const blockSize = computed(() => getBlockSize());

const isTwoColumnMultigrid = computed(() => {
  return multiGridStructure.value.configuration?.columnWidths?.length === 2;
});

const defaultMarginBottom = computed(() => {
  switch (blockSize.value) {
    case 's':
      return 30;
    case 'm':
      return 40;
    case 'l':
      return 50;
    case 'xl':
      return 60;
    default:
      return 0;
  }
});

const multiGridStructure = computed(() => {
  const block = (findOrDeleteBlockByUuid(data.value, blockUuid.value) as ColumnBlock) || { content: [] };
  
  if (!block.configuration.layout) {
    block.configuration.layout = {
      marginTop: 0,
      marginBottom: defaultMarginBottom.value,
      marginLeft: 40,
      marginRight: 40,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      backgroundColor: '#ffffff',
      fullWidthBackground: false,
      gap: 'M',
      mobileCols: 1 // NEW: Default to 1 column on mobile
    };
  } else {
    // Safety checks
    if (!block.configuration.layout.backgroundColor) block.configuration.layout.backgroundColor = '#ffffff';
    if (block.configuration.layout.fullWidthBackground === undefined) {
      block.configuration.layout.fullWidthBackground = false;
    }
    if (!block.configuration.layout.gap) block.configuration.layout.gap = 'M';
    if (block.configuration.layout.mobileCols === undefined) block.configuration.layout.mobileCols = 1; // Default fallback
    if (block.configuration.layout.marginBottom === undefined || block.configuration.layout.marginBottom === null) {
      block.configuration.layout.marginBottom = defaultMarginBottom.value;
    }
    if (block.configuration.layout.paddingTop === undefined) block.configuration.layout.paddingTop = 0;
    if (block.configuration.layout.paddingBottom === undefined) block.configuration.layout.paddingBottom = 0;
    if (block.configuration.layout.paddingLeft === undefined) block.configuration.layout.paddingLeft = 0;
    if (block.configuration.layout.paddingRight === undefined) block.configuration.layout.paddingRight = 0;
  }
  return block;
});

const { isFullWidth } = useFullWidthToggleForConfig(computed(() => multiGridStructure.value.configuration));

const gapOptions = ['None', 'S', 'M', 'L', 'XL'];
const gapBtnClasses =
  'py-2 leading-6 px-4 gap-2 !hover:bg-gray-100 inline-flex items-center justify-center font-medium text-base focus-visible:outline focus-visible:outline-offset rounded-md disabled:text-disabled-500 disabled:bg-disabled-300 disabled:shadow-none disabled:ring-0 disabled:cursor-not-allowed border border-gray-200';
type GapSize = 'None' | 'S' | 'M' | 'L' | 'XL';
const gapPxMap: Record<GapSize, number> = {
  None: 0,
  S: 4,
  M: 8,
  L: 12,
  XL: 20,
};

const getGapPx = (gap: string | undefined): number => {
  const validGap = gap === 'None' || gap === 'S' || gap === 'M' || gap === 'L' || gap === 'XL' ? gap : 'M';
  return gapPxMap[validGap as GapSize];
};

if (!multiGridStructure.value.configuration?.sticky) multiGridStructure.value.configuration.sticky = [];

const numColumns = computed(() => Math.max(0, multiGridStructure.value.configuration.columnWidths?.length || 0));

const isSticky = (columnIndex: number) => {
  const sticky = multiGridStructure.value.configuration?.sticky || [];
  return sticky.includes(columnIndex);
};

const toggleSticky = (columnIndex: number) => {
  const configuration = multiGridStructure.value.configuration;

  if (!Array.isArray(configuration?.sticky)) {
    configuration.sticky = [];
  }

  const position = configuration?.sticky.indexOf(columnIndex);

  if (position === -1) {
    configuration?.sticky.push(columnIndex);
  } else {
    configuration?.sticky.splice(position, 1);
  }
};

const textSettings = ref(false);
const layoutBackground = ref(false);
</script>

<i18n lang="json">
{
  "en": {
    "layout-settings": "Layout Settings",
    "margin-label": "Margin (px)",
    "padding-label": "Padding (px)",
    "background-color-label": "Background Color",
    "gap-label": "Gap",
    "gap-size-none": "None",
    "gap-size-s": "S",
    "gap-size-m": "M",
    "gap-size-l": "L",
    "gap-size-xl": "XL",
    "spacing-around": "Spacing around",
    "spacing-between": "Spacing between Blocks:",
    "layout-background": "Layout Background",
    "full-width-background-label": "Stretch background to full width",
    "sticky-columns": "Sticky columns",
    "column-size": "Column Size",
    "column": "Column",
    "mobile-columns": "Mobile Columns"
  },
  "de": {
    "layout-settings": "Layout Settings",
    "margin-label": "Margin (px)",
    "padding-label": "Padding (px)",
    "background-color-label": "Background Color",
    "gap-label": "Gap",
    "gap-size-none": "None",
    "gap-size-s": "S",
    "gap-size-m": "M",
    "gap-size-l": "L",
    "gap-size-xl": "XL",
    "spacing-around": "Spacing around",
    "spacing-between": "Spacing between Blocks:",
    "layout-background": "Layout Background",
    "full-width-background-label": "Hintergrund auf volle Breite strecken",
    "sticky-columns": "Sticky columns",
    "column-size": "Column Size",
    "column": "Column",
    "mobile-columns": "Mobile Spalten"
  }
}
</i18n>