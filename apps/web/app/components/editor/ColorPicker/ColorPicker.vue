<script lang="ts" setup>
  const refVariable = ref('#000');
</script>

<template>
  <color-picker-block
    v-model="refVariable"
    with-hex-input
  />
</template>