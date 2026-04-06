<template>
  <EditableBlocks v-if="footer" :blocks="[footer]" read-only is-root />
</template>

<script setup lang="ts">
const { footer } = useBlocks();
const footerBlock = computed(() => footer.value);
</script>
