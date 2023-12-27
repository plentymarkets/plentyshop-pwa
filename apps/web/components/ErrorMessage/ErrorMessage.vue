<template>
  <div v-if="message" class="text-negative-700 text-sm mt-2">
    {{ message }}
  </div>
</template>

<script setup>
const props = defineProps({
  message: String,
});
</script>
