<template>
  <div class="grid grid-flow-col gap-4" :class="`grid-cols-${content.length}`">
    <div v-for="(column, index) in content" :key="index" :class="`col-span-${configuration.columnWidths[index]}`">
      <slot name="content" :blo="column" />
    </div>
  </div>
</template>

<script setup lang="ts">

import {MultiColumnsProps} from "~/components/blocks/structure/MultiColumns/types";

const { content, index, configuration } = defineProps<MultiColumnsProps>();
</script>
