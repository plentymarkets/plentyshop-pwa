<template>
  <div data-testid="multi-grid-structure" :class="getGridClasses()" :style="gridInlineStyle">
    <div
      v-for="(column, colIndex) in columns"
      :key="colIndex"
      :class="getColumnClasses(colIndex)"
      class="group/col relative z-[1]"
      :style="getColumnIndicatorStyle(colIndex)"
      data-testid="multi-grid-column"
    >
      <template v-if="column.length === 0 && isEditorMode">
        <slot name="empty-column" :col-index="colIndex">
          <div
            class="h-[120px] flex-1 border-2 border-dashed border-gray-300 bg-gray-50/50 flex flex-col items-center justify-center text-center cursor-pointer rounded-sm"
            :style="{ borderColor: COLUMN_COLORS[colIndex % COLUMN_COLORS.length] + '66' }"
            @click.stop="onEmptyColumnClick(colIndex)"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="mb-1 text-gray-400">
              <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span class="text-xs font-medium text-gray-500">Add block</span>
          </div>
        </slot>
      </template>

      <div
        v-for="row in column"
        :key="row.meta.uuid"
        class="group/row relative"
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
                :index="colIndex"
                :actions="getBlockActions()"
              />
            </div>
          </template>
        </ClientOnly>

        <slot
          name="content"
          :content-block="row"
          :column-length="column.length"
          :is-row-hovered="showOverlay(row) && isRowHovered(row)"
        />
        <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(row.meta.uuid, 'bottom', drawerOpen, drawerView)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlignableBlock, MultiGridProps } from '~/components/blocks/structure/MultiGrid/types';
import type { Block } from '@plentymarkets/shop-api';

const { content, configuration } = defineProps<MultiGridProps>();
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
const { isDragging, shouldDisplayPlaceholder, updateMultigridColumnUuid, visiblePlaceholder } = useBlockManager();
const { siteConfigurationDrawerOpen, siteConfigurationDrawerView, openDrawerWithView } = useSiteConfiguration();
const attrs = useAttrs() as { enableActions?: boolean; root?: boolean };
const { getSetting: getBlockSize } = useSiteSettings('verticalBlockSize');
const blockSize = computed(() => getBlockSize());

const drawerOpen = computed(() => siteConfigurationDrawerOpen.value);
const drawerView = computed(() => siteConfigurationDrawerView.value);

const isEditorMode = computed(() => enableActions.value && shouldEnableEditorFeatures.value);

const gapClassMap: Record<string, string> = {
  None: 'gap-x-0',
  S: 'gap-y-1 md:gap-x-1 md:gap-y-0',
  M: 'gap-y-2 md:gap-x-2 md:gap-y-0',
  L: 'gap-y-3 md:gap-x-3 md:gap-y-0',
  XL: 'gap-y-5 md:gap-x-5 md:gap-y-0',
};
const gridGapClass = computed(() => gapClassMap[configuration.layout?.gap || 'M']);
const defaultMarginBottom = computed(() => getVerticalPixels(blockSize.value));

const gridInlineStyle = computed(() => ({
  backgroundColor: configuration.layout?.backgroundColor ?? 'transparent',
  marginTop: configuration.layout?.marginTop !== undefined ? `${configuration.layout.marginTop}px` : '0px',
  marginBottom:
    configuration.layout?.marginBottom !== undefined
      ? `${configuration.layout.marginBottom}px`
      : `${defaultMarginBottom.value}px`,
}));
const getGridClasses = () => {
  return gridClassFor({ mobile: 1, tablet: 12, desktop: 12 }, [gridGapClass.value ?? '', 'items-start']);
};

const getColumnClasses = (colIndex: number) => {
  const columnWidth = configuration.columnWidths[colIndex];
  const classes = [`col-span-${columnWidth}`];

  if (Array.isArray(configuration.sticky) && configuration.sticky.includes(colIndex)) {
    classes.push('md:sticky');

    const topValue = route.meta?.type === 'product' ? 'md:top-40' : 'md:top-5';
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

const COLUMN_COLORS = ['#4285F4', '#34A853', '#9C59D1', '#F4791F', '#E8394A', '#00ACC1', '#7B6E27'];

const getColumnIndicatorStyle = (colIndex: number) => {
  if (!enableActions.value || !shouldEnableEditorFeatures.value) return {};
  const color = COLUMN_COLORS[colIndex % COLUMN_COLORS.length];
  return { borderTop: `3px solid ${color}` };
};

const enableActions = computed(() => attrs.enableActions === true);

const blockHasData = (block: Block): boolean => !!block.content && Object.keys(block.content).length > 0;

const showOverlay = computed(
  () => (block: Block) =>
    enableActions.value && shouldEnableEditorFeatures.value && !isDragging.value && blockHasData(block),
);

const onEmptyColumnClick = (colIndex: number) => {
  const columnUuid = `empty-col-${colIndex}`;
  updateMultigridColumnUuid(columnUuid);
  openDrawerWithView('blocksList');
  visiblePlaceholder.value = { uuid: '', position: 'top' };
};

const isAlignable = (b: Block): b is AlignableBlock =>
  typeof b.content === 'object' && b.content !== null && ('imageAlignment' in b.content || 'alignment' in b.content);

const readAlignment = (block: AlignableBlock): 'left' | 'right' | undefined => {
  const a = block.content?.imageAlignment ?? block.content?.alignment;
  return a === 'left' || a === 'right' ? a : undefined;
};

const pairWithSlots = computed<Block[]>(() => {
  const list = content.map((block) => ({ ...block }));

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
  const result: Block[][] = [];

  for (let i = 0; i < configuration.columnWidths.length; i++) {
    result[i] = [];
  }

  pairWithSlots.value.forEach((block) => {
    if (block.parent_slot !== undefined && result[block.parent_slot]) {
      result[block.parent_slot]!.push(block);
    }
  });

  return result;
});
</script>
