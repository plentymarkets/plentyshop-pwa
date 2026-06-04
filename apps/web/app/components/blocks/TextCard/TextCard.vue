<template>
  <div
    data-testid="text-card"
    :class="[
      'w-full',
      'flex',
      'flex-col',
      'items-stretch',
      'space-y-4',
      textAlignmentClass,
      containsGoogleMapsEmbed ? 'text-card--map-bleed max-lg:!pl-0 max-lg:!pr-0' : '',
    ]"
    :style="inlineStyle"
  >
    <TextContent :text="props.content.text" :button="props.content.button" :index="props.index" />
  </div>
</template>

<script setup lang="ts">
import type { TextCardProps } from './types';
import { hasGoogleMapsEmbed as htmlHasGoogleMapsEmbed } from '~/utils/parseGoogleMapsHtml';

const props = defineProps<TextCardProps>();

const containsGoogleMapsEmbed = computed(() => htmlHasGoogleMapsEmbed(props.content.text?.htmlDescription));

const textAlignmentClass = computed(() => {
  switch (props.content.text?.textAlignment) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
});
const inlineStyle = computed(() => {
  const layout = props.content.layout || {};

  const style: Record<string, string | number> = {
    backgroundColor: layout.backgroundColor ?? 'transparent',
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
  };

  if (containsGoogleMapsEmbed.value) {
    style['--text-card-pl'] = layout.paddingLeft ? `${layout.paddingLeft}px` : '0px';
    style['--text-card-pr'] = layout.paddingRight ? `${layout.paddingRight}px` : '0px';
    return style;
  }

  style.paddingLeft = layout.paddingLeft ? `${layout.paddingLeft}px` : 0;
  style.paddingRight = layout.paddingRight ? `${layout.paddingRight}px` : 0;

  return style;
});
</script>

<style scoped>
@media (max-width: 1023px) {
  [data-testid='text-card'].text-card--map-bleed {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}

@media (min-width: 1024px) {
  [data-testid='text-card'].text-card--map-bleed {
    padding-left: var(--text-card-pl, 0);
    padding-right: var(--text-card-pr, 0);
  }
}
</style>
