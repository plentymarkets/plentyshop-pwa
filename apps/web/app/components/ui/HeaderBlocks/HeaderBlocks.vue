<template>
  <BlocksStructureHeaderContainer v-if="headerContainerBlock" :block="headerContainerBlock" />
  <UiHeader v-else />
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { headerContainerCache } = useBlockTemplates('index', 'immutable', nuxtApp.$i18n.locale.value);
const headerContainerBlock = computed(() => headerContainerCache.value);
</script>
