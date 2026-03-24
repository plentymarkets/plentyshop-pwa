<template>
  <div class="py-2" data-testid="field-toggle">
    <div class="flex items-center justify-between">
      <UiFormLabel class="mb-1 flex items-center gap-1">
        <span>{{ label }}</span>

        <slot name="info" />
      </UiFormLabel>

      <SfSwitch
        :model-value="modelValue"
        :disabled="disabled"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';
import type { FieldToggleProps } from '~/components/ui/FieldToggle/types';

defineProps<FieldToggleProps>();

const emit = defineEmits(['update:modelValue']);
</script>
