<template>
  <EditableBlocks v-if="!$route.meta.isBlockified && footerBlock" :blocks="[footerBlock]" minimal />
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { footerCache, createDefaultFooterBlock } = useCategoryTemplate('index', 'immutable', nuxtApp.$i18n.locale.value);

const footerBlock = computed(() => footerCache.value || createDefaultFooterBlock());
</script>
