<template>
  <div :class="headerBlocksClasses">
    <EditableBlocks v-if="headerBlock" :blocks="[headerBlock]" />
  </div>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { headerContainerCache, fetchHeaderContainerBlock } = useBlockTemplates(
  'index',
  'immutable',
  nuxtApp.$i18n.locale.value,
);

const headerBlock = computed(() => headerContainerCache.value);

const headerBlocksClasses = computed(() => [
  'header-blocks',
  { 'sticky top-0 z-50': headerBlock.value?.configuration?.layout?.sticky },
]);

watch(
  () => nuxtApp.$i18n.locale.value,
  async () => {
    await fetchHeaderContainerBlock(true);
  },
);
</script>
