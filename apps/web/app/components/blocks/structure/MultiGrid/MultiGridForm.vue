<template>
  <div
    data-testid="multi-grid-form"
    class="sticky h-[calc(100vh-52px)] overflow-hidden flex flex-col"
  >
    <!-- Scrollable body -->
    <div class="flex-1 overflow-y-auto">
      <!-- 1 ── ELEMENTS -->
      <BlocksStructureMultiGridPartialsMultiGridSectionHeader
        title="Elements"
        :expanded="sections.elements"
        @toggle="sections.elements = !sections.elements"
      />
      <BlocksStructureMultiGridPartialsMultiGridElementsList
        v-if="sections.elements"
        :blocks="elementBlocks"
        :selected-id="selectedBlockId"
        @select="selectedBlockId = $event"
        @delete="deleteChildBlock"
        @reorder="reorderChildBlocks"
        @add-element="addChildBlock"
        @quick-add="addChildBlock"
      />

      <!-- 2 ── GRID LAYOUT -->
      <BlocksStructureMultiGridPartialsMultiGridSectionHeader
        title="Grid Layout"
        :expanded="sections.grid"
        @toggle="sections.grid = !sections.grid"
      />
      <div v-if="sections.grid" class="px-3.5 py-3">
        <!-- Layout presets -->
        <BlocksStructureMultiGridPartialsMultiGridLayoutPresets @apply="applyPreset" />

        <!-- Grid editor -->
        <BlocksStructureMultiGridPartialsMultiGridGridEditor
          :blocks="gridBlocks"
          :selected-id="selectedColumnId"
          @select="selectedColumnId = $event"
          @resize="resizeColumn"
          @delete="deleteColumn"
          @add-block="addColumn"
          @add-row="addColumn(undefined)"
        />

        <!-- Gap selector -->
        <BlocksStructureMultiGridPartialsMultiGridGapSelector
          v-if="multiGridStructure.configuration.layout"
          :model-value="multiGridStructure.configuration.layout.gap || 'M'"
          @update:model-value="multiGridStructure.configuration.layout!.gap = $event"
        />
      </div>

      <!-- 3 ── LAYOUT -->
      <BlocksStructureMultiGridPartialsMultiGridSectionHeader
        title="Layout"
        :expanded="sections.layout"
        @toggle="sections.layout = !sections.layout"
      />
      <div v-if="sections.layout" class="px-3.5 py-3 flex flex-col gap-[13px]">
        <!-- Sticky columns -->
        <div
          v-for="(colIdx, i) in stickyColumnOptions"
          :key="`sticky-${i}`"
          class="flex items-center"
        >
          <span class="flex-1 text-[13px] text-[#333]">
            {{ getEditorTranslation('sticky-column', { col: colIdx + 1 }) }}
          </span>
          <BlocksStructureMultiGridPartialsMultiGridToggle :model-value="isSticky(colIdx)" @update:model-value="toggleSticky(colIdx)" />
        </div>

        <!-- Full width -->
        <div class="flex items-center">
          <span class="flex-1 text-[13px] text-[#333]">{{ getEditorTranslation('full-width') }}</span>
          <BlocksStructureMultiGridPartialsMultiGridToggle v-model="isFullWidth" />
        </div>

        <!-- Background color -->
        <div v-if="multiGridStructure.configuration.layout" class="pt-1">
          <span class="text-[13px] text-[#333] block mb-2">{{ getEditorTranslation('background-color-label') }}</span>
          <EditorColorPicker
            v-model="multiGridStructure.configuration.layout.backgroundColor"
            class="w-full"
          >
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
                      class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
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

        <!-- Margin -->
        <div v-if="multiGridStructure.configuration.layout" class="pt-1">
          <span class="text-[13px] text-[#333] block mb-2">{{ getEditorTranslation('margin-label') }}</span>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ColumnBlock } from '~/components/blocks/structure/MultiGrid/types';
import type { Block } from '@plentymarkets/shop-api';
import { SfInput, SfIconArrowUpward, SfIconArrowDownward } from '@storefront-ui/vue';
import type { GridBlock } from '~/components/blocks/structure/MultiGrid/partials/BlocksStructureMultiGridPartialsMultiGridGridEditor.vue';
import type { ElementBlock } from '~/components/blocks/structure/MultiGrid/partials/BlocksStructureMultiGridPartialsMultiGridElementsList.vue';

const BLOCK_COLORS = ['#4285F4', '#34A853', '#9C59D1', '#F4791F', '#E8394A', '#00ACC1', '#7B6E27'];

const props = defineProps<{ uuid?: string }>();

const { blockUuid } = useSiteConfiguration();
const resolvedUuid = computed(() => props.uuid || blockUuid.value);
const { allBlocks: data } = useBlocks();
const { findOrDeleteBlockByUuid } = useBlockManager();
const { getSetting: getBlockSize } = useSiteSettings('verticalBlockSize');
const blockSize = computed(() => getBlockSize());
const defaultMarginBottom = computed(() => getVerticalPixels(blockSize.value));

// Section expand states
const sections = reactive({ elements: true, grid: true, layout: false });

// Selected block/column IDs
const selectedBlockId = ref<string | null>(null);
const selectedColumnId = ref<string | null>(null);

// Core reactive block structure
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

// Full width toggle (reuses existing composable)
const { isFullWidth } = useFullWidthToggleForConfig(computed(() => multiGridStructure.value.configuration));

// Ensure sticky array exists
if (!multiGridStructure.value.configuration?.sticky) multiGridStructure.value.configuration.sticky = [];

// ─── Elements List ────────────────────────────
const childBlocks = computed(() => (multiGridStructure.value.content || []) as Block[]);
const columnWidths = computed(() => multiGridStructure.value.configuration.columnWidths || []);

const elementBlocks = computed<ElementBlock[]>(() =>
  childBlocks.value.map((block, i) => {
    const slot = block.parent_slot ?? i;
    const span = columnWidths.value[slot] ?? 6;
    return {
      uuid: block.meta.uuid,
      label: getBlockDisplayName(block.name),
      span,
      color: BLOCK_COLORS[slot % BLOCK_COLORS.length]!,
      type: block.name,
    };
  }),
);

const deleteChildBlock = (uuid: string) => {
  const content = multiGridStructure.value.content as Block[];
  const idx = content.findIndex((b) => b.meta.uuid === uuid);
  if (idx !== -1) content.splice(idx, 1);
};

const reorderChildBlocks = (fromIdx: number, toIdx: number) => {
  const content = multiGridStructure.value.content as Block[];
  const [item] = content.splice(fromIdx, 1);
  if (item) content.splice(toIdx, 0, item);
};

const addChildBlock = () => {
  const { openDrawerWithView } = useSiteConfiguration();
  const { togglePlaceholder } = useBlockManager();

  const content = multiGridStructure.value.content as Block[];
  const lastChild = content[content.length - 1];

  if (lastChild) {
    togglePlaceholder(lastChild.meta.uuid, 'bottom');
  }
  openDrawerWithView('blocksList');
};

// ─── Grid Editor ──────────────────────────────
const gridBlocks = computed<GridBlock[]>(() =>
  columnWidths.value.map((span, i) => {
    const childInSlot = childBlocks.value.find((b) => (b.parent_slot ?? 0) === i);
    return {
      uuid: `col-${i}`,
      label: childInSlot ? getBlockDisplayName(childInSlot.name) : `Column ${i + 1}`,
      span,
      color: BLOCK_COLORS[i % BLOCK_COLORS.length]!,
    };
  }),
);

const resizeColumn = (uuid: string, newSpan: number) => {
  const idx = Number.parseInt(uuid.replace('col-', ''), 10);
  if (Number.isNaN(idx)) return;
  const widths = [...multiGridStructure.value.configuration.columnWidths];
  if (widths[idx] !== undefined) {
    widths[idx] = newSpan;
    multiGridStructure.value.configuration.columnWidths = widths;
  }
};

const deleteColumn = (uuid: string) => {
  const idx = Number.parseInt(uuid.replace('col-', ''), 10);
  if (Number.isNaN(idx)) return;
  const widths = [...multiGridStructure.value.configuration.columnWidths];
  if (widths.length <= 1) return;
  widths.splice(idx, 1);
  multiGridStructure.value.configuration.columnWidths = widths;

  // Remove child blocks in deleted column, shift parent_slots
  const content = multiGridStructure.value.content as Block[];
  for (let j = content.length - 1; j >= 0; j--) {
    const slot = content[j]!.parent_slot ?? 0;
    if (slot === idx) {
      content.splice(j, 1);
    } else if (slot > idx) {
      content[j]!.parent_slot = slot - 1;
    }
  }
};

const addColumn = (_afterUuid?: string) => {
  const widths = [...multiGridStructure.value.configuration.columnWidths];
  const remaining = 12 - widths.reduce((a, b) => a + b, 0);
  const newSpan = remaining > 0 ? Math.min(remaining, 4) : 3;
  widths.push(newSpan);
  multiGridStructure.value.configuration.columnWidths = widths;
};

const applyPreset = (spans: number[]) => {
  multiGridStructure.value.configuration.columnWidths = [...spans];
  // Keep existing content but adjust parent_slots to fit new column count
  const content = multiGridStructure.value.content as Block[];
  content.forEach((block, i) => {
    block.parent_slot = Math.min(block.parent_slot ?? i, spans.length - 1);
  });
};

// ─── Sticky columns ──────────────────────────
const stickyColumnOptions = computed(() =>
  Array.from({ length: columnWidths.value.length }, (_, i) => i),
);

const isSticky = (columnIndex: number) => {
  const sticky = multiGridStructure.value.configuration?.sticky || [];
  return sticky.includes(columnIndex);
};

const toggleSticky = (columnIndex: number) => {
  const configuration = multiGridStructure.value.configuration;
  if (!Array.isArray(configuration?.sticky)) {
    configuration.sticky = [];
  }
  const position = configuration.sticky.indexOf(columnIndex);
  if (position === -1) {
    configuration.sticky.push(columnIndex);
  } else {
    configuration.sticky.splice(position, 1);
  }
};
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  appearance: textfield;
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
    "layout-background": "Layout Background",
    "sticky-columns": "Sticky columns",
    "sticky-column": "Sticky Column {col}",
    "column-size": "Column Size",
    "column": "Column",
    "full-width": "Full Width"
  },
  "de": {
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
    "layout-background": "Layout Background",
    "sticky-columns": "Sticky columns",
    "sticky-column": "Sticky Column {col}",
    "column-size": "Column Size",
    "column": "Column",
    "full-width": "Full Width"
  }
}
</i18n>
