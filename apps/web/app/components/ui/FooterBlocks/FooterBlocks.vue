<template>
  <EditableBlocks v-if="footer" :blocks="[footer]" read-only is-root />
</template>

<script setup lang="ts">
const { footer } = useBlocks();
</script>
