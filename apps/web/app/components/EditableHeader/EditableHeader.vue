<template>
  <!-- Both sticky: wrap in single sticky container -->
  <div v-if="isAllSticked" class="sticky top-0 w-full z-50">
    <slot name="top" />
    <slot name="middle" />
    <slot name="bottom" />
  </div>

  <!-- Individual control: each section independently sticky -->
  <template v-else>
    <div :class="isStickedTop ? 'sticky top-0 w-full z-50' : ''">
      <slot name="top" />
    </div>
    <div :class="isStickedMiddle ? 'sticky top-0 w-full z-50' : ''">
      <slot name="middle" />
    </div>
    <div :class="isStickedBottom ? 'sticky top-0 w-full z-50' : ''">
      <slot name="bottom" />
    </div>
  </template>
</template>


<script setup lang="ts">
import type { EditableHeaderProps } from './types';

defineProps<EditableHeaderProps>();
defineEmits(['toggle-all', 'toggle-top', 'toggle-bottom']);
</script>