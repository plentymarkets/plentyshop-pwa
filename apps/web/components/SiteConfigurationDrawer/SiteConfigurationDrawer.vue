<template>
  <SfDrawer
    ref="drawerRef"
    v-model="drawerOpen"
    :placement="placement"
    :disable-click-away="true"
    :class="[
      'bg-neutral-50',
      'border',
      'border-gray-300',
      'z-[150]',
      { 'w-1/3 lg:w-1/4': placement === 'left' || placement === 'right' },
    ]"
  >
    <Component :is="drawerViewMap[drawerView]" v-if="drawerView" />
  </SfDrawer>
</template>

<script setup lang="ts">
import type { SfDrawerPlacement } from '@storefront-ui/vue';
import { SfDrawer } from '@storefront-ui/vue';
import SiteSettingsView from '~/components/SiteSettingsView/SiteSettingsView.vue';
import BlocksNavigation from '../BlocksNavigation/BlocksNavigation.vue';

const placement = ref<`${SfDrawerPlacement}`>('left');

const { drawerOpen, drawerView } = useSiteConfiguration();

const drawerViewMap: Record<string, Component> = {
  settings: SiteSettingsView,
  blocks: BlocksNavigation,
};
</script>
