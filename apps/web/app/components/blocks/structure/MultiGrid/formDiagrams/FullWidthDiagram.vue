<template>
  <svg width="44" height="36" viewBox="0 0 44 36" aria-hidden="true">
    <rect x="2" y="8" width="40" height="20" fill="#f5f5f5" rx="2" stroke="#e2e2e2" />
    <rect :x="on ? 2 : 9" y="11" :width="on ? 40 : 26" height="14" fill="#1d5ec7" :opacity="on ? 1 : 0.55" rx="2" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ on?: boolean }>();
</script>
