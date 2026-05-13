<template>
  <div v-if="isEnabled && options.length" class="flex flex-wrap justify-center gap-1.5 px-4 pt-3">
    <button
      v-for="option in options"
      :key="option.blockName"
      :data-testid="`quick-add-${option.blockName}`"
      class="px-2 py-1 rounded-full border border-editor-border bg-white cursor-pointer flex items-center gap-1.5 hover:bg-editor-toc-hover hover:border-editor-accent-border-hover transition-all duration-150"
      @click="$emit('add', option)"
    >
      <div class="shrink-0 w-3.5 h-3.5">
        <span
          v-if="getBlockIconSvg(option.blockName)"
          class="block w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full"
          v-html="getBlockIconSvg(option.blockName)"
        />
        <NuxtImg v-else :src="defaultBlockIcon" class="w-3.5 h-3.5" />
      </div>
      <span class="text-3xs text-editor-text-subtle whitespace-nowrap">{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import defaultBlockIcon from '~/assets/icons/paths/block-default-icon.svg';
import type { QuickAddOption } from './types';

const isEnabled = useRuntimeConfig().public.enableQuickAdd;

defineProps<{
  options: QuickAddOption[];
}>();

defineEmits<{
  add: [option: QuickAddOption];
}>();
</script>
