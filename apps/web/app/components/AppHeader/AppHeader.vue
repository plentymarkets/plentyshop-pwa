<template>
  <HeaderPrototype1 v-if="prototype === 'be-driven'" />
  <HeaderPrototype2 v-else-if="prototype === 'fe-driven'" />
  <UiHeader v-else />
</template>

<script setup lang="ts">
const HeaderPrototype1 = defineAsyncComponent(() => import('~/prototype-1-be-driven/blocks/Header/Header.vue'));
const HeaderPrototype2 = defineAsyncComponent(() => import('~/prototype-2-fe-driven/blocks/HeaderArea.vue'));

const prototype = computed(() => useRuntimeConfig().public.blockifiedHeaderPrototype);
</script>
