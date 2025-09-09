<template>
  <div class="grid isolate" :class="`lg:grid-cols-${configuration.columnWidths.length}`">
    <div
      v-for="(column, colIndex) in alignedContent"
      :key="column.meta.uuid"
      class="group/col relative overflow-hidden"
      :class="[`col-${configuration.columnWidths[colIndex]}`]"
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
