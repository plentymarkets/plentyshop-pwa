<template>
  <div
    class="grid gap-4 isolate"
    data-testid="multi-grid-structure"
    :class="`lg:grid-cols-${configuration.columnWidths.length}`"
  >
    <div
      v-for="(column, colIndex) in content"
      :key="column.meta.uuid"
      class="relative overflow-hidden"
      :class="[
        `col-${configuration.columnWidths[colIndex]}`,
        hoveredIndex === colIndex ? 'border-2 border-purple-600' : '',
      ]"
      @mouseenter="hoveredIndex = colIndex"
      @mouseleave="hoveredIndex = null"
    >
      <div
        v-if="hoveredIndex === colIndex"
        class="absolute inset-0 bg-purple-400 opacity-20 transition-opacity duration-300 z-10 pointer-events-none"
      />

      <div v-if="hoveredIndex === colIndex" class="absolute inset-0 flex items-center justify-center z-30">
        <UiBlockActions
          v-if="hoveredIndex === colIndex"
          :block="column"
          :index="colIndex"
          :actions="getBlockActions()"
        />
      </div>
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
const hoveredIndex = ref<number | null>(null);
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
const getBlockComponent = (blockName: string) => {
  if (!blockName) return null;
  const regex = new RegExp(`/${blockName}\\.vue$`, 'i');
  const matched = Object.keys(modules).find((path) => regex.test(path) && !/Form\.vue$/.test(path));
  return matched ? defineAsyncComponent(modules[matched]) : null;
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
