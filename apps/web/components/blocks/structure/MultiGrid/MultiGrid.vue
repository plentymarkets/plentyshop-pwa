<template>
  <div class="grid grid-flow-col gap-4" :class="`grid-cols-${content.length}`">
    <div v-for="(column, index) in content" :key="index" :class="`col-${configuration.columnWidths[index]}`">
      <slot name="content" :blo="column" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MultiGridProps } from '~/components/blocks/structure/MultiGrid/types';

const { content, configuration } = defineProps<MultiGridProps>();
</script>
