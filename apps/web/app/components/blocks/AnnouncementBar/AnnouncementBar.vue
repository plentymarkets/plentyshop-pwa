<template>
  <div class="min-h-10 h-full w-full flex items-center" :style="inlineStyle">
    <div class="rte-prose rte-prose--render w-full text-center px-20" v-html="props.content.text" />
  </div>
</template>

<script setup lang="ts">
import type { AnnouncementBarProps } from './types';

const props = defineProps<AnnouncementBarProps>();

const inlineStyle = computed(() => {
  return { backgroundColor: props.content.backgroundColor || '#FFFFFF' };
});
</script>
