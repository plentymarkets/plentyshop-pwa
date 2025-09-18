<template>
  <div data-testid="multi-grid-structure" :class="getGridClasses()" :style="gridInlineStyle">
    <div
      v-for="(column, colIndex) in alignedContent"
      :key="column.meta.uuid"
      :class="getColumnClasses(colIndex)"
      class="group/col relative overflow-hidden"
    >
      <div
        v-if="showOverlay(column)"
        class="pointer-events-none absolute inset-0 opacity-0 group-hover/col:opacity-100"
        style="box-shadow: inset 0 0 0 2px #7c3aed"
      />

      <div
        v-if="showOverlay(column)"
        class="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover/col:opacity-100 bg-purple-600/15"
      />

      <div
        class="absolute inset-0 z-30 flex items-center justify-center opacity-0 invisible pointer-events-none"
        :class="
          showOverlay(column)
            ? 'group-hover/col:opacity-100 group-hover/col:visible group-hover/col:pointer-events-auto'
            : ''
        "
      >
        <UiBlockActions v-if="showOverlay(column)" :block="column" :index="colIndex" :actions="getBlockActions()" />
      </div>
      <slot name="content" :content-block="column" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MultiGridProps, AlignableBlock } from '~/components/blocks/structure/MultiGrid/types';
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

const { getSetting: getBlockSize } = useSiteSettings('blockSize');

const { gridInlineStyle } = useMultiGridHelper(layout, getBlockSize);

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

const alignBlock = computed<AlignableBlock | undefined>(
  () =>
    content.find(
      (block: Block) =>
        typeof block.content === 'object' &&
        block.content !== null &&
        ('imageAlignment' in block.content || 'alignment' in block.content),
    ) as AlignableBlock | undefined,
);

const alignment = computed<string>(
  () => alignBlock.value?.content?.imageAlignment ?? alignBlock.value?.content?.alignment ?? 'left',
);

const alignedContent = computed<AlignableBlock[]>(() => {
  if (!alignBlock.value || content.length < 2) return content as AlignableBlock[];
  if (alignment.value === 'right' && content[0] === alignBlock.value) {
    const swapped = [...content] as AlignableBlock[];
    [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
    return swapped;
  }
  if (alignment.value === 'left' && content[0] !== alignBlock.value) {
    const swapped = [...content] as AlignableBlock[];
    const idx = swapped.indexOf(alignBlock.value);
    [swapped[0], swapped[idx]] = [swapped[idx], swapped[0]];
    return swapped;
  }
  return content as AlignableBlock[];
});
</script>
