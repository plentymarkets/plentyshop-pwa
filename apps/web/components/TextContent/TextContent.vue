<template>
  <div
    data-testid="text-content"
    :style="{ color: props.text?.color }"
    class="px-4 md:px-0"
    :class="['space-y-4', textAlignmentClass]"
  >
    <div v-if="text?.pretitle" data-testid="text-pretitle" class="text-xl font-bold mb-2" v-html="text.pretitle" />
    <h2 v-if="text?.title" data-testid="text-title" class="text-2xl font-semibold mb-4" v-html="text.title" />
    <div v-if="text?.subtitle" data-testid="text-subtitle" class="text-lg font-semibold" v-html="text.subtitle" />
    <div v-if="text?.htmlDescription" data-testid="text-html" class="text-base" v-html="text.htmlDescription" />
    <UiButton
      v-if="button?.label && button?.link"
      :tag="NuxtLink"
      :to="localePath(button?.link ?? '')"
      :variant="button?.variant ?? 'primary'"
      data-testid="text-button"
      class="mt-3 px-4 py-2"
    >
      {{ button?.label }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import type { TextContentProps } from '~/components/TextContent/types';

const props = defineProps<TextContentProps>();

const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');

const textAlignmentClass = computed(() => {
  switch (props.text?.textAlignment) {
    case 'center':
      return 'text-center items-center';
    case 'right':
      return 'text-right items-end';
    default:
      return 'text-left items-start';
  }
});
</script>
