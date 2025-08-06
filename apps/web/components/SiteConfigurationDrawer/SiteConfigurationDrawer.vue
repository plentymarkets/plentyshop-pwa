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
      <Transition :name="transitionName" mode="out-in" appear>
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
const transitionName = computed(() => (activeSubCategory.value ? 'cover-in' : 'cover-out'))
</script>

<style scoped>
.cover-in-enter-active,
.cover-in-leave-active,
.cover-out-enter-active,
.cover-out-leave-active{
  position:absolute;
  inset:0;
  width:100%;
  transition:transform .3s ease-in-out;
}

.cover-in-enter-from{transform:translateX(-100%)}
.cover-in-enter-to,
.cover-in-leave-from{transform:translateX(0)}
.cover-in-leave-active{transition:none}

.cover-out-enter-from,
.cover-out-enter-to{transform:translateX(0)}
.cover-out-leave-from{transform:translateX(0)}
.cover-out-leave-to{transform:translateX(-100%)}
</style>
