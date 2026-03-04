<template>
  <EditableBlocks v-if="!$route.meta.isBlockified && footerBlock" :blocks="[footerBlock]" read-only />
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { getFooterBlock } = useBlockTemplates('index', 'immutable', nuxtApp.$i18n.locale.value);
const footerBlock = computed(() => getFooterBlock());
</script>
