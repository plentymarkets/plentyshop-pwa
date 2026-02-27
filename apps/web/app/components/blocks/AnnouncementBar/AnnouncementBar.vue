<template>
  <div class="min-h-10 flex items-center justify-center" :style="inlineStyle" v-html="content.text" />
</template>

<script setup lang="ts">
import type { AnnouncementBarProps } from './types';

const props = defineProps<AnnouncementBarProps>();

const inlineStyle = computed(() => {
  return { backgroundColor: props.content.backgroundColor || '#FFFFFF' };
});
</script>
