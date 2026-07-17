<template>
  <footer
    data-testid="footer"
    class="pt-10"
    :style="{
      backgroundColor: props.configuration?.colors?.background,
      color: props.configuration?.colors?.text,
    }"
  >
    <div
      v-for="contentBlock in props.content"
      :key="contentBlock.meta.uuid"
      :class="{ 'px-4 @md:px-6 pb-10 max-w-screen-3xl mx-auto': contentBlock.name === 'MultiGrid' }"
    >
      <slot name="content" :content-block="contentBlock" />

      <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(contentBlock.meta.uuid, 'bottom', drawerOpen, drawerView)" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { FooterContainerProps } from '~/components/blocks/structure/FooterContainer/types';

const props = defineProps<FooterContainerProps>();

const { shouldDisplayPlaceholder } = useBlockManager();

const { siteConfigurationDrawerOpen, siteConfigurationDrawerView } = useSiteConfiguration();

const drawerOpen = computed(() => siteConfigurationDrawerOpen.value);
const drawerView = computed(() => siteConfigurationDrawerView.value);
</script>

<style scoped>
:deep([data-testid='multi-grid-column']) {
  @apply break-words;
}

:deep([data-testid='multi-grid-column'] .rte-prose a) {
  @apply no-underline;
}

:deep([data-testid='multi-grid-column'] .rte-prose a:hover) {
  @apply underline;
}
</style>
