<template>
  <MultiGridFormLegacy v-if="!enableMultiGridEditor" :uuid="uuid" />
  <div v-else class="sticky h-[calc(100vh-52px)] overflow-y-auto">
    <button
      type="button"
      class="w-full flex items-center gap-1.5 px-3.5 py-2 cursor-pointer bg-editor-surface border-t border-b border-editor-border select-none"
      :aria-expanded="gridLayoutOpen"
      aria-controls="multigrid-panel-grid-layout"
      @click="gridLayoutOpen = !gridLayoutOpen"
    >
      <span class="flex-1 text-2xs font-bold text-editor-text-subtle tracking-wider uppercase">
        {{ getEditorTranslation('grid-layout') }}
      </span>
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        aria-hidden="true"
        class="text-editor-text-placeholder transition-transform duration-200"
        :class="gridLayoutOpen ? 'rotate-0' : '-rotate-90'"
      >
        <path
          d="M1 1l4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div v-if="gridLayoutOpen" id="multigrid-panel-grid-layout" class="px-3.5 py-3">
      <div v-if="allEmpty" class="mb-3.5">
        <div class="text-3xs text-editor-text-ghost font-bold tracking-[0.07em] mb-2 uppercase">
          {{ getEditorTranslation('layout-preset') }}
        </div>
        <div class="grid grid-cols-3 gap-1.5">
          <button
            v-for="preset in LAYOUT_PRESETS"
            :key="preset.label"
            class="px-1 pt-2 pb-1.5 rounded-lg border border-editor-border bg-white cursor-pointer flex flex-col items-center gap-1.5 hover:bg-editor-toc-hover hover:border-editor-accent-border-hover transition-all duration-150"
            @click="applyPreset(preset.columnWidths)"
          >
            <div class="flex gap-0.5 w-full h-[9px]">
              <div
                v-for="(span, i) in preset.columnWidths"
                :key="i"
                class="h-full rounded-sm bg-editor-accent/[18%] border border-dashed border-editor-accent/50"
                :style="{ flex: span }"
              />
            </div>
            <span class="text-3xs text-editor-text-subtle">{{ preset.label }}</span>
          </button>
        </div>
      </div>

      <MultiGridEditor
        :column-widths="multiGridStructure.configuration.columnWidths"
        :blocks="(multiGridStructure.content as Block[]) ?? []"
        @update:column-widths="handleColumnWidthsUpdate"
        @click-add-row="handleClickAddRow"
        @add-free-column="handleAddFreeColumn"
      />

      <div v-if="multiGridStructure.configuration.layout" class="mt-3.5 pt-3 border-t border-editor-surface-muted">
        <div class="flex items-center gap-2">
          <span class="flex-1 text-xs text-editor-text-subtle">{{ getEditorTranslation('gap-label') }}</span>
          <div class="flex gap-1">
            <button
              v-for="gapOption in gapOptions"
              :key="gapOption"
              type="button"
              data-testid="gap-btn"
              class="w-7 h-6 rounded-md text-3xs cursor-pointer transition-colors"
              :class="
                gapOption === multiGridStructure.configuration.layout.gap
                  ? 'border border-editor-accent bg-editor-accent/[8%] text-editor-accent font-bold'
                  : 'border border-editor-canvas-border bg-white text-editor-text-faint'
              "
              @click="multiGridStructure.configuration.layout.gap = gapOption"
            >
              {{ gapOption }}
            </button>
          </div>
        </div>
        <div class="mt-1.5 text-2xs text-editor-text-placeholder">
          {{ getEditorTranslation('spacing-between') }} {{ getGapPx(multiGridStructure.configuration.layout.gap) }}px
        </div>
      </div>
    </div>

    <button
      type="button"
      class="w-full flex items-center gap-1.5 px-3.5 py-2 cursor-pointer bg-editor-surface border-t border-b border-editor-border select-none"
      :aria-expanded="layoutOpen"
      aria-controls="multigrid-panel-layout"
      @click="layoutOpen = !layoutOpen"
    >
      <span class="flex-1 text-2xs font-bold text-editor-text-subtle tracking-wider uppercase">
        {{ getEditorTranslation('layout') }}
      </span>
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        aria-hidden="true"
        class="text-editor-text-placeholder transition-transform duration-200"
        :class="layoutOpen ? 'rotate-0' : '-rotate-90'"
      >
        <path
          d="M1 1l4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div v-if="layoutOpen" id="multigrid-panel-layout" class="px-3.5 py-3 flex flex-col gap-3">
      <div v-if="multiGridStructure.configuration.layout">
        <div class="text-2xs text-editor-text-faint mb-1.5">{{ getEditorTranslation('margin-label') }}</div>
        <div class="grid grid-cols-2 gap-px rounded-md overflow-hidden border border-gray-300">
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowUpward /></span>
            <input
              v-model.number="multiGridStructure.configuration.layout.marginTop"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="margin-top"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
            <span><SfIconArrowDownward /></span>
            <input
              v-model.number="multiGridStructure.configuration.layout.marginBottom"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="margin-bottom"
            />
          </div>
        </div>
      </div>

      <div v-if="multiGridStructure.configuration.columnWidths?.length">
        <div class="text-2xs text-editor-text-faint mb-1.5">{{ getEditorTranslation('sticky-columns') }}</div>
        <div class="grid grid-cols-3 gap-2">
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

      <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="resolvedUuid" />
    </div>

    <button
      type="button"
      class="w-full flex items-center gap-1.5 px-3.5 py-2 cursor-pointer bg-editor-surface border-t border-b border-editor-border select-none"
      :aria-expanded="backgroundOpen"
      aria-controls="multigrid-panel-background"
      @click="backgroundOpen = !backgroundOpen"
    >
      <span class="flex-1 text-2xs font-bold text-editor-text-subtle tracking-wider uppercase">
        {{ getEditorTranslation('layout-background') }}
      </span>
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        aria-hidden="true"
        class="text-editor-text-placeholder transition-transform duration-200"
        :class="backgroundOpen ? 'rotate-0' : '-rotate-90'"
      >
        <path
          d="M1 1l4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div v-if="backgroundOpen" id="multigrid-panel-background" class="px-3.5 py-3">
      <div v-if="multiGridStructure.configuration.layout">
        <div class="text-2xs text-editor-text-faint mb-1.5">{{ getEditorTranslation('background-color-label') }}</div>
        <EditorColorPicker v-model="multiGridStructure.configuration.layout.backgroundColor" class="w-full">
          <template #trigger="{ color, toggle }">
            <label>
              <SfInput
                v-model="multiGridStructure.configuration.layout.backgroundColor"
                type="text"
                data-testid="input-background-color"
              >
                <template #suffix>
                  <button
                    type="button"
                    class="border border-editor-input-border rounded-lg cursor-pointer w-10 h-8"
                    :style="{ backgroundColor: color }"
                    @mousedown.stop
                    @click.stop="toggle"
                  />
                </template>
              </SfInput>
            </label>
          </template>
        </EditorColorPicker>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ColumnBlock } from '~/components/blocks/structure/MultiGrid/types';
import type { Block } from '@plentymarkets/shop-api';
import { SfInput, SfIconArrowUpward, SfIconArrowDownward } from '@storefront-ui/vue';
import MultiGridEditor from './MultiGridEditor.vue';
import MultiGridFormLegacy from './MultiGridFormLegacy.vue';
import { LAYOUT_PRESETS } from '~/components/AddBlockPopover/types';

const enableMultiGridEditor = useRuntimeConfig().public.enableMultiGridEditor as boolean;

const props = defineProps<{ uuid?: string }>();

const { openAddBlockPopover } = useAddBlockPopover();
const { blockUuid } = useSiteConfiguration();
const resolvedUuid = computed(() => props.uuid || blockUuid.value);
const { allBlocks: data } = useBlocks();
const { findOrDeleteBlockByUuid } = useBlockManager();
const { getSetting: getBlockSize } = useSiteSettings('verticalBlockSize');
const blockSize = computed(() => getBlockSize());
const defaultMarginBottom = computed(() => getVerticalPixels(blockSize.value));

const multiGridStructure = computed(() => {
  const block = (findOrDeleteBlockByUuid(data.value, resolvedUuid.value) as ColumnBlock) || { content: [] };
  if (!block.configuration.layout) {
    block.configuration.layout = {
      marginTop: 0,
      marginBottom: defaultMarginBottom.value,
      backgroundColor: '#ffffff',
      gap: 'M',
    };
  } else {
    if (!block.configuration.layout.backgroundColor) block.configuration.layout.backgroundColor = '#ffffff';
    if (!block.configuration.layout.gap) block.configuration.layout.gap = 'M';
    if (block.configuration.layout.marginBottom === undefined || block.configuration.layout.marginBottom === null) {
      block.configuration.layout.marginBottom = defaultMarginBottom.value;
    }
  }
  return block;
});

const { isFullWidth } = useFullWidthToggleForConfig(computed(() => multiGridStructure.value.configuration));

const gapOptions = ['None', 'S', 'M', 'L', 'XL'];
type GapSize = 'None' | 'S' | 'M' | 'L' | 'XL';
const gapPxMap: Record<GapSize, number> = { None: 0, S: 4, M: 8, L: 12, XL: 20 };

const getGapPx = (gap: string | undefined): number => {
  const validGap = gap === 'None' || gap === 'S' || gap === 'M' || gap === 'L' || gap === 'XL' ? gap : 'M';
  return gapPxMap[validGap as GapSize];
};

if (!multiGridStructure.value.configuration?.sticky) multiGridStructure.value.configuration.sticky = [];

const numColumns = computed(() => Math.max(0, multiGridStructure.value.configuration.columnWidths?.length || 0));

const isSticky = (columnIndex: number) => {
  return (multiGridStructure.value.configuration?.sticky || []).includes(columnIndex);
};

const toggleSticky = (columnIndex: number) => {
  const configuration = multiGridStructure.value.configuration;
  if (!Array.isArray(configuration?.sticky)) configuration.sticky = [];
  const position = configuration.sticky.indexOf(columnIndex);
  if (position === -1) {
    configuration.sticky.push(columnIndex);
  } else {
    configuration.sticky.splice(position, 1);
  }
};

const allEmpty = computed(() => {
  const blocks = multiGridStructure.value.content as Block[] | undefined;
  if (!blocks || blocks.length === 0) return true;
  return blocks.every((block) => block.name === 'EmptyGridBlock');
});

const applyPreset = (spans: readonly number[]) => {
  const block = multiGridStructure.value as ColumnBlock;
  block.configuration.columnWidths = [...spans];
  block.content = spans.map((_, columnIndex) => createEmptyGridBlock(columnIndex)) as unknown as Block[];
};

const handleColumnWidthsUpdate = (widths: number[]) => {
  multiGridStructure.value.configuration.columnWidths = widths;
};

const addRowSpans = (spans: readonly number[]) => {
  const block = multiGridStructure.value as ColumnBlock;
  const currentLength = block.configuration.columnWidths.length;
  block.configuration.columnWidths.push(...spans);
  if (!block.content) block.content = [];
  block.content.push(
    ...(spans.map((_, columnIndex) => createEmptyGridBlock(currentLength + columnIndex)) as unknown as Block[]),
  );
};

const handleClickAddRow = (anchorEl: HTMLElement) => {
  const block = multiGridStructure.value as ColumnBlock;
  const newSlot = block.configuration.columnWidths.length;
  const newBlock = createEmptyGridBlock(newSlot);

  const cleanupTempBlock = () => {
    const gridBlock = multiGridStructure.value as ColumnBlock;
    const blocks = gridBlock.content as Block[];
    const index = blocks.findIndex(
      (block) => block.meta.uuid === newBlock.meta.uuid && block.name === 'EmptyGridBlock',
    );
    if (index !== -1) {
      blocks.splice(index, 1);
      gridBlock.configuration.columnWidths.splice(newSlot, 1);
    }
  };

  openAddBlockPopover({
    anchorEl,
    targetUuid: newBlock.meta.uuid,
    position: 'inside',
    onCancel: cleanupTempBlock,
    onPresetPick: (spans) => {
      cleanupTempBlock();
      addRowSpans(spans);
    },
  });

  block.configuration.columnWidths.push(12);
  if (!block.content) block.content = [];
  (block.content as Block[]).push(newBlock as unknown as Block);
};

const handleAddFreeColumn = (span: number, anchorEl: HTMLElement) => {
  const block = multiGridStructure.value as ColumnBlock;
  const newSlot = block.configuration.columnWidths.length;
  const newBlock = createEmptyGridBlock(newSlot);
  openAddBlockPopover({
    anchorEl,
    targetUuid: newBlock.meta.uuid,
    position: 'inside',
    onCancel: () => {
      const gridBlock = multiGridStructure.value as ColumnBlock;
      const blocks = gridBlock.content as Block[];
      const index = blocks.findIndex(
        (block) => block.meta.uuid === newBlock.meta.uuid && block.name === 'EmptyGridBlock',
      );
      if (index !== -1) {
        blocks.splice(index, 1);
        gridBlock.configuration.columnWidths.splice(newSlot, 1);
      }
    },
  });
  block.configuration.columnWidths.push(span);
  if (!block.content) block.content = [];
  (block.content as Block[]).push(newBlock as unknown as Block);
};

const gridLayoutOpen = ref(true);
const layoutOpen = ref(true);
const backgroundOpen = ref(false);
</script>

<i18n lang="json">
{
  "en": {
    "grid-layout": "Grid Layout",
    "layout-preset": "Layout Preset",
    "gap-label": "Column Gap",
    "spacing-between": "Spacing between blocks:",
    "layout": "Layout",
    "margin-label": "Margin (px)",
    "sticky-columns": "Sticky columns",
    "column": "Column",
    "layout-background": "Background",
    "background-color-label": "Background Color"
  },
  "de": {
    "grid-layout": "Grid Layout",
    "layout-preset": "Layout Preset",
    "gap-label": "Column Gap",
    "spacing-between": "Spacing between blocks:",
    "layout": "Layout",
    "margin-label": "Margin (px)",
    "sticky-columns": "Sticky columns",
    "column": "Column",
    "layout-background": "Background",
    "background-color-label": "Background Color"
  }
}
</i18n>
