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
          class="group/col relative @md:z-[1]"
          data-testid="multi-grid-column"
        >
          <div
            v-for="row in columns[cell.colIndex]"
            :key="row.meta.uuid"
            class="group/row relative"
            :class="{ 'min-h-[60px]': showOverlay(row) }"
            :data-uuid="row.meta.uuid"
            @mouseenter="onRowEnter(row)"
            @mouseleave="onRowLeave"
          >
            <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(row.meta.uuid, 'top', drawerOpen, drawerView)" />
            <ClientOnly>
              <template v-if="showOverlay(row)">
                <div
                  class="pointer-events-none absolute inset-0 opacity-0 group-hover/row:opacity-100"
                  style="box-shadow: inset 0 0 0 2px #7c3aed"
                />

                <div
                  class="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover/row:opacity-100 bg-purple-600/15"
                />

                <div
                  class="absolute inset-0 z-30 flex items-center justify-center opacity-0 invisible pointer-events-none group-hover/row:opacity-100 group-hover/row:visible group-hover/row:pointer-events-auto"
                >
                  <UiBlockActions
                    data-testid="multigrid-block-actions"
                    :block="row"
                    :index="cell.colIndex"
                    :actions="getBlockActions()"
                  />
                </div>
              </template>
            </ClientOnly>

            <slot
              name="content"
              :content-block="row"
              :column-length="(columns[cell.colIndex] ?? []).length"
              :is-row-hovered="showOverlay(row) && isRowHovered(row)"
            />
            <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(row.meta.uuid, 'bottom', drawerOpen, drawerView)" />
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
const { isDragging, shouldDisplayPlaceholder } = useBlockManager();
const { siteConfigurationDrawerOpen, siteConfigurationDrawerView } = useSiteConfiguration();
const attrs = useAttrs() as { enableActions?: boolean; root?: boolean };
const { getSetting: getBlockSize } = useSiteSettings('verticalBlockSize');
const blockSize = computed(() => getBlockSize());

const drawerOpen = computed(() => siteConfigurationDrawerOpen.value);
const drawerView = computed(() => siteConfigurationDrawerView.value);

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

const gridInlineStyle = computed(() => ({
  backgroundColor: props.configuration.layout?.backgroundColor ?? 'transparent',
  marginTop: props.configuration.layout?.marginTop !== undefined ? `${props.configuration.layout.marginTop}px` : '0px',
  marginBottom:
    props.configuration.layout?.marginBottom !== undefined
      ? `${props.configuration.layout.marginBottom}px`
      : `${defaultMarginBottom.value}px`,
}));
const getGridClasses = () => {
  return gridClassFor({ mobile: 1, tablet: 12, desktop: 12 }, [gridGapClass.value ?? '', 'items-start']);
};

const getColumnClasses = (colIndex: number) => {
  const columnWidth = props.configuration.columnWidths[colIndex];
  const classes = [`col-span-${columnWidth}`];

  if (Array.isArray(props.configuration.sticky) && props.configuration.sticky.includes(colIndex)) {
    classes.push('@md:sticky');

    const topValue = route.meta?.type === 'product' ? '@md:top-40' : '@md:top-5';
    classes.push(topValue);
  }

  return classes;
};

const getBlockActions = () => ({
  isEditable: true,
  isMovable: false,
  isDeletable: false,
  classes: ['bg-purple-400', 'hover:bg-purple-500', 'transition'],
  buttonClasses: ['border-2', 'border-purple-600'],
  hoverBackground: ['hover:bg-purple-500'],
});

const enableActions = computed(() => attrs.enableActions === true);

const blockHasData = (block: Block): boolean => !!block.content && Object.keys(block.content).length > 0;

const showOverlay = computed(
  () => (block: Block) =>
    enableActions.value && shouldEnableEditorFeatures.value && !isDragging.value && blockHasData(block),
);

const gridRows = computed((): GridRow[] => computeGridRows(props.configuration.columnWidths));

const isAlignable = (block: Block): block is AlignableBlock =>
  typeof block.content === 'object' &&
  block.content !== null &&
  ('imageAlignment' in block.content || 'alignment' in block.content);

const readAlignment = (block: AlignableBlock): 'left' | 'right' | undefined => {
  const alignmentValue = block.content?.imageAlignment ?? block.content?.alignment;
  return alignmentValue === 'left' || alignmentValue === 'right' ? alignmentValue : undefined;
};

const pairWithSlots = computed<Block[]>(() => {
  const list = props.content.map((block) => ({ ...block }));

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
