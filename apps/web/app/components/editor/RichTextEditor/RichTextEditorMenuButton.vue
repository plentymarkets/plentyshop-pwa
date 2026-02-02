<template>
  <button
    type="button"
    class="w-8 h-8 rounded inline-flex items-center justify-center text-sm cursor-pointer"
    :class="active
      ? 'bg-slate-800 border border-gray-300 text-white hover:bg-slate-700'
      : 'bg-transparent border border-transparent text-gray-800 hover:bg-gray-100'"
    @mousedown.prevent
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    active?: boolean;
  }>(),
  {
    active: false,
  }
);
</script>