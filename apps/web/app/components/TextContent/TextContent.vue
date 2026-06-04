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
      :data-testid="props.testId ? 'text-html-' + props.testId : 'text-html'"
      :class="`rte-prose--${props.text?.textAlignment ?? 'left'}`"
      @click="handleRteClick"
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
const localePath = useLocalePath();
const router = useRouter();
const NuxtLink = resolveComponent('NuxtLink');

const renderedHtmlDescription = computed(() => {
  const html = decodeHtmlEntities(props.text?.htmlDescription);
  if (!html) return '';

  return html.replace(/<a\b([^>]*?)href=(["'])([^"']*?)\2/gi, (match, before, quote, href) => {
    if (isInternalLink(href, router)) {
      return `<a${before}href=${quote}${localePath(href)}${quote}`;
    }
    return match;
  });
});

const handleRteClick = (event: MouseEvent) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return;

  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const anchor = target.closest('a') as HTMLAnchorElement | null;
  if (!anchor) return;

  const href = anchor.getAttribute('href');
  if (!href || !isInternalLink(href, router)) return;
  if (anchor.target && anchor.target !== '_self') return;

  event.preventDefault();
  router.push(href);
};

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
