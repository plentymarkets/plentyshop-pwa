<template>
  <MultiGridFormLegacy v-if="!enableMultiGridEditor" :uuid="uuid" />
  <template v-else>
    <div v-if="editingBlock" class="sticky h-[calc(100vh-52px)] overflow-y-auto">
      <component :is="blockForm" :uuid="editingBlock.meta.uuid" />
    </div>
    <div v-else class="sticky h-[calc(100vh-52px)] overflow-y-auto">
      <EditorGridElementsPanel
        v-model="elementsOpen"
        :uuid="resolvedUuid"
        :quick-add-options="multiGridQuickAddOptions"
        @edit-element="editElement"
        @insert-before="handleInsertBefore"
      />

      <EditorFormPanel v-model="gridLayoutOpen" :title="getEditorTranslation('grid-layout')">
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
          :column-widths="visibleGrid.columnWidths"
          :blocks="visibleGrid.blocks"
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
      </EditorFormPanel>

      <MultiGridLayoutPanel :uuid="resolvedUuid" />

      <EditorFormPanel v-model="backgroundOpen" :title="getEditorTranslation('layout-background')">
        <div v-if="multiGridStructure.configuration.layout">
          <div class="text-2xs text-editor-text-faint mb-1.5">{{ getEditorTranslation('background-color-label') }}</div>
          <EditorColorPicker v-model="multiGridStructure.configuration.layout.backgroundColor" class="w-full">
            <template #trigger="{ color, toggle }">
              <div>
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
              </div>
            </template>
          </EditorColorPicker>
        </div>
      </EditorFormPanel>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { ColumnBlock, GapSize } from '~/components/blocks/structure/MultiGrid/types';
import type { Block } from '@plentymarkets/shop-api';
import { SfInput } from '@storefront-ui/vue';
import MultiGridEditor from './MultiGridEditor.vue';
import MultiGridFormLegacy from './MultiGridFormLegacy.vue';
import MultiGridLayoutPanel from './MultiGridLayoutPanel.vue';
import { LAYOUT_PRESETS } from '~/components/AddBlockPopover/constants';
import { computeVisibleGrid } from '~/components/blocks/structure/MultiGrid/multiGridVisibility';
import { useMultiGridDeviceWidths } from '~/components/blocks/structure/MultiGrid/multiGridDeviceWidths';

const enableMultiGridEditor = useRuntimeConfig().public.enableMultiGridEditor as boolean;

const props = defineProps<{ uuid?: string }>();

const { openAddBlockPopover } = useAddBlockPopover();
const { blockUuid } = useSiteConfiguration();
const resolvedUuid = computed(() => props.uuid || blockUuid.value);
const { allBlocks } = useBlocks();
const { findOrDeleteBlockByUuid } = useBlockManager();
const { getSetting: getBlockSize } = useSiteSettings('verticalBlockSize');
const blockSize = computed(() => getBlockSize());
const defaultMarginBottom = computed(() => getVerticalPixels(blockSize.value));

const multiGridStructure = computed(() => {
  const block = (findOrDeleteBlockByUuid(allBlocks.value, resolvedUuid.value) as ColumnBlock) || { content: [] };
  if (block.configuration.layout) {
    if (!block.configuration.layout.backgroundColor) block.configuration.layout.backgroundColor = '#ffffff';
    if (!block.configuration.layout.gap) block.configuration.layout.gap = 'M';
    if (block.configuration.layout.marginBottom === undefined || block.configuration.layout.marginBottom === null) {
      block.configuration.layout.marginBottom = defaultMarginBottom.value;
    }
    if (block.configuration.layout.reverseOnMobile === undefined) block.configuration.layout.reverseOnMobile = false;
    if (block.configuration.layout.alignHeights === undefined) block.configuration.layout.alignHeights = true;
  } else {
    block.configuration.layout = {
      marginTop: 0,
      marginBottom: defaultMarginBottom.value,
      backgroundColor: '#ffffff',
      gap: 'M',
      reverseOnMobile: false,
      alignHeights: true,
    };
  }
  return block;
});

const { widths: gridColumnsWidth, setWidths: setGridColumnsWidth } = useMultiGridDeviceWidths(
  computed(() => multiGridStructure.value.configuration),
);

const visibleGrid = computed(() =>
  computeVisibleGrid((multiGridStructure.value.content as Block[]) ?? [], gridColumnsWidth.value),
);

const gapOptions = ['None', 'S', 'M', 'L', 'XL'];
const gapPxMap: Record<GapSize, number> = { None: 0, S: 4, M: 8, L: 12, XL: 20 };

const getGapPx = (gap: string | undefined): number => {
  const validGap = gap === 'None' || gap === 'S' || gap === 'M' || gap === 'L' || gap === 'XL' ? gap : 'M';
  return gapPxMap[validGap as GapSize];
};

if (!multiGridStructure.value.configuration?.sticky) multiGridStructure.value.configuration.sticky = [];

const allEmpty = computed(() => {
  const blocks = multiGridStructure.value.content as Block[] | undefined;
  if (!blocks || blocks.length === 0) return true;
  return blocks.every((block) => block.name === 'EmptyGridBlock');
});

const applyPreset = (spans: readonly number[]) => {
  const block = multiGridStructure.value as ColumnBlock;
  block.configuration.columnWidths = [...spans];
  delete block.configuration.columnWidthsTablet;
  delete block.configuration.columnWidthsMobile;
  block.content = spans.map((_, columnIndex) => createEmptyGridBlock(columnIndex)) as unknown as Block[];
};

const handleColumnWidthsUpdate = (filteredWidths: number[]) => {
  const updated = [...gridColumnsWidth.value];
  visibleGrid.value.filteredToOriginal.forEach((originalIndex, filteredIndex) => {
    const width = filteredWidths[filteredIndex];
    if (width !== undefined) updated[originalIndex] = width;
  });
  setGridColumnsWidth(updated);
};

const addRowSpans = (spans: readonly number[]) => {
  const block = multiGridStructure.value as ColumnBlock;
  const currentLength = block.configuration.columnWidths.length;
  block.configuration.columnWidths.push(...spans);
  if (block.configuration.columnWidthsTablet) block.configuration.columnWidthsTablet.push(...spans);
  if (block.configuration.columnWidthsMobile) block.configuration.columnWidthsMobile.push(...spans);
  if (!block.content) block.content = [];
  block.content.push(
    ...(spans.map((_, columnIndex) => createEmptyGridBlock(currentLength + columnIndex)) as unknown as Block[]),
  );
};

const addRowSpansAt = (spans: readonly number[], insertIndex: number) => {
  const block = multiGridStructure.value as ColumnBlock;
  const content = (block.content as Block[] | undefined) ?? [];
  content.forEach((childBlock) => {
    if ((childBlock.parent_slot ?? 0) >= insertIndex)
      childBlock.parent_slot = (childBlock.parent_slot ?? 0) + spans.length;
  });
  block.configuration.columnWidths.splice(insertIndex, 0, ...spans);
  if (block.configuration.columnWidthsTablet) block.configuration.columnWidthsTablet.splice(insertIndex, 0, ...spans);
  if (block.configuration.columnWidthsMobile) block.configuration.columnWidthsMobile.splice(insertIndex, 0, ...spans);
  if (!block.content) block.content = [];
  (block.content as Block[]).push(
    ...(spans.map((_, spanIndex) => createEmptyGridBlock(insertIndex + spanIndex)) as unknown as Block[]),
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
      if (gridBlock.configuration.columnWidthsTablet) gridBlock.configuration.columnWidthsTablet.splice(newSlot, 1);
      if (gridBlock.configuration.columnWidthsMobile) gridBlock.configuration.columnWidthsMobile.splice(newSlot, 1);
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
  if (block.configuration.columnWidthsTablet) block.configuration.columnWidthsTablet.push(12);
  if (block.configuration.columnWidthsMobile) block.configuration.columnWidthsMobile.push(12);
  if (!block.content) block.content = [];
  (block.content as Block[]).push(newBlock as unknown as Block);
};

const insertColumnAt = async (insertIndex: number, defaultSpan: number, anchorEl: HTMLElement) => {
  const block = multiGridStructure.value as ColumnBlock;
  const newBlock = createEmptyGridBlock(insertIndex);

  const content = (block.content as Block[] | undefined) ?? [];
  content.forEach((childBlock) => {
    if ((childBlock.parent_slot ?? 0) >= insertIndex) childBlock.parent_slot = (childBlock.parent_slot ?? 0) + 1;
  });
  block.configuration.columnWidths.splice(insertIndex, 0, defaultSpan);
  if (block.configuration.columnWidthsTablet)
    block.configuration.columnWidthsTablet.splice(insertIndex, 0, defaultSpan);
  if (block.configuration.columnWidthsMobile)
    block.configuration.columnWidthsMobile.splice(insertIndex, 0, defaultSpan);
  if (!block.content) block.content = [];
  (block.content as Block[]).push(newBlock as unknown as Block);

  await nextTick();
  const newCellAnchor = document.querySelector(`[data-mg-cell-index="${insertIndex}"]`) as HTMLElement | null;

  const cleanup = () => {
    const gridBlock = multiGridStructure.value as ColumnBlock;
    const blocks = gridBlock.content as Block[];
    const index = blocks.findIndex(
      (childBlock) => childBlock.meta.uuid === newBlock.meta.uuid && childBlock.name === 'EmptyGridBlock',
    );
    if (index !== -1) {
      blocks.splice(index, 1);
      gridBlock.configuration.columnWidths.splice(insertIndex, 1);
      if (gridBlock.configuration.columnWidthsTablet) gridBlock.configuration.columnWidthsTablet.splice(insertIndex, 1);
      if (gridBlock.configuration.columnWidthsMobile) gridBlock.configuration.columnWidthsMobile.splice(insertIndex, 1);
      (gridBlock.content as Block[]).forEach((childBlock) => {
        if ((childBlock.parent_slot ?? 0) > insertIndex) childBlock.parent_slot = (childBlock.parent_slot ?? 0) - 1;
      });
    }
  };

  openAddBlockPopover({
    anchorEl: newCellAnchor ?? anchorEl,
    targetUuid: newBlock.meta.uuid,
    position: 'inside',
    onCancel: cleanup,
    onPresetPick: (spans) => {
      cleanup();
      addRowSpansAt(spans, insertIndex);
    },
  });
};

const handleAddFreeColumn = (span: number, anchorEl: HTMLElement, filteredInsertIndex: number) => {
  const insertIndex =
    filteredInsertIndex > 0 ? (visibleGrid.value.filteredToOriginal[filteredInsertIndex - 1] ?? -1) + 1 : 0;
  insertColumnAt(insertIndex, span, anchorEl);
};

const handleInsertBefore = (block: Block, anchorEl: HTMLElement) => {
  insertColumnAt(block.parent_slot ?? 0, 12, anchorEl);
};

const { editingBlock, blockForm } = useNestedBlockForm(resolvedUuid);
const { pushEdit } = useBlockEditStack();

const editElement = (block: Block) => {
  pushEdit(block);
};

const elementsOpen = ref(true);
const gridLayoutOpen = ref(true);
const backgroundOpen = ref(true);
</script>

<i18n lang="json">
{
  "en": {
    "grid-layout": "Grid Layout",
    "layout-preset": "Layout Preset",
    "gap-label": "Column Gap",
    "spacing-between": "Spacing between blocks:",
    "layout-background": "Background",
    "background-color-label": "Background Color"
  },
  "de": {
    "grid-layout": "Grid Layout",
    "layout-preset": "Layout Preset",
    "gap-label": "Column Gap",
    "spacing-between": "Spacing between blocks:",
    "layout-background": "Background",
    "background-color-label": "Background Color"
  }
}
</i18n>
