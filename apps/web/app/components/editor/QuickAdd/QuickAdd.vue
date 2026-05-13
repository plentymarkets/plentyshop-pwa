<template>
  <div v-if="options.length" class="grid grid-cols-3 gap-1.5 px-4 pt-3">
    <button
      v-for="option in options"
      :key="option.blockName"
      :data-testid="`quick-add-${option.blockName}`"
      class="px-1 pt-2 pb-1.5 rounded-lg border border-editor-border bg-white cursor-pointer flex flex-col items-center gap-1.5 hover:bg-editor-toc-hover hover:border-editor-accent-border-hover transition-all duration-150"
      @click="$emit('add', option)"
    >
      <div class="shrink-0 w-5 h-5">
        <span
          v-if="getBlockIconSvg(option.blockName)"
          class="block w-5 h-5 [&>svg]:w-full [&>svg]:h-full"
          v-html="getBlockIconSvg(option.blockName)"
        />
        <NuxtImg v-else :src="defaultBlockIcon" class="w-5 h-5" />
      </div>
      <span class="text-3xs text-editor-text-subtle text-center truncate w-full">{{ option.label }}</span>
    </button>
  </div>
</template>
 
<script setup lang="ts">
import { getBlockIconSvg } from '~/utils/blocks/block-icons';
import defaultBlockIcon from '~/assets/icons/paths/block-default-icon.svg';
import type { QuickAddOption } from './types';

defineProps<{
  options: QuickAddOption[];
}>();

defineEmits<{
  add: [option: QuickAddOption];
}>();
</script>
