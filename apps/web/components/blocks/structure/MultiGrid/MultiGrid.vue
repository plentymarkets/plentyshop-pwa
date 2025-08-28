<template>
  <div class="grid isolate" :class="`lg:grid-cols-${configuration.columnWidths.length}`">
    <div
      v-for="(column, colIndex) in content"
      :key="column.meta.uuid"
      class="group/col relative overflow-hidden"
      :class="[`col-${configuration.columnWidths[colIndex]}`]"
    >
      <div
        v-if="blockHasData(column) && runtimeConfig.public.isDev"
        class="pointer-events-none absolute inset-0 opacity-0 group-hover/col:opacity-100"
        style="box-shadow: inset 0 0 0 2px #7c3aed"
      />

      <div
        v-if="blockHasData(column) && runtimeConfig.public.isDev"
        class="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover/col:opacity-100 bg-purple-600/15"
      />

      <div
        class="absolute inset-0 z-30 flex items-center justify-center opacity-0 invisible pointer-events-none"
        :class="
          blockHasData(column) && runtimeConfig.public.isDev
            ? 'group-hover/col:opacity-100 group-hover/col:visible group-hover/col:pointer-events-auto'
            : ''
        "
      >
        <UiBlockActions :block="column" :index="colIndex" :actions="getBlockActions()" />
      </div>
      <component
        :is="getBlockComponent(alignedContent[colIndex].name)"
        v-bind="alignedContent[colIndex]"
        class="relative z-0"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MultiGridProps, AlignableBlock } from '~/components/blocks/structure/MultiGrid/types';
import type { Block } from '@plentymarkets/shop-api';

const { content, configuration } = defineProps<MultiGridProps>();
const runtimeConfig = useRuntimeConfig();

const modules = import.meta.glob('@/components/**/blocks/**/*.vue') as Record<
  string,
  () => Promise<{ default: unknown }>
>;
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
const blockHasData = (block: Block): boolean => {
  return !!block.content && Object.keys(block.content).length > 0;
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
<style scoped></style>
