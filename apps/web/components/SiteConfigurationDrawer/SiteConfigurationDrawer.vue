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

    <div v-else-if="viewComponent">
      <Transition name="slide-cover" mode="out-in" appear>
        <component :is="viewComponent" :key="viewComponent" />
      </Transition>
    </div>
  </SfDrawer>
</template>

<script setup lang="ts">
import type { SfDrawerPlacement } from '@storefront-ui/vue';
import { SfDrawer } from '@storefront-ui/vue';

const { drawerOpen, drawerView, placement, activeSetting, activeSubCategory } = useSiteConfiguration();

const getDrawerView = (view: string) => {
  if (view === 'PagesView') return resolveComponent('PagesView');
  if (view === 'blocksList') return resolveComponent('BlocksNavigation');
  if (view === 'blocksSettings') return resolveComponent('BlockEditView');
};

const viewComponent = computed(() => getViewComponent(activeSetting.value, activeSubCategory.value));
</script>

<style scoped>
.slide-cover-enter-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: transform 0.3s ease-in-out;
}
.slide-cover-enter-from {
  transform: translateX(-100%);
}
.slide-cover-enter-to {
  transform: translateX(0);
}

.slide-cover-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.slide-cover-leave-from,
.slide-cover-leave-to {
  transform: translateX(0);
}
</style>
