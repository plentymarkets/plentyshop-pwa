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
    <component v-if="getViewComponent" :is="getViewComponent" />
    <!--      TODO: remove once all settings are moved to new structure-->
    <component :is="getDrawerView(drawerView)" v-else-if="drawerView" />
  </SfDrawer>
</template>

<script setup lang="ts">
import type { SfDrawerPlacement } from '@storefront-ui/vue';
import { SfDrawer } from '@storefront-ui/vue';

const { drawerOpen, drawerView, placement, activeSetting } = useSiteConfiguration();

const getDrawerView = (view: string) => {
  if (view === 'PagesView') return resolveComponent('PagesView');
  if (view === 'SettingsView') return resolveComponent('SettingsView');
  if (view === 'SeoView') return resolveComponent('SeoView');
  if (view === 'blocksList') return resolveComponent('BlocksNavigation');
  if (view === 'blocksSettings') return resolveComponent('BlockEditView');
};

const modules = import.meta.glob(`@/components/**/settings/**/*.vue`) as Record<
  string,
  () => Promise<{ default: unknown }>
>;

const getViewComponent = computed(() => {
  const key = Object.keys(modules).find(
    (p) => p.includes(`/settings/${activeSetting.value}/`) && p.endsWith('View.vue'),
  );
  return key ? defineAsyncComponent(modules[key]) : null;
});
</script>
