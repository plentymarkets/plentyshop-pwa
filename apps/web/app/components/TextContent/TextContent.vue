<template>
  <div data-testid="text-content" class="space-y-4 w-full" :style="{ color: props.text?.color }">
    <!-- V2: single rich text -->
    <div
      v-if="isV2 && props.text?.htmlDescription"
      data-testid="text-rich"
      class="rte-prose"
      v-html="props.text.htmlDescription"
    />

    <!-- V1: legacy -->
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

    <!-- Button (same for both) -->
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

const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');

const hasLegacyFields = computed(() => {
  const t = props.text;
  return Boolean(t?.pretitle?.trim() || t?.title?.trim() || t?.subtitle?.trim());
});

const hasRich = computed(() => Boolean(props.text?.htmlDescription?.trim()));

const isV2 = computed(() => hasRich.value && hasLegacyFields.value);
</script>
