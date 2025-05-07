<template>
  <SfDrawer
    ref="drawerRef"
    v-model="drawerOpen"
    :placement="placement as SfDrawerPlacement"
    :disable-click-away="true"
    :class="[
      'bg-neutral-50',
      'border-0',
      'border-gray-300',
      'z-[15]',
      { 'w-1/2 lg:w-1/4': placement === 'left' || placement === 'right' },
    ]"
  >
    <component :is="getDrawerView(drawerView)" v-if="drawerView" />
  </SfDrawer>
</template>

<script setup lang="ts">
import type { SfDrawerPlacement } from '@storefront-ui/vue';
import { SfDrawer } from '@storefront-ui/vue';

const { drawerOpen, drawerView, placement } = useSiteConfiguration();

const getDrawerView = (view: string) => {
  if (view === 'DesignView') return resolveComponent('DesignView');
  if (view === 'PagesView') return resolveComponent('PagesView');
  if (view === 'SettingsView') return resolveComponent('SettingsView');
  if (view === 'SeoView') return resolveComponent('SeoView');
  if (view === 'blocksList') return resolveComponent('BlocksNavigation');
  if (view === 'blocksSettings') return resolveComponent('BlockEditView');
};
</script>
