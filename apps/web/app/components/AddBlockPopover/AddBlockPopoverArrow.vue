<template>
  <div
    v-if="pos.opacity > 0"
    class="fixed z-[202] w-3 h-3 bg-white pointer-events-none"
    :class="pos.arrowDirection === 'down' ? 'border-b border-r border-[#e8e8e8]' : 'border-t border-l border-[#e8e8e8]'"
    :style="{
      left: `${pos.arrowLeft}px`,
      top: `${pos.arrowTop}px`,
      transform: 'translateX(-50%) rotate(45deg)',
      boxShadow: pos.arrowDirection === 'down' ? '2px 2px 4px rgba(0,0,0,0.07)' : '-1px -1px 4px rgba(0,0,0,0.07)',
    }"
  />
</template>

<script setup lang="ts">
import type { PopoverPosition } from './types';

defineProps<{ pos: PopoverPosition }>();
</script>
