<template>
  <div v-if="isAllSticked" class="sticky top-0 w-full z-50">
    <div class="w-full bg-blue-400 text-center">
      test 1
    </div>
    <div class="w-full bg-red-500 text-center">
      test 2
    </div>
  </div>
  <template v-else>
   <div :class="isStickedTop ? 'sticky top-0 w-full z-50' : ''">
      <div class="w-full bg-red-600 text-center">
        top
      </div>
    </div>
    <div :class="isStickedBottom ? 'sticky top-0 w-full z-50' : ''">
      <div class="w-full bg-green-600 text-center">
        bottom
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { EditableHeaderProps } from './types';

defineProps<EditableHeaderProps>();
</script>