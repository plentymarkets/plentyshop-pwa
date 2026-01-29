<template>
  <div
    data-testid="text-content"
    class="w-full"
    :style="{ color: props.text?.color }"
    :class="['space-y-4', textAlignmentClass]"
  >
    <div
      v-if="config.enableRichTextEditorV2 && props.text?.htmlDescription"
      class="rte-prose rte-prose--render"
      :class="`rte-prose--${props.text?.textAlignment ?? 'left'}`"
      v-html="props.text.htmlDescription"
    />

    <template v-else>
      <div
        v-if="props.text?.pretitle"
        data-testid="text-pretitle"
        class="text-xl font-bold mb-2"
        v-html="props.text.pretitle"
      />

      <h1
        v-if="props.text?.title && props.index === 0"
        data-testid="text-title"
        class="typography-display-3 md:typography-display-2 lg:typography-display-1 font-bold my-2 lg:leading-[4rem]"
        v-html="props.text.title"
      />

      <h2
        v-else-if="props.text?.title"
        data-testid="text-title"
        class="text-2xl font-semibold mb-4"
        v-html="props.text.title"
      />

      <div
        v-if="props.text?.subtitle"
        data-testid="text-subtitle"
        class="text-lg font-semibold"
        v-html="props.text.subtitle"
      />

      <div
        v-if="props.text?.htmlDescription"
        data-testid="text-html"
        class="text-base"
        v-html="props.text.htmlDescription"
      />
    </template>

    <UiButton
      v-if="props.button?.label && props.button?.link"
      :tag="NuxtLink"
      :to="localePath(props.button.link)"
      :variant="props.button.variant ?? 'primary'"
      data-testid="text-button"
      class="mt-3 px-4 py-2"
    >
      {{ props.button.label }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import type { TextContentProps } from '~/components/TextContent/types';

const props = defineProps<TextContentProps>();

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
const config = useRuntimeConfig().public;

const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');
</script>
