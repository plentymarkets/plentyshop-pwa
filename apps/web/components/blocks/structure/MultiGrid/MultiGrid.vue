<template>
  <div data-testid="multi-grid-structure" :class="getGridClasses()">
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

const { content, configuration } = defineProps<MultiGridProps>();
const runtimeConfig = useRuntimeConfig();
const { $isPreview } = useNuxtApp();
const { isDragging } = useBlockManager();

const getBlockActions = () => {
  return {
    isEditable: true,
    isMovable: false,
    isDeletable: false,
    classes: ['bg-purple-400', 'hover:bg-purple-500', 'transition'],
    buttonClasses: ['border-2', 'border-purple-600'],
    hoverBackground: ['hover:bg-purple-500'],
  };
};

const attrs = useAttrs() as {
  disableActions?: boolean;
  root?: boolean;
};
const disableActions = computed(() => attrs.disableActions === true);
const blockHasData = (block: Block): boolean => {
  return !!block.content && Object.keys(block.content).length > 0;
};
const showOverlay = computed(
  () => (block: Block) =>
    Boolean(runtimeConfig.public.isDev) &&
    disableActions.value &&
    $isPreview &&
    !isDragging.value &&
    blockHasData(block),
);

const getGridClasses = () => {
  const columnCount = configuration.columnWidths.length;

  return ['grid', 'gap-4', 'items-center', 'grid-cols-1', 'md:grid-cols-2', `lg:grid-cols-${columnCount}`];
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

const columns = ref([] as Block[][]);

content.forEach((block) => {
  if (!columns.value[block.parent_slot]) {
    columns.value[block.parent_slot] = [];
  }

  columns.value[block.parent_slot].push(block);
});
</script>
