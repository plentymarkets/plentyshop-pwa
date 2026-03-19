<template>
  <BlocksStructureHeaderContainer :block="headerBlock" />
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { getHeaderContainerBlock, fetchHeaderContainerBlock } = useBlockTemplates(
  'index',
  'immutable',
  nuxtApp.$i18n.locale.value,
);

const headerBlock = computed(() => getHeaderContainerBlock());

watch(
  () => nuxtApp.$i18n.locale.value,
  async () => {
    await fetchHeaderContainerBlock(true);
  },
);
</script>
