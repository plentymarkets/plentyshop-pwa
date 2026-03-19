<template>
  <div data-testid="header-container">
    <div v-for="contentBlock in content" :key="contentBlock.meta.uuid">
      <slot name="content" :content-block="contentBlock" />

      <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(contentBlock.meta.uuid, 'bottom', drawerOpen, drawerView)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeaderContainerProps } from '~/components/blocks/structure/HeaderContainer/types';

const { content } = defineProps<HeaderContainerProps>();

const { shouldDisplayPlaceholder } = useBlockManager();

const { siteConfigurationDrawerOpen, siteConfigurationDrawerView } = useSiteConfiguration();

const drawerOpen = computed(() => siteConfigurationDrawerOpen.value);
const drawerView = computed(() => siteConfigurationDrawerView.value);
</script>
