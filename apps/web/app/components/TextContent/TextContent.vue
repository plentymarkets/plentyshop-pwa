<template>
  <div
    data-testid="text-content"
    :style="{ color: props.text?.color }"
    :class="['w-full min-w-0', 'flex flex-col items-stretch space-y-4', textAlignmentClass]"
  >
    <div v-if="text?.pretitle" data-testid="text-pretitle" class="text-xl font-bold mb-2" v-html="text.pretitle" />

    <h1
      v-if="text?.title && index === 0"
      data-testid="text-title"
      class="typography-display-3 md:typography-display-2 lg:typography-display-1 font-bold my-2 lg:leading-[4rem]"
      v-html="text.title"
    />

    <h2
      v-if="text?.title && index !== 0"
      data-testid="text-title"
      class="text-2xl font-semibold mb-4"
      v-html="text.title"
    />

    <div v-if="text?.subtitle" data-testid="text-subtitle" class="text-lg font-semibold" v-html="text.subtitle" />
    <template v-if="htmlSegments.length">
      <template v-for="(segment, segmentIndex) in htmlSegments" :key="segmentIndex">
        <div
          v-if="segment.type === 'html' && segment.content"
          data-testid="text-html"
          class="text-base"
          v-html="segment.content"
        />
        <div v-else-if="segment.type === 'map'" class="block w-full min-w-0">
          <GoogleMapsConsent
            :embed-url="segment.embedUrl"
            :preview-url="segment.previewUrl"
            :width="segment.width"
            :height="segment.height"
          />
        </div>
      </template>
    </template>
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
import GoogleMapsConsent from '~/components/GoogleMapsConsent/GoogleMapsConsent.vue';
import type { TextContentProps } from '~/components/TextContent/types';
import { parseGoogleMapsHtml } from '~/utils/parseGoogleMapsHtml';

const props = defineProps<TextContentProps>();

const htmlSegments = computed(() => {
  const html = props.text?.htmlDescription;
  if (!html) return [];
  return parseGoogleMapsHtml(html);
});

const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');

const textAlignmentClass = computed(() => {
  switch (props.text?.textAlignment) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
});
</script>
