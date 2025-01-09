<template>
  <div :class="['w-full', 'flex', 'flex-col', 'items-start', 'p-5', 'space-y-4', textAlignmentClass]">
    <div v-if="props?.text?.pretitle" class="text-xl font-bold mb-2">{{ props.text.pretitle }}</div>
    <div v-if="props.text?.title" class="text-2xl font-semibold mb-4">{{ props.text.title }}</div>
    <div v-if="props.text?.subtitle" class="text-lg font-semibold">{{ props.text.subtitle }}</div>
    <div v-if="props.text?.htmlDescription" class="text-base" v-html="props.text.htmlDescription"></div>
    <UiButton
      v-if="props.button?.label && props.button.link"
      class="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      {{ props.button.label }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { TextCardProps } from '~/components/ui/TextCard/types';

const props = defineProps<TextCardProps>();

const textAlignmentClass = computed(() => {
  switch (props.text?.textAlignment) {
    case 'center': {
      return 'text-center items-center';
    }
    case 'right': {
      return 'text-right items-end';
    }
    default: {
      return 'text-left items-start';
    }
  }
});
</script>
