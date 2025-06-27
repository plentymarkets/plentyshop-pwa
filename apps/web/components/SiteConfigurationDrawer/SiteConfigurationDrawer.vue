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
    <!--      TODO: remove once all settings are moved to new structure-->
    <component :is="getDrawerView(drawerView)" v-if="drawerView" />

    <component :is="viewComponent" v-else-if="viewComponent" />
  </SfDrawer>
</template>

<script setup lang="ts">
import type { SfDrawerPlacement } from '@storefront-ui/vue';
import { SfDrawer } from '@storefront-ui/vue';
import { getViewComponent } from '~/utils/settings-groups';

const { drawerOpen, drawerView, placement, activeSetting } = useSiteConfiguration();

const getDrawerView = (view: string) => {
  if (view === 'PagesView') return resolveComponent('PagesView');
  if (view === 'SettingsView') return resolveComponent('SettingsView');
  if (view === 'SeoView') return resolveComponent('SeoView');
  if (view === 'blocksList') return resolveComponent('BlocksNavigation');
  if (view === 'blocksSettings') return resolveComponent('BlockEditView');
};

const viewComponent = computed(() => getViewComponent(activeSetting.value));
</script>
