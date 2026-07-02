<template>
  <div
    :class="['space-y-4', textAlignmentClass]"
    :data-testid="props.testId ? 'text-content-' + props.testId : 'text-content'"
    :style="{ color: props.text?.color }"
    class="w-full"
  >
    <div
      v-if="props.text?.htmlDescription"
      :class="`rte-prose--${props.text?.textAlignment ?? 'left'}`"
      :data-testid="props.testId ? 'text-html-' + props.testId : 'text-html'"
      class="rte-prose rte-prose--render"
      @click="handleRteClick"
      v-html="renderedHtmlDescription"
    />

    <div v-if="props.button?.label && props.button?.link" :class="buttonContainerClasses">
      <UiButton
        :data-testid="props.testId ? 'text-button-' + props.testId : 'text-button'"
        :tag="NuxtLink"
        :to="
          isInternalLink(props.button.link, router)
            ? resolvePathTrailingSlash(localePath(props.button.link))
            : props.button.link
        "
        :variant="props.button.variant ?? 'primary'"
        class="mt-3 px-4 py-2 cursor-pointer"
      >
        {{ props.button.label }}
      </UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TextContentProps } from '~/components/TextContent/types';

const props = defineProps<TextContentProps>();
const localePath = useLocalePath();
const router = useRouter();
const NuxtLink = resolveComponent('NuxtLink');
const { currentProduct } = useProducts();
const { resolvePathTrailingSlash } = useUrlTrailingSlash();

const product = computed(() => props.product ?? currentProduct.value);

const renderedHtmlDescription = computed(() => {
  const html = decodeHtmlEntities(props.text?.htmlDescription);
  if (!html) return '';

  const localizedHtml = html.replace(/<a\b([^>]*?)href=(["'])([^"']*?)\2/gi, (match, before, quote, href) => {
    if (isInternalLink(href, router)) {
      return `<a${before}href=${quote}${resolvePathTrailingSlash(localePath(href))}${quote}`;
    }
    return match;
  });

  return replacePropertyPlaceholdersInHtml(localizedHtml, product.value);
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

const buttonContainerClasses = computed(() => {
  switch (props.button?.alignment) {
    case 'left':
      return 'flex justify-start';
    case 'right':
      return 'flex justify-end';
    default:
      return 'flex justify-center';
  }
});
</script>
