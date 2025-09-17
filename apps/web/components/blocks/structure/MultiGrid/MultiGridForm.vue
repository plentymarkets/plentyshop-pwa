<template>
  <div class="sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
    <UiAccordionItem
      v-model="textSettings"
      data-testid="open-text-settings"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('layout-settings') }}</h2>
      </template>

      <div data-testid="image-text-form">
        <div v-if="isTwoColumnMultigrid" class="py-2">
          <UiFormLabel>Column Size</UiFormLabel>
          <div class="relative w-full flex flex-col items-center">
            <input
              v-model.number="columnCount"
              type="range"
              min="1"
              max="11"
              step="1"
            />

            <!-- Hidden native range for accessibility and keyboard support -->
            <input
              v-model.number="columnCount"
              type="range"
              min="1"
              max="11"
              step="1"
              class="sr-only"
              @input="onInput"
            />

            <!-- Merged blank squares for each step -->
            <div
              ref="squaresContainer"
              class="flex w-full mt-2 mb-4 rounded overflow-hidden border border-gray-300 relative"
              style="height: 24px;"
              @mousedown="handlePointerDown"
            >
              <div
                v-for="step in steps"
                :key="step"
                class="flex-1 h-full cursor-pointer border-r last:border-r-0 border-gray-300 bg-white"
                @click="setColumnCount(step)"
              />
            </div>
            <!-- Arrow marker under squares -->
            <div
              class="absolute"
              :style="arrowStyle"
              style="top: 40px; transition: left 0.2s;"
            >
              <span class="text-editor-button text-lg cursor-pointer select-none" @mousedown="handlePointerDown">&#9650;</span>
            </div>
          </div>
        </div>

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

        <div v-if="multiGridStructure.layout" class="py-2">
          <UiFormLabel>{{ getEditorTranslation('gap-label') }}</UiFormLabel>
          <div class="border-b py-1 flex gap-2">
            <button
              v-for="gapOption in gapOptions"
              :key="gapOption"
              type="button"
              data-testid="gap-btn"
              :class="[gapBtnClasses, { 'bg-editor-button text-white': gapOption === multiGridStructure.layout.gap }]"
              @click="multiGridStructure.layout.gap = gapOption"
            >
              {{ getEditorTranslation('gap-size-' + gapOption.toLowerCase()) }}
            </button>
          </div>
          <div class="mt-2 text-xs text-neutral-700">
            {{ getEditorTranslation('spacing-between') }} {{ getGapPx(multiGridStructure.layout.gap) }}px
          </div>
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
        <h2>{{ getEditorTranslation('layout-background') }}</h2>
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
const { getSetting: getBlockSize } = useSiteSettings('blockSize');
const blockSize = computed(() => getBlockSize());

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

const steps = Array.from({ length: 11 }, (_, i) => i + 1);
const squaresContainer = ref<HTMLElement | null>(null);
const isDragging = ref(false);

const setColumnCount = (step: number) => {
  columnCount.value = step;
};

const onInput = (e: Event) => {
  columnCount.value = Number((e.target as HTMLInputElement).value);
};

const handlePointerDown = (e: MouseEvent) => {
  isDragging.value = true;
  updateColumnCountFromEvent(e);
  window.addEventListener('mousemove', handlePointerMove);
  window.addEventListener('mouseup', handlePointerUp);
};

const handlePointerMove = (e: MouseEvent) => {
  if (isDragging.value) {
    updateColumnCountFromEvent(e);
  }
};

const handlePointerUp = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', handlePointerMove);
  window.removeEventListener('mouseup', handlePointerUp);
};

const updateColumnCountFromEvent = (e: MouseEvent) => {
  const container = squaresContainer.value;
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const stepWidth = rect.width / steps.length;
  let step = Math.ceil(x / stepWidth);
  step = Math.max(1, Math.min(step, steps.length));
  columnCount.value = step;
};

// Calculate arrow position under the squares
const arrowStyle = computed(() => {
  const container = squaresContainer.value;
  if (!container) return { left: '0px' };
  const width = container.offsetWidth;
  const stepWidth = width / steps.length;
  // Center arrow under the selected square
  const left = stepWidth * (columnCount.value - 0.5) - 10; // 10px offset for arrow width
  return { left: `${left}px` };
});

onMounted(() => {
  // Force update arrow position after mount
  setTimeout(() => {}, 0);
});

const multiGridStructure = computed(() => {
  const block = (findOrDeleteBlockByUuid(data.value, blockUuid.value) as ColumnBlock) || { content: [] };
  if (!block.layout) {
    block.layout = {
      marginTop: 0,
      marginBottom: defaultMarginBottom.value,
      marginLeft: 40,
      marginRight: 40,
      backgroundColor: '#ffffff',
      gap: 'M',
    };
  } else {
    if (!block.layout.backgroundColor) block.layout.backgroundColor = '#ffffff';
    if (!block.layout.gap) block.layout.gap = 'M';
    if (block.layout.marginBottom === undefined || block.layout.marginBottom === null) {
      block.layout.marginBottom = defaultMarginBottom.value;
    }
  }
  return block;
});

const isTwoColumnMultigrid = computed(() => {
  return multiGridStructure.value.configuration?.columnWidths?.length === 2;
});

const columnCount = computed({
  get: () => multiGridStructure.value.configuration?.columnWidths?.[0] || 6,
  set: (val: number) => {
    const columns = multiGridStructure.value.configuration.columnWidths.length;
    const firstColWidth = Math.max(1, Math.min(val, 11));
    if (columns === 2) {
      multiGridStructure.value.configuration.columnWidths = [firstColWidth, 12 - firstColWidth];
    }
  }
});

const gapOptions = ['None', 'S', 'M', 'L', 'XL'];
const gapBtnClasses =
  'py-2 leading-6 px-4 gap-2 !hover:bg-gray-100 inline-flex items-center justify-center font-medium text-base focus-visible:outline focus-visible:outline-offset rounded-md disabled:text-disabled-500 disabled:bg-disabled-300 disabled:shadow-none disabled:ring-0 disabled:cursor-not-allowed';
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

const textSettings = ref(false);
const layoutBackground = ref(false);
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}
</style>

<i18n lang="json">
{
  "en": {
    "layout-settings": "Layout Settings",
    "margin-label": "Margin (px)",
    "background-color-label": "Background Color",
    "gap-label": "Gap",
    "gap-size-none": "None",
    "gap-size-s": "S",
    "gap-size-m": "M",
    "gap-size-l": "L",
    "gap-size-xl": "XL",
    "spacing-around": "Spacing around",
    "spacing-between": "Spacing between Blocks:",
    "layout-background": "Layout Background"
  },
  "de": {
    "layout-settings": "Layout Einstellungen",
    "margin-label": "Margin (px)",
    "background-color-label": "Hintergrundfarbe",
    "gap-label": "Abstand",
    "gap-size-none": "Keiner",
    "gap-size-s": "S",
    "gap-size-m": "M",
    "gap-size-l": "L",
    "gap-size-xl": "XL",
    "spacing-around": "Abstand um",
    "spacing-between": "Abstand zwischen Blöcken:",
    "layout-background": "Layout Hintergrund"
  }
}
</i18n>
