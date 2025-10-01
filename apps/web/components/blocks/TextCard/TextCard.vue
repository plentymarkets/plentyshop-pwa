<template>
  <div
    data-testid="text-card"
    :class="[
      'flex',
      'flex-col',
      'items-start',
      'space-y-4',
      textAlignmentClass,
      shouldHideOverflow ? 'overflow-x-hidden' : '',
    ]"
    :style="inlineStyle"
  >
    <TextContent :text="props.content.text" :button="props.content.button" :index="props.index" />
  </div>
</template>

<script setup lang="ts">
import type { TextCardProps } from './types';

const props = defineProps<TextCardProps>();

const MAX_SAFE_MARGIN = 1000;

const shouldHideOverflow = computed(() => {
  const layout = props.content.layout || {};
  return Math.abs(layout.marginLeft || 0) > MAX_SAFE_MARGIN || Math.abs(layout.marginRight || 0) > MAX_SAFE_MARGIN;
});

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
    marginTop: layout.marginTop ? `${layout.marginTop}px` : 0,
    marginBottom: layout.marginBottom ? `${layout.marginBottom}px` : 0,
    marginLeft: layout.marginLeft ? `${layout.marginLeft}px` : 0,
    marginRight: layout.marginRight ? `${layout.marginRight}px` : 0,
  };
});
</script>
