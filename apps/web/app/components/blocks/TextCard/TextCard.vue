<template>
  <div
    data-testid="text-card"
    :class="['w-full', 'flex', 'flex-col', 'items-start', 'space-y-4', textAlignmentClass]"
    :style="inlineStyle"
  >
    <TextContent :text="props.content.text" :button="props.content.button" :index="props.index" />
  </div>
</template>

<script setup lang="ts">
import type { TextCardProps } from './types';
import { normalizePadding } from '~/utils/normalize-padding';

/**
 * TextCard component with legacy padding support
 *
 * Handles legacy string-based padding values (e.g., "10", "20px") from older stored blocks.
 * Runtime migration to number-based padding is handled by normalizePadding() utility.
 *
 * @see normalizePadding() for backward compatibility details
 */
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
  // Runtime migration from legacy string-based padding to number-based
  const layout = normalizePadding(props.content.layout);

  return {
    backgroundColor: props.content.layout?.backgroundColor ?? 'transparent',
    paddingTop: `${layout.paddingTop}px`,
    paddingBottom: `${layout.paddingBottom}px`,
    paddingLeft: `${layout.paddingLeft}px`,
    paddingRight: `${layout.paddingRight}px`,
  };
});
</script>
