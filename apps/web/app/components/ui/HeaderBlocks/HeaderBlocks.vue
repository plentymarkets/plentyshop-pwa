<template>
  <div :class="headerBlocksClasses">
    <EditableBlocks v-if="headerBlock" :blocks="[headerBlock]" />
  </div>
</template>

<script setup lang="ts">
const { headerContainer } = useBlocks();

const headerBlock = computed(() => headerContainer.value);

const headerBlocksClasses = computed(() => [
  'header-blocks',
  { 'sticky top-0 z-50': (headerBlock.value?.configuration as Record<string, any>)?.layout?.sticky },
]);
</script>
