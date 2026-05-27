<template>
  <svg width="44" height="36" viewBox="0 0 44 36" aria-hidden="true">
    <rect x="10" y="3" width="24" height="12" :fill="on ? '#bbbbbb' : '#1d5ec7'" :opacity="on ? 0.55 : 1" rx="2" />
    <rect x="10" y="21" width="24" height="12" :fill="on ? '#1d5ec7' : '#bbbbbb'" :opacity="on ? 1 : 0.55" rx="2" />
    <path
      v-if="on"
      d="M16 14 L 16 22 M 13 19 L 16 22 L 19 19 M 28 22 L 28 14 M 25 17 L 28 14 L 31 17"
      stroke="#666666"
      stroke-width="1.2"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ on?: boolean }>();
</script>
