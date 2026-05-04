<template>
  <footer
    data-testid="footer-container"
    :style="{
      backgroundColor: configuration?.colors?.background,
      color: configuration?.colors?.text,
    }"
  >
    <div v-for="contentBlock in content" :key="contentBlock.meta.uuid">
      <slot name="content" :content-block="contentBlock" />

      <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(contentBlock.meta.uuid, 'bottom', drawerOpen, drawerView)" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { FooterContainerProps } from '~/components/blocks/structure/FooterContainer/types';

const { content } = defineProps<FooterContainerProps>();

const { shouldDisplayPlaceholder } = useBlockManager();

const { siteConfigurationDrawerOpen, siteConfigurationDrawerView } = useSiteConfiguration();

const drawerOpen = computed(() => siteConfigurationDrawerOpen.value);
const drawerView = computed(() => siteConfigurationDrawerView.value);
</script>
