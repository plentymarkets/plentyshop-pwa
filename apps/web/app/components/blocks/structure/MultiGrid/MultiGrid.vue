<template>
  <div
    data-testid="multi-grid-structure"
    :class="[getGridClasses(), { 'px-4': shouldApplyPadding }]"
    :style="gridInlineStyle"
  >
    <template v-for="(gridRow, rowIndex) in gridRows" :key="rowIndex">
      <template v-for="cell in gridRow.cells" :key="cell.colIndex">
        <div
          v-if="columns[cell.colIndex]?.length || (shouldEnableEditorFeatures && enableMultiGridEditor)"
          :class="getColumnClasses(cell.colIndex)"
          class="group/col relative @md:z-raised"
          data-testid="multi-grid-column"
        >
          <div
            v-for="row in columns[cell.colIndex]"
            :key="row.meta.uuid"
            class="group/row relative"
            :data-uuid="row.meta.uuid"
            @mouseenter="onRowEnter(row)"
            @mouseleave="onRowLeave"
          >
            <slot
              name="content"
              :content-block="row"
              :column-length="(columns[cell.colIndex] ?? []).length"
              :is-row-hovered="isRowHovered(row)"
            />
          </div>
        </div>
      </template>

      <ClientOnly>
        <div
          v-if="gridRow.free > 0 && shouldEnableEditorFeatures && enableMultiGridEditor"
          :class="`col-span-${gridRow.free}`"
          class="self-stretch rounded-md border border-dashed border-editor-canvas-border bg-editor-hatched flex items-center justify-center"
          aria-hidden="true"
        >
          <span class="text-3xs text-editor-text-dim tracking-wider">{{ gridRow.free }}/12 free</span>
        </div>
      </ClientOnly>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { AlignableBlock, GridRow, MultiGridProps } from '~/components/blocks/structure/MultiGrid/types';
import type { Block } from '@plentymarkets/shop-api';
import { computeGridRows } from '~/components/blocks/structure/MultiGrid/multiGridRows';
import { computeVisibleGrid } from '~/components/blocks/structure/MultiGrid/multiGridVisibility';
import { useMultiGridDeviceWidths } from '~/components/blocks/structure/MultiGrid/multiGridDeviceWidths';

const props = defineProps<MultiGridProps>();
const route = useRoute();

const hoveredRowUuid = ref<string | null>(null);
const { setHoveredBlock, clearHoveredBlock } = useTableOfContents();

const onRowEnter = (row: Block) => {
  hoveredRowUuid.value = row.meta.uuid;
  setHoveredBlock(row.meta.uuid);
};
const onRowLeave = () => {
  hoveredRowUuid.value = null;
  clearHoveredBlock();
};
const isRowHovered = (row: Block) => hoveredRowUuid.value === row.meta.uuid;

const { shouldEnableEditorFeatures } = useEditorState();
const enableMultiGridEditor = useRuntimeConfig().public.enableMultiGridEditor as boolean;
const { getSetting: getBlockSize } = useSiteSettings('verticalBlockSize');
const blockSize = computed(() => getBlockSize());

const { isFullWidth } = useFullWidthToggleForConfig(computed(() => props.configuration));
const shouldApplyPadding = computed(() => !isFullWidth.value);

const gapClassMap: Record<string, string> = {
  None: 'gap-x-0',
  S: 'gap-y-1 @md:gap-x-1 @md:gap-y-0',
  M: 'gap-y-2 @md:gap-x-2 @md:gap-y-0',
  L: 'gap-y-3 @md:gap-x-3 @md:gap-y-0',
  XL: 'gap-y-5 @md:gap-x-5 @md:gap-y-0',
};
const gridGapClass = computed(() => gapClassMap[props.configuration.layout?.gap || 'M']);
const defaultMarginBottom = computed(() => getVerticalPixels(blockSize.value));
const reverseOnMobile = computed(() => props.configuration.layout?.reverseOnMobile === true);
const alignHeights = computed(() => props.configuration.layout?.alignHeights !== false);

const gridInlineStyle = computed(() => ({
  backgroundColor: props.configuration.layout?.backgroundColor ?? 'transparent',
  marginTop: props.configuration.layout?.marginTop === undefined ? '0px' : `${props.configuration.layout.marginTop}px`,
  marginBottom:
    props.configuration.layout?.marginBottom === undefined
      ? `${defaultMarginBottom.value}px`
      : `${props.configuration.layout.marginBottom}px`,
}));
const getGridClasses = () => {
  const alignClass = alignHeights.value ? 'items-stretch' : 'items-start';
  if (reverseOnMobile.value) {
    return ['flex flex-col-reverse @md:grid @md:grid-cols-12 @lg:grid-cols-12', gridGapClass.value ?? '', alignClass];
  }
  return gridClassFor({ mobile: 12, tablet: 12, desktop: 12 }, [gridGapClass.value ?? '', alignClass]);
};

const { widths: gridColumnsWidth, mobileFullWidthColumn } = useMultiGridDeviceWidths(
  computed(() => props.configuration),
);

const visibleGrid = computed(() => computeVisibleGrid(props.content, gridColumnsWidth.value));

const getColumnClasses = (filteredColIndex: number) => {
  if (mobileFullWidthColumn.value) {
    return ['col-span-12'];
  }

  const classes = [`col-span-${visibleGrid.value.columnWidths[filteredColIndex]}`];
  const originalIdx = visibleGrid.value.filteredToOriginal[filteredColIndex] ?? -1;
  if (Array.isArray(props.configuration.sticky) && props.configuration.sticky.includes(originalIdx)) {
    classes.push('@md:sticky', route.meta?.type === 'product' ? '@md:top-40' : '@md:top-5');
  }
  return classes;
};

const gridRows = computed((): GridRow[] => computeGridRows(visibleGrid.value.columnWidths));

const isAlignable = (block: Block): block is AlignableBlock =>
  typeof block.content === 'object' &&
  block.content !== null &&
  ('imageAlignment' in block.content || 'alignment' in block.content);

const readAlignment = (block: AlignableBlock): 'left' | 'right' | undefined => {
  const alignmentValue = block.content?.imageAlignment ?? block.content?.alignment;
  return alignmentValue === 'left' || alignmentValue === 'right' ? alignmentValue : undefined;
};

const pairWithSlots = computed<Block[]>(() => {
  const list = visibleGrid.value.blocks.map((block) => ({ ...block }));

  const alignableIndex = list.findIndex(isAlignable);

  if (alignableIndex === -1) return list;

  const alignment = readAlignment(list[alignableIndex] as AlignableBlock);
  if (!alignment) return list;

  const selfSlot = alignment === 'right' ? 1 : 0;
  const sibling = alignableIndex === 0 ? 1 : 0;

  list[alignableIndex] = { ...list[alignableIndex], parent_slot: selfSlot } as Block;
  list[sibling] = { ...list[sibling], parent_slot: 1 - selfSlot } as Block;

  return list;
});

const columns = computed<Block[][]>(() => {
  const blocks: Block[][] = [];
  pairWithSlots.value.forEach((block) => {
    if (block.parent_slot !== undefined) {
      if (!blocks[block.parent_slot]) {
        blocks[block.parent_slot] = [];
      }

      const slot = blocks[block.parent_slot];
      if (slot) {
        slot.push(block);
      }
    }
  });
  return blocks;
});
</script>
