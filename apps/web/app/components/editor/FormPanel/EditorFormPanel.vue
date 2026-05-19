<template>
  <div>
    <button
      type="button"
      class="w-full flex items-center text-left gap-1.5 px-3.5 py-2 cursor-pointer bg-editor-surface border-t border-b border-editor-border select-none"
      :aria-expanded="internalValue"
      :aria-controls="panelId"
      @click="internalValue = !internalValue"
    >
      <span class="flex-1 text-2xs font-bold text-editor-text-subtle tracking-wider uppercase">
        <slot name="title">{{ title }}</slot>
      </span>
      <SfIconExpandMore
        size="xs"
        class="text-editor-text-placeholder transition-transform duration-200"
        :class="internalValue ? 'rotate-0' : '-rotate-90'"
      />
    </button>
    <div v-if="internalValue" :id="panelId" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconExpandMore } from '@storefront-ui/vue';
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    title?: string;
    modelValue?: boolean;
    contentClass?: string;
  }>(),
  {
    title: '',
    modelValue: true,
    contentClass: 'px-3.5 py-3',
  },
);

const emit = defineEmits(['update:modelValue']);
const internalValue = useVModel(props, 'modelValue', emit, { passive: true });
const panelId = `editor-panel-${useId()}`;
</script>
