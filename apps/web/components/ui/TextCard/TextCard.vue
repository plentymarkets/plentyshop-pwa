<template>
  <div :class="['w-full', 'flex', 'flex-col', 'items-start', 'space-y-4', textAlignmentClass]">
    <TextContent :text="props.text" :button="props.button" />
  </div>
</template>

<script setup lang="ts">
import type { TextCardProps } from '~/components/ui/TextCard/types';

const props = defineProps<TextCardProps>();

const textAlignmentClass = computed(() => {
  switch (props.text?.textAlignment) {
    case 'center':
      return 'text-center items-center';
    case 'right':
      return 'text-right items-end';
    default:
      return 'text-left items-start';
  }
});
</script>
