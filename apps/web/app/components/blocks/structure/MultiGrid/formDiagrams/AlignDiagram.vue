<template>
  <svg width="44" height="36" viewBox="0 0 44 36" aria-hidden="true">
    <rect x="5" :y="on ? 6 : 16" width="10" :height="on ? 24 : 14" fill="#1d5ec7" :opacity="on ? 1 : 0.55" rx="2" />
    <rect x="17" y="6" width="10" height="24" fill="#1d5ec7" rx="2" />
    <rect x="29" :y="on ? 6 : 11" width="10" :height="on ? 24 : 19" fill="#1d5ec7" :opacity="on ? 1 : 0.55" rx="2" />
    <line v-if="on" x1="3" y1="6" x2="41" y2="6" stroke="#1d5ec7" stroke-width="0.7" stroke-dasharray="2 2" />
    <line v-if="on" x1="3" y1="30" x2="41" y2="30" stroke="#1d5ec7" stroke-width="0.7" stroke-dasharray="2 2" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ on?: boolean }>();
</script>
