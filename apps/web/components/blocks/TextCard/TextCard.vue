<template>
  <div data-testid="text-card" :class="['w-full', 'flex', 'flex-col', 'items-start', 'space-y-4', textAlignmentClass]"     :style="inlineStyle"
  >
    <TextContent :text="props.content.text" :button="props.content.button" :index="props.index" />
  </div>
</template>

<script setup lang="ts">
import type { TextCardProps } from './types';

const props = defineProps<TextCardProps>();

const textAlignmentClass = computed(() => {
  switch (props.content.text?.textAlignment) {
    case 'center':
      return 'text-center items-center';
    case 'right':
      return 'text-right items-end';
    default:
      return 'text-left items-start';
  }
});
const inlineStyle = computed(() => {
  const layout = props.content.layout || {};

  return {
    backgroundColor: layout.backgroundColor || 'transparent',
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
  };
});
</script>
