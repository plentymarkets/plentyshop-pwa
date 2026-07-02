<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2.5l1.7 5.3a3 3 0 0 0 1.9 1.9l5.3 1.7-5.3 1.7a3 3 0 0 0-1.9 1.9L12 20.4l-1.7-5.3a3 3 0 0 0-1.9-1.9L3.1 11.5l5.3-1.7a3 3 0 0 0 1.9-1.9z"
      fill="currentColor"
    />
  </svg>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ size?: number }>(), { size: 14 });
</script>
