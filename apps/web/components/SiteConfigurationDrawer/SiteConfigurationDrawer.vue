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
      { 'w-1/2 lg:w-1/4': placement === 'left' || placement === 'right' },
    ]"
  >
    <component :is="getDrawerView(drawerView)" v-if="drawerView" />
  </SfDrawer>
</template>

<script setup lang="ts">
import type { SfDrawerPlacement } from '@storefront-ui/vue';
import { SfDrawer } from '@storefront-ui/vue';

const placement = ref<`${SfDrawerPlacement}`>('left');

const { drawerOpen, drawerView } = useSiteConfiguration();

const getDrawerView = (view: string) => {
  if (view === 'settings') return resolveComponent('SiteSettingsView');
  if (view === 'blocks') return resolveComponent('BlocksNavigation');
};
</script>
