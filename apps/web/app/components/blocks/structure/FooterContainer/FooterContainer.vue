<template>
  <footer
    data-testid="footer-container"
    class="pt-10"
    :style="{
      backgroundColor: props.configuration?.colors?.background,
      color: props.configuration?.colors?.text,
    }"
  >
    <div class="footer-main px-4 md:px-6 pb-10 max-w-screen-3xl mx-auto">
      <div v-for="contentBlock in mainContent" :key="contentBlock.meta.uuid">
        <slot name="content" :content-block="contentBlock" />

        <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(contentBlock.meta.uuid, 'bottom', drawerOpen, drawerView)" />
      </div>
    </div>

    <div class="footer-footnote">
      <div v-for="contentBlock in fullWidthContent" :key="contentBlock.meta.uuid">
        <slot name="content" :content-block="contentBlock" />

        <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(contentBlock.meta.uuid, 'bottom', drawerOpen, drawerView)" />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';
import type { FooterContainerProps } from '~/components/blocks/structure/FooterContainer/types';

const props = defineProps<FooterContainerProps>();

const { shouldDisplayPlaceholder } = useBlockManager();

const { siteConfigurationDrawerOpen, siteConfigurationDrawerView } = useSiteConfiguration();

const drawerOpen = computed(() => siteConfigurationDrawerOpen.value);
const drawerView = computed(() => siteConfigurationDrawerView.value);

const isFullWidthBlock = (block: Block): boolean => (block.content as any)?.layout?.fullWidth === true;

const mainContent = computed(() => props.content?.filter((b) => !isFullWidthBlock(b)) ?? []);
const fullWidthContent = computed(() => props.content?.filter(isFullWidthBlock) ?? []);
</script>

<style scoped>
:deep([data-testid='multi-grid-column']) {
  @apply max-w-[280px] break-words;
}

:deep([data-testid='multi-grid-column'] .rte-prose p:not(:has(a))) {
  @apply m-0 ml-4 text-lg font-medium leading-7;
}

:deep([data-testid='multi-grid-column'] .rte-prose p:has(a)) {
  @apply m-0 py-2 px-4;
}

:deep([data-testid='multi-grid-column'] .rte-prose a) {
  @apply no-underline text-sm text-inherit;
}

:deep([data-testid='multi-grid-column'] .rte-prose a:hover) {
  @apply underline;
}
</style>
