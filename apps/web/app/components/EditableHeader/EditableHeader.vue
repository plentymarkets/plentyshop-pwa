<template>
  <div v-if="isAllSticked" class="sticky top-0 w-full z-50">
    <div class="w-full bg-blue-400 text-center py-2">
      test 1
      <button class="ml-4 px-2 py-0.5 bg-white/30 rounded text-sm" @click="$emit('toggle-all')">
        toggle all
      </button>
    </div>
    <div class="w-full bg-red-500 text-center py-2">
      test 2
    </div>
  </div>
  <template v-else>
    <div :class="isStickedTop ? 'sticky top-0 w-full z-50' : ''">
      <div class="w-full bg-red-600 text-center py-2">
        top
        <button class="ml-4 px-2 py-0.5 bg-white/30 rounded text-sm" @click="$emit('toggle-top')">
          {{ isStickedTop ? 'unstick' : 'stick' }}
        </button>
        <button class="ml-4 px-2 py-0.5 bg-white/30 rounded text-sm" @click="$emit('toggle-all')">
          toggle all
        </button>
      </div>
    </div>
    <div :class="isStickedBottom ? 'sticky top-0 w-full z-50' : ''">
      <div class="w-full bg-green-600 text-center py-2">
        bottom
        <button class="ml-4 px-2 py-0.5 bg-white/30 rounded text-sm" @click="$emit('toggle-bottom')">
          {{ isStickedBottom ? 'unstick' : 'stick' }}
        </button>
        <button class="ml-4 px-2 py-0.5 bg-white/30 rounded text-sm" @click="$emit('toggle-all')">
          toggle all
        </button>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { EditableHeaderProps } from './types';

defineProps<EditableHeaderProps>();
defineEmits(['toggle-all', 'toggle-top', 'toggle-bottom']);
</script>