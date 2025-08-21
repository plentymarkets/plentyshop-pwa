<template>
  <div
    data-testid="multi-grid-structure"
    class="grid grid-cols-1 gap-4 items-center"
    :class="`lg:grid-cols-${configuration.columnWidths.length}`"
  >
    <div
      v-for="(column, colIndex) in content"
      :key="column.meta.uuid"
      :class="`col-${configuration.columnWidths[colIndex]}`"
    >
      <component
        :is="getBlockComponent(column.name)"
        v-bind="column"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MultiGridProps } from '~/components/blocks/structure/MultiGrid/types';
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

type AlignableBlock = Block & {
  content?: {
    imageAlignment?: string;
    alignment?: string;
    [key: string]: unknown;
  };
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
