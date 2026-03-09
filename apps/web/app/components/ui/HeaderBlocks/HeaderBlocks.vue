<template>
  <BlocksStructureHeaderContainer :block="getHeaderContainerBlock()" />
</template>

<script setup lang="ts">
const { getHeaderContainerBlock } = useBlockTemplates();
</script>
