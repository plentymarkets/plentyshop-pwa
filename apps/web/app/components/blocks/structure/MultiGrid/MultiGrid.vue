<template>
  <div data-testid="multi-grid-structure" :class="getGridClasses()" :style="gridInlineStyle">
    <div
      v-for="(column, colIndex) in columns"
      :key="colIndex"
      :class="getColumnClasses(colIndex)"
      class="group/col relative overflow-hidden"
      data-testid="multi-grid-column"
    >
      <div v-for="row in column" :key="row.meta.uuid" class="group/row relative">
        <div
          v-if="showOverlay(row)"
          class="pointer-events-none absolute inset-0 opacity-0 group-hover/row:opacity-100"
          style="box-shadow: inset 0 0 0 2px #7c3aed"
        />

        <div
          v-if="showOverlay(row)"
          class="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover/row:opacity-100 bg-purple-600/15"
        />

        <div
          class="absolute inset-0 z-30 flex items-center justify-center opacity-0 invisible pointer-events-none"
          :class="
            showOverlay(row)
              ? 'group-hover/row:opacity-100 group-hover/row:visible group-hover/row:pointer-events-auto'
              : ''
          "
        >
          <UiBlockActions v-if="showOverlay(row)" :block="row" :index="colIndex" :actions="getBlockActions(row)" />
        </div>
        <h2>Multigrid UUID: {{ meta.uuid }}</h2>
        <slot name="content" :content-block="row" :parent-uuid="meta.uuid" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlignableBlock, MultiGridProps } from '~/components/blocks/structure/MultiGrid/types';
import type { Block } from '@plentymarkets/shop-api';

const { layout, content, configuration, meta } = defineProps<MultiGridProps>();
const { itemGridHeight } = useItemGridHeight(meta.uuid);
console.log('MultiGrid uuid', meta.uuid);
const { hasItemGridInColumns } = useBlockManager();
const { baselineTop, bottomValue, baselineScrollY, currentTop, attachScroll, detachScroll } = useScrollHandler(meta.uuid);

const { $isPreview } = useNuxtApp();
const { isDragging } = useBlockManager();
const attrs = useAttrs() as { enableActions?: boolean; root?: boolean };
const { getSetting: getBlockSize } = useSiteSettings('blockSize');
const blockSize = computed(() => getBlockSize());

const gapClassMap: Record<string, string> = {
  None: 'gap-x-0',
  S: 'gap-y-1 md:gap-x-1 md:gap-y-0',
  M: 'gap-y-2 md:gap-x-2 md:gap-y-0',
  L: 'gap-y-3 md:gap-x-3 md:gap-y-0',
  XL: 'gap-y-5 md:gap-x-5 md:gap-y-0',
};
const gridGapClass = computed(() => gapClassMap[layout?.gap || 'M']);

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

const gridInlineStyle = computed(() => ({
  backgroundColor: layout?.backgroundColor ?? 'transparent',
  marginTop: layout?.marginTop !== undefined ? `${layout.marginTop}px` : '0px',
  marginBottom: layout?.marginBottom !== undefined ? `${layout.marginBottom}px` : `${defaultMarginBottom.value}px`,
  marginLeft: layout?.marginLeft !== undefined ? `${layout.marginLeft}px` : '40px',
  marginRight: layout?.marginRight !== undefined ? `${layout.marginRight}px` : '40px',
}));

const getGridClasses = () => {
  return gridClassFor({ mobile: 1, tablet: 12, desktop: 12 }, [gridGapClass.value ?? '', 'items-start']);
};

const getColumnClasses = (colIndex: number) => {
  const columnWidth = configuration.columnWidths[colIndex];
  return [`col-span-${columnWidth}`];
};

const enableActions = computed(() => attrs.enableActions === true);

const blockHasData = (block: Block): boolean => !!block.content && Object.keys(block.content).length > 0;

const showOverlay = computed(
  () => (block: Block) => enableActions.value && $isPreview && !isDragging.value && blockHasData(block),
);

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
  const blocks = ref([] as Block[][]);
  pairWithSlots.value.forEach((block) => {
    if (block.parent_slot !== undefined) {
      if (!blocks.value[block.parent_slot]) {
        blocks.value[block.parent_slot] = [];
      }

      const slot = blocks.value[block.parent_slot];
      if (slot) {
        slot.push(block);
      }
    }
  });
  return blocks.value;
});

const containsItemGrid = computed(() => {
  return hasItemGridInColumns(columns.value);
});

const getBlockActions = (block: Block) => {
  if (block.name === 'ItemGrid') {
    return {
      isEditable: true,
      isMovable: false,
      isDeletable: false,
      classes: ['bg-purple-400', 'hover:bg-purple-500', 'transition'],
      buttonClasses: ['border-2', 'border-purple-600'],
      hoverBackground: ['hover:bg-purple-500'],
      position: `${currentTop.value}px`,
    };
  }

  return {
    isEditable: true,
    isMovable: false,
    isDeletable: false,
    classes: ['bg-purple-400', 'hover:bg-purple-500', 'transition'],
    buttonClasses: ['border-2', 'border-purple-600'],
    hoverBackground: ['hover:bg-purple-500'],
    position: '',
  };
};
watch(
  () => itemGridHeight.value,
  (newHeight) => {
    console.log('newHeight', newHeight);
    if (containsItemGrid.value && newHeight > 0) {
      const topValue = Math.min(newHeight * 0.05, 200);
      baselineTop.value = Math.round(topValue);
      const calculatedBottomValue = newHeight * 0.95;
      bottomValue.value = Math.round(calculatedBottomValue);
      baselineScrollY.value = typeof window !== 'undefined' ? window.scrollY : 0;
      currentTop.value = baselineTop.value;
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (containsItemGrid.value) attachScroll();
});

onUnmounted(() => {
  detachScroll();
});

watch(
  () => containsItemGrid.value,
  (has) => {
    if (has) attachScroll();
    else detachScroll();
  },
  { immediate: true },
);
</script>
