<!-- @overrides-core-block -->
<template>
  <div class="flex flex-col space-y-4 border-l-4 border-red-600 pl-4">
    <div class="text-sm font-bold text-red-600 bg-red-50 p-2 rounded">
      ⚠️ This is a TEST OVERRIDE version of TextCard from test-blocks module
    </div>
    <FormField
      label="Text Content"
      hint="Configure the text displayed in this card"
    >
      <div class="text-xs text-gray-500">
        Pretitle, Title, Subtitle, and Description
      </div>
    </FormField>
    <FormField
      label="Button"
      hint="Optional call-to-action button"
    >
      <div class="text-xs text-gray-500">
        Label and link configuration
      </div>
    </FormField>
    <FormField
      label="Layout"
      hint="Background color and padding"
    >
      <div class="text-xs text-gray-500">
        Customize appearance
      </div>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import type { TextCardContent } from './types';

defineProps<{
  content: TextCardContent;
}>();

const emit = defineEmits<{
  'update:content': [content: TextCardContent];
}>();
</script>
