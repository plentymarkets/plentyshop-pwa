<template>
  <div v-if="blocks[activeId]?.type === 'slider'" class="site-settings-view sticky top-[52px]">
    Slider
    <UiAccordionItem
      v-model="blocksSpacingOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">Blocks spacing</h2>
      </template>
      <div v-for="(slide, key) in blocks[activeId].data as SliderDataItem[]" :key="key" class="border-b py-1">
        <SfTextarea v-model="slide.desktopImage" class="w-full block" cols="10" />
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { SfTextarea } from '@storefront-ui/vue';
import type { SliderDataItem } from '~/composables/useBlocks';

const { data: blocks, activeId } = useBlocks();

const blocksSpacingOpen = ref(false);
</script>
