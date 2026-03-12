<template>
  <div class="flex-shrink-0 w-1/4 min-w-[250px] max-w-[300px] bg-neutral-50 border-0 border-gray-300 z-[15]">
    <component :is="getDrawerView(drawerViewRight)" v-if="drawerViewRight" />
  </div>
</template>

<script setup lang="ts">
const { drawerViewRight } = useSiteConfiguration();

const getDrawerView = (view: string) => {
  if (view === 'blocksSettings') return resolveComponent('BlockEditView');
};
</script>



