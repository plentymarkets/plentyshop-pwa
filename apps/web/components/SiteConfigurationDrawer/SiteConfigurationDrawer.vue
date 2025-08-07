<template>
  <Transition :name="placement === 'left' ? 'drawer-left' : ''" appear>
    <SfDrawer
      ref="drawerRef"
      v-model="drawerOpen"
      :placement="placement as SfDrawerPlacement"
      :disable-click-away="true"
      :transition="false"
      :class="[
        'bg-neutral-50',
        'border-0',
        'border-gray-300',
        'z-[15]',
        { 'w-1/2 lg:w-1/4': placement === 'left' || placement === 'right' },
      ]"
    >
      <component :is="getDrawerView(drawerView)" v-if="drawerView" />

      <Transition v-else-if="viewComponent" :name="placement === 'left' ? transitionName : ''" mode="out-in" appear>
        <component :is="viewComponent" :key="viewComponent" />
      </Transition>
    </SfDrawer>
  </Transition>
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
const transitionName = ref('cover-in');

watch(activeSubCategory, (next, prev) => {
  const entering = !prev && next;
  const exiting = prev && !next;

  if (entering) transitionName.value = 'cover-in';
  if (exiting) transitionName.value = 'cover-out';
});
</script>

<style scoped>
.cover-in-enter-active,
.cover-in-leave-active,
.cover-out-enter-active,
.cover-out-leave-active {
  position: absolute;
  inset: 0;
  width: 100%;
  transition: transform 0.3s ease-in-out;
}

.cover-in-enter-from {
  transform: translateX(-100%);
}
.cover-in-enter-to,
.cover-in-leave-from {
  transform: translateX(0);
}
.cover-in-leave-active {
  transition: none;
}

.cover-out-enter-from,
.cover-out-enter-to {
  transform: translateX(0);
}
.cover-out-leave-from {
  transform: translateX(0);
}
.cover-out-leave-to {
  transform: translateX(-100%);
}

.drawer-left-enter-active,
.drawer-left-leave-active {
  transition: transform 0.3s ease-in-out;
}

.drawer-left-enter-from {
  transform: translateX(-100%);
}
.drawer-left-leave-from {
  transform: translateX(0);
}
.drawer-left-leave-to {
  transform: translateX(-100%);
}
</style>
