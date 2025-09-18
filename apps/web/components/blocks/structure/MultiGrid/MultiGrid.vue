<template>
  <div data-testid="multi-grid-structure" :class="getGridClasses()" :style="gridInlineStyle">
    <div
      v-for="(column, colIndex) in columns"
      :key="colIndex"
      :class="getColumnClasses(colIndex)"
      class="group/col relative overflow-hidden"
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
          <UiBlockActions v-if="showOverlay(row)" :block="row" :index="colIndex" :actions="getBlockActions()" />
        </div>

        <slot name="content" :content-block="row" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MultiGridProps } from '~/components/blocks/structure/MultiGrid/types';
import type { Block } from '@plentymarkets/shop-api';

const { layout, content, configuration } = defineProps<MultiGridProps>();

const runtimeConfig = useRuntimeConfig();
const { $isPreview } = useNuxtApp();
const { isDragging } = useBlockManager();
const attrs = useAttrs() as { disableActions?: boolean; root?: boolean };

const gapClassMap: Record<string, string> = {
  None: 'gap-x-0',
  S: 'gap-x-1',
  M: 'gap-x-2',
  L: 'gap-x-3',
  XL: 'gap-x-5',
};
const gridGapClass = computed(() => gapClassMap[layout?.gap || 'M']);

const gridInlineStyle = computed(() => ({
  backgroundColor: layout?.backgroundColor ?? 'transparent',
  marginTop: layout?.marginTop !== undefined ? `${layout.marginTop}px` : undefined,
  marginBottom: layout?.marginBottom !== undefined ? `${layout.marginBottom}px` : undefined,
  marginLeft: layout?.marginLeft !== undefined ? `${layout.marginLeft}px` : undefined,
  marginRight: layout?.marginRight !== undefined ? `${layout.marginRight}px` : undefined,
}));

const getGridClasses = () => {
  const columnCount = configuration.columnWidths.length;
  return ['grid', gridGapClass.value, 'items-center', 'grid-cols-1', 'md:grid-cols-2', `lg:grid-cols-${columnCount}`];
};

const getColumnClasses = (colIndex: number) => {
  const columnCount = configuration.columnWidths.length;
  const isLastColumn = colIndex === columnCount - 1;
  const isThreeColumnLayout = columnCount === 3;
  const classes = [];
  if (isThreeColumnLayout && isLastColumn) {
    classes.push('md:col-span-2', 'lg:col-span-1');
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

const disableActions = computed(() => attrs.disableActions === true);

const blockHasData = (block: Block): boolean => !!block.content && Object.keys(block.content).length > 0;

const showOverlay = computed(
  () => (block: Block) =>
    Boolean(runtimeConfig.public.isDev) &&
    disableActions.value &&
    $isPreview &&
    !isDragging.value &&
    blockHasData(block),
);

const columns = ref([] as Block[][]);

content.forEach((block) => {
  if (block.parent_slot !== undefined) {
    if (!columns.value[block.parent_slot]) {
      columns.value[block.parent_slot] = [];
    }

    columns.value[block.parent_slot].push(block);
  }
});
</script>
