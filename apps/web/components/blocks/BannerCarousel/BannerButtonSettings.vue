<!-- eslint-disable vue/no-mutating-props -->
<template>
  <UiAccordionItem
    v-model="buttonOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2 data-testid="slider-button-group-title">Button</h2>
    </template>

    <div class="images">
      <div class="mb-6 mt-4">
        <label>
          <UiFormLabel class="mb-1">Label</UiFormLabel>
          <SfInput
            v-model="banner.content.button.label"
            data-testid="slider-button-label"
            name="label"
            type="text"
            placeholder="Button"
          />
        </label>
      </div>

      <div class="mb-6">
        <UiFormLabel class="mb-1">Link Target</UiFormLabel>
        <SfInput
          v-model="banner.content.button.link"
          name="link"
          data-testid="slider-button-link"
          type="text"
          placeholder="Enter URL here"
        />
      </div>

      <div class="mb-6">
        <UiFormLabel class="mb-1">Variant</UiFormLabel>
        <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <div
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': banner.content.button.variant === 'primary',
            }"
            data-testid="slider-button-primary"
            @click="banner.content.button.variant = 'primary'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.button.variant !== 'primary' }" />
            Primary
          </div>

          <div
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': banner.content.button.variant === 'secondary',
            }"
            data-testid="slider-button-secondary"
            @click="banner.content.button.variant = 'secondary'"
          >
            <SfIconCheck
              class="mr-1 w-[1.1rem]"
              :class="{ invisible: banner.content.button.variant !== 'secondary' }"
            />
            Secondary
          </div>
        </div>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { SfInput, SfIconCheck } from '@storefront-ui/vue';
import type { BannerProps } from './types';
defineProps<{
  banner: BannerProps;
}>();
const buttonOpen = ref(true);
</script>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
