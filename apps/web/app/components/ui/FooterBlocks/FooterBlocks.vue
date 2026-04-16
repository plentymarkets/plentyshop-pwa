<template>
  <EditableBlocks v-if="footer" :has-enabled-actions="enableFooterActionsOnlyForIndex" :blocks="[footer]" read-only />
</template>

<script setup lang="ts">
const { footer } = useBlocks();
const route = useRoute();

const enableFooterActionsOnlyForIndex = computed(() => {
  return route.meta.identifier === 'index';
});
</script>
