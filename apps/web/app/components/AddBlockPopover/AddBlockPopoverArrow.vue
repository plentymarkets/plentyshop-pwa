<template>
  <div
    v-if="position.opacity > 0"
    class="fixed z-popover w-3 h-3 bg-white pointer-events-none"
    :class="
      position.arrowDirection === 'down'
        ? 'border-b border-r border-editor-border'
        : 'border-t border-l border-editor-border'
    "
    :style="{
      left: `${position.arrowLeft}px`,
      top: `${position.arrowTop}px`,
      transform: 'translateX(-50%) rotate(45deg)',
      boxShadow: position.arrowDirection === 'down' ? '2px 2px 4px rgba(0,0,0,0.07)' : '-1px -1px 4px rgba(0,0,0,0.07)',
    }"
  />
</template>

<script setup lang="ts">
import type { PopoverPosition } from './types';

defineProps<{ position: PopoverPosition }>();
</script>
