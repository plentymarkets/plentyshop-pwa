<template>
  <Transition name="drawer-right" appear>
    <div class="flex-shrink-0 w-1/4 min-w-[250px] max-w-[300px] bg-neutral-50 border-0 border-gray-300 z-[15]">
      <component :is="getDrawerView(blocksConfigurationDrawerView)" v-if="blocksConfigurationDrawerView" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { blocksConfigurationDrawerView } = useSiteConfiguration();

const getDrawerView = (view: string) => {
  if (view === 'blocksSettings') return resolveComponent('BlockEditView');
};
</script>

<style scoped>
.drawer-right-enter-active,
.drawer-right-leave-active {
  transition: transform 0.3s ease-in-out;
}

.drawer-right-enter-from {
  transform: translateX(100%);
}

.drawer-right-leave-to {
  transform: translateX(100%);
}
</style>
