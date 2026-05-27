<template>
  <div class="px-4 md:px-6 lg:px-8 2xl:px-0" :style="outerBackgroundStyle">
    <div
      data-testid="multi-grid-structure"
      :class="[getGridClasses(), gridContainerClasses]"
      :style="gridInlineStyle"
    >
      <div
        v-for="(column, colIndex) in columns"
        :key="colIndex"
        :class="getColumnClasses(colIndex)"
        class="group/col relative"
        data-testid="multi-grid-column"
      >
        <div
          v-for="row in column"
          :key="row.meta.uuid"
          class="group/row relative"
          :data-uuid="row.meta.uuid"
          @mouseenter="onRowEnter(row)"
          @mouseleave="onRowLeave"
        >
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
                <UiBlockActions :block="row" :index="colIndex" :actions="getBlockActions()" />
              </div>
            </template>
          </ClientOnly>

          <slot
            name="content"
            :content-block="row"
            :column-length="column.length"
            :is-row-hovered="showOverlay(row) && isRowHovered(row)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlignableBlock, MultiGridProps } from '~/components/blocks/structure/MultiGrid/types';
import type { Block } from '@plentymarkets/shop-api';

const { content, configuration } = defineProps<MultiGridProps>();

const hoveredRowUuid = ref<string | null>(null);
const onRowEnter = (row: Block) => {
  hoveredRowUuid.value = row.meta.uuid;
};
const onRowLeave = () => {
  hoveredRowUuid.value = null;
};
const isRowHovered = (row: Block) => hoveredRowUuid.value === row.meta.uuid;

const { $isPreview } = useNuxtApp();
const { isDragging } = useBlockManager();
const attrs = useAttrs() as { enableActions?: boolean; root?: boolean };
const { getSetting: getBlockSize } = useSiteSettings('blockSize');
const blockSize = computed(() => getBlockSize());
const gapClassMap: Record<string, string> = {
  None: 'gap-0',
  S: 'gap-1 md:gap-2',
  M: 'gap-2 md:gap-4',
  L: 'gap-3 md:gap-6',
  XL: 'gap-4 md:gap-8',
};
const gridGapClass = computed(() => gapClassMap[configuration.layout?.gap || 'M']);

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

const viewport = useViewport();
const shouldStretchBackground = computed(() => Boolean(configuration.layout?.fullWidthBackground));

const isCategoryFilterLayout = computed(() => content.some((block) => block.name === 'SortFilter'));

const outerBackgroundStyle = computed(() => {
  if (!shouldStretchBackground.value) return {};

  const backgroundColor = configuration.layout?.backgroundColor ?? 'transparent';

  if (isCategoryFilterLayout.value && viewport.isLessThan('lg')) {
    return { width: '100%', backgroundColor };
  }

  return {
    width: '100vw',
    marginLeft: 'calc(50% - 50vw)',
    marginRight: 'calc(50% - 50vw)',
    backgroundColor,
  };
});

const gridContainerClasses = computed(() => {
  const classes = ['w-full'];

  if (shouldStretchBackground.value) {
    classes.push('max-w-screen-3xl', 'mx-auto');
  }

  return classes;
});

// FIX: Updated to include Padding styles
const gridInlineStyle = computed(() => {
  const useCompactHorizontalSpacing = isCategoryFilterLayout.value && viewport.isLessThan('lg');

  return {
    backgroundColor: shouldStretchBackground.value ? 'transparent' : configuration.layout?.backgroundColor ?? 'transparent',
    marginTop: configuration.layout?.marginTop !== undefined ? `${configuration.layout.marginTop}px` : '0px',
    marginBottom:
      configuration.layout?.marginBottom !== undefined
        ? `${configuration.layout.marginBottom}px`
        : `${defaultMarginBottom.value}px`,
    marginLeft: useCompactHorizontalSpacing
      ? '0px'
      : shouldStretchBackground.value
        ? 'auto'
        : configuration.layout?.marginLeft !== undefined
          ? `${configuration.layout.marginLeft}px`
          : '0px',
    marginRight: useCompactHorizontalSpacing
      ? '0px'
      : shouldStretchBackground.value
        ? 'auto'
        : configuration.layout?.marginRight !== undefined
          ? `${configuration.layout.marginRight}px`
          : '0px',
    paddingTop: configuration.layout?.paddingTop !== undefined ? `${configuration.layout.paddingTop}px` : '0px',
    paddingBottom: configuration.layout?.paddingBottom !== undefined ? `${configuration.layout.paddingBottom}px` : '0px',
    paddingLeft: useCompactHorizontalSpacing
      ? '0px'
      : configuration.layout?.paddingLeft !== undefined
        ? `${configuration.layout.paddingLeft}px`
        : '0px',
    paddingRight: useCompactHorizontalSpacing
      ? '0px'
      : configuration.layout?.paddingRight !== undefined
        ? `${configuration.layout.paddingRight}px`
        : '0px',
  };
});

const getGridClasses = () => {
  if (isCategoryFilterLayout.value) {
    return [
      'grid',
      'grid-cols-1',
      'lg:grid-cols-12',
      gridGapClass.value || 'gap-4',
      'items-start',
      'min-w-0',
      'max-lg:!mx-0',
    ];
  }

  const mobileColsSetting = configuration.layout?.mobileCols === 2 ? 2 : 1;
  const mobileGridClass = mobileColsSetting === 2 ? 'grid-cols-2' : 'grid-cols-1';

  return [
    'grid',
    mobileGridClass,
    'md:grid-cols-12',
    'lg:grid-cols-12',
    gridGapClass.value || 'gap-4',
    'items-start',
  ];
};

const categoryColSpanMap: Record<number, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
};

const defaultColSpanMap: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
  9: 'md:col-span-9',
  10: 'md:col-span-10',
  11: 'md:col-span-11',
  12: 'md:col-span-12',
};

const getColumnClasses = (colIndex: number) => {
  const rawWidth = configuration.columnWidths?.[colIndex];
  const columnWidth = rawWidth ? Number(rawWidth) : 12;

  if (isCategoryFilterLayout.value) {
    const desktopSpan = categoryColSpanMap[columnWidth] || 'lg:col-span-12';
    const classes = ['col-span-1', 'max-lg:col-span-1', 'max-lg:w-full', desktopSpan, 'min-w-0'];

    if (Array.isArray(configuration.sticky) && configuration.sticky.includes(colIndex)) {
      classes.push('lg:sticky', 'lg:top-40');
    }

    return classes;
  }

  const desktopSpan = defaultColSpanMap[columnWidth] || 'md:col-span-12';
  const classes = ['col-span-1', desktopSpan];

  if (Array.isArray(configuration.sticky) && configuration.sticky.includes(colIndex)) {
    classes.push('md:sticky', 'md:top-40');
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
</script>