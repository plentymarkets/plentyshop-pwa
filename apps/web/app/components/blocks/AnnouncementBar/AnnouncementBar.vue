<template>
  <div
    class="min-h-10 flex items-center justify-center rte-prose rte-prose--render"
    :style="inlineStyle"
    v-html="content.text"
  />
</template>

<script setup lang="ts">
import type { AnnouncementBarProps } from './types';

const props = defineProps<AnnouncementBarProps>();

const inlineStyle = computed(() => {
  const layout = props.configuration.layout || {};

  return {
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
    backgroundColor: layout.backgroundColor || 'transparent',
  };
});
</script>
