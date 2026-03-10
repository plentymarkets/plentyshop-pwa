<template>
  <BlocksStructureHeaderContainer v-if="headerContainerCache" :block="headerContainerCache" />
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { headerContainerCache, clearHeaderContainerCache, fetchHeaderContainerBlock } = useBlockTemplates();
const { getCategoryTree } = useCategoryTree();

watch(
  () => nuxtApp.$i18n.locale.value,
  async () => {
    clearHeaderContainerCache();
    await Promise.all([fetchHeaderContainerBlock(), getCategoryTree()]);
  },
);
</script>
