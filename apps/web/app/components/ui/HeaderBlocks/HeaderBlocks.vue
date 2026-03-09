<template>
  <BlocksStructureHeaderContainer :block="getHeaderContainerBlock()" />
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { getHeaderContainerBlock } = useBlockTemplates('index', 'immutable', nuxtApp.$i18n.locale.value);
</script>
