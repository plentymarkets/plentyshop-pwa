<template>
  <span class="flex text-negative-700 text-sm mt-2">
    {{ message }}
  </span>
</template>

<script setup lang="ts">
defineProps({
  message: { type: String, required: true },
});
</script>
