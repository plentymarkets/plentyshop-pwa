<template>
  <EditableBlocks v-if="!$route.meta.isBlockified && footerBlock" :blocks="[footerBlock]" read-only />
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { footerBlock } = useFooterBlock(nuxtApp.$i18n.locale.value);
</script>
