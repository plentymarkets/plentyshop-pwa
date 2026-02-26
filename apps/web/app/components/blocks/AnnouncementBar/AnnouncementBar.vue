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

  return { backgroundColor: layout.backgroundColor || 'transparent' };
});
</script>
