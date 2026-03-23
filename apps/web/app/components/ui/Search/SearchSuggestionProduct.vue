<template>
  <li>
    <NuxtLink :to="item.url" class="border border-neutral-200 rounded-md h-full flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-center aspect-[3/2]">
          <NuxtImg :src="item.image" :alt="item.imageAlt" class="object-contain rounded-md w-full h-full" />
        </div>
        <hr class="h-px bg-neutral-200 border-0" />
        <div class="px-2 pt-2">
          <div class="text-sm font-medium text-neutral-900 line-clamp-2">{{ item.label }}</div>
        </div>
      </div>
      <div class="text-sm px-2 pb-2 flex flex-wrap gap-x-2 items-center">
        <span class="text-gray-900 font-semibold">{{ item.price.formatted }}</span>
        <span
          v-if="item.crossedPrice && item.crossedPrice !== item.price && item.crossedPrice.value !== 0"
          class="text-neutral-500 text-xs line-through"
          >{{ item.crossedPrice.formatted }}</span
        >
      </div>
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
import type { SearchSuggestionProductProps } from './types';

defineProps<SearchSuggestionProductProps>();
</script>
