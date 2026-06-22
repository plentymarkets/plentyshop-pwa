<!-- @overrides-core-block -->
<template>
  <div
    data-testid="text-card-override"
    :class="['w-full', 'flex', 'flex-col', 'space-y-4', textAlignmentClass, 'relative']"
    :style="inlineStyle"
  >
    <!-- TEST Badge to show this is the overridden version -->
    <div class="absolute -top-2 -left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
      TEST OVERRIDE
    </div>
    
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
    backgroundColor: layout.backgroundColor ?? 'transparent',
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
    borderLeft: '4px solid rgb(220, 38, 38)', // red-600 border to indicate override
  };
});
</script>
