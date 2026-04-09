<template>
  <EditableBlocks v-if="footer" :blocks="[footer]" read-only />
</template>

<script setup lang="ts">
const { footer } = useBlocks();
</script>
