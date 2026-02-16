<template>
  {{ props.content.text.htmlDescription }}
</template>

<script setup lang="ts">
import type { AnnouncementBarProps } from './types';

const props = defineProps<AnnouncementBarProps>();
</script>