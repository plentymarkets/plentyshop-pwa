<template>
  <div class="sticky h-[calc(100vh-52px)] overflow-y-auto">
    <div v-if="editingBlock">
      <component :is="blockForm" :uuid="editingBlock.meta.uuid" />
    </div>
    <div v-else>
      <EditorGridElementsPanel
        v-model="elementsOpen"
        :uuid="resolvedUuid"
        :quick-add-options="multiGridQuickAddOptions"
        @edit-element="editElement"
        @insert-before="handleInsertBefore"
      />

      <EditorFormPanel
        v-model="layoutOpen"
        data-testid="open-layout-settings"
        :title="getEditorTranslation('layout-settings')"
        content-class="px-3.5 py-3 flex flex-col gap-3"
      >
        <div v-if="isTwoColumnMultigrid">
          <div class="text-2xs text-editor-text-faint mb-1.5">{{ getEditorTranslation('column-size') }}</div>
          <ColumnWidthInput
            :multi-grid-structure="multiGridStructure"
            @update:column-widths="multiGridStructure.configuration.columnWidths = $event"
          />
        </div>

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

        <div v-if="multiGridStructure.configuration.layout">
          <div class="text-2xs text-editor-text-faint mb-1.5">{{ getEditorTranslation('gap-label') }}</div>
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
          <div class="mt-1.5 text-2xs text-editor-text-placeholder">
            {{ getEditorTranslation('spacing-between') }} {{ getGapPx(multiGridStructure.configuration.layout.gap) }}px
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
      </EditorFormPanel>

      <EditorFormPanel
        v-model="backgroundOpen"
        data-testid="open-layout-background-settings"
        :title="getEditorTranslation('layout-background')"
      >
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
      </EditorFormPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ColumnBlock, GapSize } from '~/components/blocks/structure/MultiGrid/types';
import type { Block } from '@plentymarkets/shop-api';
import { SfInput, SfIconArrowUpward, SfIconArrowDownward } from '@storefront-ui/vue';
import ColumnWidthInput from '~/components/editor/ColumnWidthInput.vue';

const props = defineProps<{ uuid?: string }>();

const enableAddBlockPopover = useRuntimeConfig().public.enableAddBlockPopover as boolean;
const { openAddBlockPopover } = useAddBlockPopover();
const { openDrawerWithView } = useSiteConfiguration();
const { setInsertColumnUuid } = useBlocksMutations();
const { blockUuid } = useSiteConfiguration();
const resolvedUuid = computed(() => props.uuid || blockUuid.value);
const { allBlocks } = useBlocks();
const { findOrDeleteBlockByUuid } = useBlockManager();
const { getSetting: getBlockSize } = useSiteSettings('verticalBlockSize');
const blockSize = computed(() => getBlockSize());
const defaultMarginBottom = computed(() => getVerticalPixels(blockSize.value));

const isTwoColumnMultigrid = computed(() => multiGridStructure.value.configuration?.columnWidths?.length === 2);

const multiGridStructure = computed(() => {
  const block = (findOrDeleteBlockByUuid(allBlocks.value, resolvedUuid.value) as ColumnBlock) || { content: [] };
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

const numColumns = computed(() => Math.max(0, multiGridStructure.value.configuration.columnWidths?.length || 0));

const isSticky = (columnIndex: number) => (multiGridStructure.value.configuration?.sticky || []).includes(columnIndex);

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

const gapOptions = ['None', 'S', 'M', 'L', 'XL'];
const gapPxMap: Record<GapSize, number> = { None: 0, S: 4, M: 8, L: 12, XL: 20 };

const getGapPx = (gap: string | undefined): number => {
  const validGap = gap === 'None' || gap === 'S' || gap === 'M' || gap === 'L' || gap === 'XL' ? gap : 'M';
  return gapPxMap[validGap as GapSize];
};

const { editingBlock, blockForm } = useNestedBlockForm(resolvedUuid);
const { pushEdit } = useBlockEditStack();

const editElement = (block: Block) => {
  pushEdit(block);
};

const handleInsertBefore = (block: Block, anchorEl: HTMLElement) => {
  const insertIndex = block.parent_slot ?? 0;
  const structure = multiGridStructure.value as ColumnBlock;
  const content = (structure.content as Block[] | undefined) ?? [];
  const newBlock = createEmptyGridBlock(insertIndex);

  content.forEach((childBlock) => {
    if ((childBlock.parent_slot ?? 0) >= insertIndex) childBlock.parent_slot = (childBlock.parent_slot ?? 0) + 1;
  });
  structure.configuration.columnWidths.splice(insertIndex, 0, 12);
  if (!structure.content) structure.content = [];
  (structure.content as Block[]).push(newBlock as unknown as Block);

  const cleanup = () => {
    const blocks = structure.content as Block[];
    const index = blocks.findIndex(
      (childBlock) => childBlock.meta.uuid === newBlock.meta.uuid && childBlock.name === 'EmptyGridBlock',
    );
    if (index !== -1) {
      blocks.splice(index, 1);
      structure.configuration.columnWidths.splice(insertIndex, 1);
      (structure.content as Block[]).forEach((childBlock) => {
        if ((childBlock.parent_slot ?? 0) > insertIndex) childBlock.parent_slot = (childBlock.parent_slot ?? 0) - 1;
      });
    }
  };

  if (enableAddBlockPopover) {
    openAddBlockPopover({ anchorEl, targetUuid: newBlock.meta.uuid, position: 'inside', onCancel: cleanup });
  } else {
    setInsertColumnUuid(newBlock.meta.uuid);
    openDrawerWithView('blocksList');
  }
};

const elementsOpen = ref(true);
const layoutOpen = ref(true);
const backgroundOpen = ref(true);
</script>

<i18n lang="json">
{
  "en": {
    "layout-settings": "Layout Settings",
    "margin-label": "Margin (px)",
    "background-color-label": "Background Color",
    "gap-label": "Column Gap",
    "spacing-between": "Spacing between blocks:",
    "layout-background": "Background",
    "sticky-columns": "Sticky columns",
    "column-size": "Column Size",
    "column": "Column"
  },
  "de": {
    "layout-settings": "Layout Settings",
    "margin-label": "Margin (px)",
    "background-color-label": "Background Color",
    "gap-label": "Column Gap",
    "spacing-between": "Spacing between blocks:",
    "layout-background": "Background",
    "sticky-columns": "Sticky columns",
    "column-size": "Column Size",
    "column": "Column"
  }
}
</i18n>
