<template>
  <div
    :data-testid="props.testId ? 'text-content-' + props.testId : 'text-content'"
    class="w-full"
    :style="{ color: props.text?.color }"
    :class="['space-y-4', textAlignmentClass]"
  >
    <div
      v-if="props.text?.htmlDescription"
      class="rte-prose rte-prose--render"
      :class="`rte-prose--${props.text?.textAlignment ?? 'left'}`"
      v-html="renderedHtmlDescription"
    />

    <UiButton
      v-if="props.button?.label && props.button?.link"
      :tag="NuxtLink"
      :to="localePath(props.button.link)"
      :variant="props.button.variant ?? 'primary'"
      :data-testid="props.testId ? 'text-button-' + props.testId : 'text-button'"
      class="mt-3 px-4 py-2 cursor-pointer"
    >
      {{ props.button.label }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import type { TextContentProps } from '~/components/TextContent/types';

const props = defineProps<TextContentProps>();

const renderedHtmlDescription = computed(() => decodeHtmlEntities(props.text?.htmlDescription));
const renderedPretitle = computed(() => decodeHtmlEntities(props.text?.pretitle));
const renderedTitle = computed(() => decodeHtmlEntities(props.text?.title));
const renderedSubtitle = computed(() => decodeHtmlEntities(props.text?.subtitle));

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
