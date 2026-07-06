<template>
  <Transition name="drawer-right" appear>
    <div v-z-layer="'editor-drawer'" class="flex-shrink-0 w-1/4 min-w-[250px] max-w-[340px] bg-neutral-50 border-0 border-gray-300">
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
