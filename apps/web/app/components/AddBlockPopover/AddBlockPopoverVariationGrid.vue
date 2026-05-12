<template>
  <div class="grid grid-cols-4 gap-[5px]">
    <button
      v-for="item in variations"
      :key="`${item.category.category}-${item.idx}`"
      :disabled="isVariationDisabled(item.category, item.variation)"
      class="flex flex-col items-center gap-[3px] py-2 px-1 rounded-[7px] border border-[#eee] bg-white transition-all duration-[120ms]"
      :class="
        isVariationDisabled(item.category, item.variation)
          ? 'opacity-40 cursor-not-allowed'
          : 'cursor-pointer hover:bg-[#f5f8ff] hover:border-[#c8d8ff]'
      "
      @click="$emit('select', item.category, item.idx)"
    >
      <span
        v-if="getBlockIconSvg(item.category.blockName)"
        class="w-5 h-5 flex-shrink-0 [&_svg]:w-full [&_svg]:h-full opacity-50"
        v-html="getBlockIconSvg(item.category.blockName)"
      />
      <span v-else class="w-5 h-5 rounded bg-[#f0f0f0] block flex-shrink-0" />
      <span class="text-[9px] text-[#777] leading-tight text-center break-words w-full line-clamp-2">
        {{ item.variation.title }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { BlockListCategory, BlockTemplateVariation } from '~/composables/useBlocksList/types';
import type { FlatVariation } from './types';
import { getBlockIconSvg } from '~/utils/blocks/block-icons';

defineProps<{
  variations: FlatVariation[];
  isVariationDisabled: (category: BlockListCategory, variation: BlockTemplateVariation) => boolean;
}>();

defineEmits<{
  select: [category: BlockListCategory, idx: number];
}>();
</script>
