<template>
  <UiAccordionItem
    v-model="controlsOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>Controls</h2>
    </template>
    <div class="controls">
      <div class="mb-6 mt-4">
        <UiFormLabel class="mb-1">Slider Controls Color</UiFormLabel>
        <SfInput v-model="controls.color" type="text">
          <template #suffix>
            <label
              for="controls-color"
              :style="{ backgroundColor: controls.color }"
              class="border border-[#a0a0a0] rounded-lg cursor-pointer"
            >
              <input id="controls-color" v-model="controls.color" type="color" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { SfInput } from '@storefront-ui/vue';
import type { CarouselStructureProps } from './types';
const { getCarouselStructureByBlockUid } = useCarousel();
const { blockUuid } = useSiteConfiguration();
const carouselStructure = (getCarouselStructureByBlockUid(blockUuid.value) || {}) as CarouselStructureProps;
const controlsOpen = ref(true);
const controls = computed(() => carouselStructure.configuration.controls);
</script>
