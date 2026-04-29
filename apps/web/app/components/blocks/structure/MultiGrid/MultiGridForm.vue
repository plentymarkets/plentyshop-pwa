<template>
  <div
    data-testid="multi-grid-form"
    class="sticky h-[calc(100vh-52px)] overflow-hidden flex flex-col"
  >
    <!-- Nested block editing view -->
    <div v-if="editingBlockIndex !== undefined && childBlocks[editingBlockIndex]" class="flex-1 overflow-y-auto">
      <component
        :is="blockForm"
        ref="innerFormRef"
        :uuid="childBlocks[editingBlockIndex]!.meta.uuid"
      />
    </div>

    <!-- Main form view -->
    <template v-else>
      <!-- Breadcrumbs -->
      <div
        class="flex items-center gap-px bg-[#fafafa] border-b border-[#ebebeb] px-3.5 py-[7px] flex-shrink-0"
      >
        <button
          class="border-none bg-transparent px-[5px] py-[2px] text-[11px] rounded text-[#888] cursor-pointer hover:bg-[#eee]"
          @click="navigateToPage"
        >
          Page
        </button>
        <span class="text-[#d8d8d8] text-xs mx-[3px]">/</span>
        <span class="px-[5px] py-[2px] text-[11px] font-semibold text-[#1a1a1a]">
          Grid Block
        </span>
      </div>

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
          @edit="editBlock"
          @delete="deleteChildBlock"
          @toggle-visibility="toggleChildVisibility"
          @reorder="handleReorder"
          @add-element="addChildBlock"
          @quick-add="quickAddBlock"
        />

        <!-- 2 ── GRID LAYOUT -->
        <BlocksStructureMultiGridPartialsMultiGridSectionHeader
          title="Grid Layout"
          :expanded="sections.grid"
          @toggle="sections.grid = !sections.grid"
        />
        <div v-if="sections.grid" class="px-3.5 py-3">
          <BlocksStructureMultiGridPartialsMultiGridLayoutPresets @apply="applyPreset" />

          <BlocksStructureMultiGridPartialsMultiGridGridEditor
            :blocks="gridBlocks"
            :selected-id="selectedColumnId"
            @select="selectedColumnId = $event"
            @resize="resizeColumn"
            @delete="deleteColumn"
            @add-block="addColumn"
            @add-row="addColumn(undefined)"
          />

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
            <BlocksStructureMultiGridPartialsMultiGridToggle
              :model-value="isSticky(colIdx)"
              @update:model-value="toggleSticky(colIdx)"
            />
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
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ColumnBlock } from '~/components/blocks/structure/MultiGrid/types';
import type { Block } from '@plentymarkets/shop-api';
import { SfInput, SfIconArrowUpward, SfIconArrowDownward } from '@storefront-ui/vue';
import type { GridBlock } from '~/components/blocks/structure/MultiGrid/partials/MultiGridGridEditor.vue';
import type { ElementBlock } from '~/components/blocks/structure/MultiGrid/partials/MultiGridElementsList.vue';

const BLOCK_COLORS = ['#4285F4', '#34A853', '#9C59D1', '#F4791F', '#E8394A', '#00ACC1', '#7B6E27'];

const props = defineProps<{ uuid?: string }>();

const { blockUuid, openDrawerWithView } = useSiteConfiguration();
const resolvedUuid = computed(() => props.uuid || blockUuid.value);
const { allBlocks: data } = useBlocks();
const { findOrDeleteBlockByUuid, togglePlaceholder, addNewBlock } = useBlockManager();
const { toggleBlockVisibility } = useBlocksVisibility();
const { setEditTitle, clearEditTitle } = useBlockEditTitle();
const { getSetting: getBlockSize } = useSiteSettings('verticalBlockSize');
const blockSize = computed(() => getBlockSize());
const defaultMarginBottom = computed(() => getVerticalPixels(blockSize.value));

// ─── Section expand states ────────────────────
const sections = reactive({ elements: true, grid: true, layout: false });

// ─── Selection ────────────────────────────────
const selectedBlockId = ref<string | null>(null);
const selectedColumnId = ref<string | null>(null);

// ─── Nested editing ───────────────────────────
const editingBlockIndex = ref<number | undefined>(undefined);
const innerFormRef = ref<{ exitEditMode?: (shouldEmit?: boolean) => boolean | undefined; isSubEditing?: boolean } | null>(null);
const blockLabels = ref<string[]>([]);

const blockForm = computed(() => {
  if (editingBlockIndex.value === undefined) return null;
  const block = childBlocks.value[editingBlockIndex.value];
  if (!block) return null;
  const loader = getBlockFormLoader(block.name);
  return loader ? defineAsyncComponent(loader) : null;
});

const resolveBlockLabels = () => {
  blockLabels.value = childBlocks.value.map((block) => getBlockDisplayName(block.name));
};

const editBlock = (index: number) => {
  editingBlockIndex.value = index;
  const label = blockLabels.value[index];
  if (label) setEditTitle(label);
};

const exitEditMode = (shouldEmit = true): boolean => {
  if (innerFormRef.value?.isSubEditing && innerFormRef.value?.exitEditMode) {
    innerFormRef.value.exitEditMode(false);
    const blockLabel = editingBlockIndex.value !== undefined ? blockLabels.value[editingBlockIndex.value] : undefined;
    if (blockLabel) setEditTitle(blockLabel);
    return false;
  }

  editingBlockIndex.value = undefined;
  if (shouldEmit) clearEditTitle();
  resolveBlockLabels();
  return true;
};

const isSubEditing = computed(() => editingBlockIndex.value !== undefined);

defineExpose({ exitEditMode, isSubEditing });

// ─── Breadcrumb navigation ────────────────────
const navigateToPage = () => {
  // Exit this form entirely — the BlockEditView handles it via back button
  // But we can also close the drawer to go back to page view
  const { closeBlocksConfigurationDrawer } = useSiteConfiguration();
  closeBlocksConfigurationDrawer();
};

// ─── Core reactive block structure ────────────
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

if (!multiGridStructure.value.configuration?.sticky) multiGridStructure.value.configuration.sticky = [];

// ─── Elements List ────────────────────────────
const childBlocks = computed(() => (multiGridStructure.value.content || []) as Block[]);
const columnWidths = computed(() => multiGridStructure.value.configuration.columnWidths || []);

const elementBlocks = computed<ElementBlock[]>(() =>
  childBlocks.value.map((block, i) => {
    const slot = block.parent_slot ?? i;
    const span = columnWidths.value[slot] ?? 6;
    const blockConfig = block.configuration as Record<string, unknown> | undefined;
    return {
      uuid: block.meta.uuid,
      label: getBlockDisplayName(block.name),
      span,
      color: BLOCK_COLORS[slot % BLOCK_COLORS.length]!,
      type: block.name,
      visible: blockConfig?.visible !== false,
    };
  }),
);

watch(
  () => childBlocks.value.map((b) => b.meta.uuid),
  () => resolveBlockLabels(),
  { immediate: true },
);

const deleteChildBlock = (index: number) => {
  const content = multiGridStructure.value.content as Block[];
  if (content.length <= 1) return;
  content.splice(index, 1);
  if (editingBlockIndex.value === index) exitEditMode();
};

const toggleChildVisibility = (index: number) => {
  const content = multiGridStructure.value.content as Block[];
  const block = content[index];
  if (block) toggleBlockVisibility(block);
};

const handleReorder = (reordered: ElementBlock[]) => {
  const content = multiGridStructure.value.content as Block[];
  const uuidOrder = reordered.map((b) => b.uuid);
  const sorted = uuidOrder.map((uuid) => content.find((b) => b.meta.uuid === uuid)).filter(Boolean) as Block[];
  content.splice(0, content.length, ...sorted);
};

const addChildBlock = () => {
  const content = multiGridStructure.value.content as Block[];
  const lastChild = content[content.length - 1];
  if (lastChild) {
    togglePlaceholder(lastChild.meta.uuid, 'bottom');
  }
  openDrawerWithView('blocksList');
};

const quickAddBlock = async (blockName: string) => {
  const content = multiGridStructure.value.content as Block[];
  const lastChild = content[content.length - 1];
  if (!lastChild) return;

  // Map component names to block list categories (from blocksLists.json)
  const categoryMap: Record<string, { category: string; variation: number }> = {
    Image: { category: 'image', variation: 0 },
    TextCard: { category: 'text', variation: 0 },
    MultiGrid: { category: 'layout', variation: 0 },
  };

  const mapping = categoryMap[blockName];
  if (mapping) {
    await addNewBlock(mapping.category, mapping.variation, lastChild.meta.uuid, 'bottom');
  }
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
