<template>
  <div data-testid="multi-grid-structure" :class="getGridClasses()">
    <div v-for="(column, colIndex) in content" :key="column.meta.uuid" :class="getColumnClasses(colIndex)">
      <component :is="getBlockComponent(alignedContent[colIndex].name)" v-bind="alignedContent[colIndex]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MultiGridProps, AlignableBlock } from '~/components/blocks/structure/MultiGrid/types';
import type { Block } from '@plentymarkets/shop-api';

const { content, configuration } = defineProps<MultiGridProps>();

const modules = import.meta.glob('@/components/**/blocks/**/*.vue') as Record<
  string,
  () => Promise<{ default: unknown }>
>;

const getBlockComponent = (blockName: string) => {
  if (!blockName) return null;
  const regex = new RegExp(`/${blockName}\\.vue$`, 'i');
  const matched = Object.keys(modules).find((path) => regex.test(path) && !/Form\.vue$/.test(path));
  return matched ? defineAsyncComponent(modules[matched]) : null;
};

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
