<template>
  <!-- TODO: Create a feature flag for the editable header -->
  <BlocksStructureHeaderContainer v-if="headerContainerCache" :block="headerContainerCache" />
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { headerContainerCache, clearHeaderContainerCache, fetchHeaderContainerBlock } = useBlockTemplates(
  'index',
  'immutable',
  nuxtApp.$i18n.locale.value,
);
const { getCategoryTree } = useCategoryTree();

onMounted(async () => {
  if (!headerContainerCache.value) await fetchHeaderContainerBlock();
});

watch(
  () => nuxtApp.$i18n.locale.value,
  async () => {
    clearHeaderContainerCache();
    await Promise.all([fetchHeaderContainerBlock(), getCategoryTree()]);
  },
);
</script>
