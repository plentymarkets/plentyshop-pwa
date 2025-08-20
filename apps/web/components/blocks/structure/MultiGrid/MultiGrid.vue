<template>
  <div
    data-testid="multi-grid-structure"
    class="grid grid-cols-1 gap-4 items-center"
    :class="`lg:grid-cols-${multiGridProps.configuration.columnWidths.length}`"
  >
    <div
      v-for="(col, index) in multiGridProps.configuration.columnWidths"
      :key="index"
      :class="`col-${col}`"
    >
      <component
        :is="getBlockComponent(multiGridProps.content?.[index]?.name)"
        v-if="multiGridProps.content?.[index] && getBlockComponent(multiGridProps.content[index].name)"
        v-bind="multiGridProps.content[index]"
      />
      <EmptyBlock v-else :parent="multiGridProps" :column-uuid="multiGridProps.content[index].meta.uuid" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MultiGridProps } from '~/components/blocks/structure/MultiGrid/types';
// import type { ImageTextProps } from '~/components/blocks/Image/types';
// import type { TextCardProps } from '~/components/blocks/TextCard/types';

const multiGridProps = defineProps<MultiGridProps>();
// console.log('MultiGrid props:', { type, name, content, configuration });

// Currently the alignment is not working

// const imageBlock = computed(() => (content.find((block) => block.name === 'Image') || {}) as ImageTextProps);
// const textCardBlock = computed(() => (content.find((block) => block.name === 'TextCard') || {}) as TextCardProps);
//
// const swap = (arr: unknown[], from: number, to: number) => {
//   arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
// };
//
// const alignment = computed(() => imageBlock?.value?.content?.imageAlignment || 'left');
//
// watch(
//   alignment,
//   () => {
//     if (alignment.value === 'right' && content[0]?.name === 'Image') {
//       swap(content, 0, 1);
//     }
//     if (alignment.value === 'left' && content[0]?.name !== 'Image') {
//       swap(content, 0, 1);
//     }
//   },
//   { immediate: true },
// );

// Auto-discover all block components (not forms)
const modules = import.meta.glob('@/components/**/blocks/**/*.vue') as Record<
  string,
  () => Promise<{ default: unknown }>
>;

// Dynamic block component resolver
const getBlockComponent = (blockName: string) => {
  if (!blockName) return null;
  // Exclude *Form.vue files
  const regex = new RegExp(`/${blockName}\\.vue$`, 'i');
  const matched = Object.keys(modules).find((path) => regex.test(path) && !/Form\.vue$/.test(path));
  return matched ? defineAsyncComponent(modules[matched]) : null;
};
</script>
