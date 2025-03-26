<template>
    <UiAccordionItem
      v-model="localOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <!-- Accordion Header -->
      <template #summary>
        <h2>Controls</h2>
      </template>
  
      <!-- Accordion Body -->
      <div class="controls">
        <div class="mb-6 mt-4">
          <UiFormLabel class="mb-1">Slider Controls Color</UiFormLabel>
  
          <SfInput v-model="localColor" type="text">
            <template #suffix>
              <label
                for="controls-color"
                :style="{ backgroundColor: localColor }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input
                  id="controls-color"
                  v-model="localColor"
                  type="color"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </div>
      </div>
    </UiAccordionItem>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue';
  import { SfInput } from '@storefront-ui/vue';;
  
  const props = defineProps({
    open: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: '#ffffff',
    },
  });
  
  const emits = defineEmits(['update:open', 'update:color']);
  const localOpen = ref(props.open);
  const localColor = ref(props.color);
  
  watch(localOpen, (newVal) => {
    emits('update:open', newVal);
  });
  
  watch(localColor, (newVal) => {
    emits('update:color', newVal);
  });
  </script>
  