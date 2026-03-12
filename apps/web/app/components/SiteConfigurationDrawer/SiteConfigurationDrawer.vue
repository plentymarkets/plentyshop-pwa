<template>
  <div class="flex-shrink-0 w-1/4 min-w-[250px] max-w-[300px] bg-neutral-50 border-0 border-gray-300 z-[15]">
    <component :is="getDrawerView(drawerViewLeft)" v-if="drawerViewLeft" />

    <component :is="viewComponent" v-else-if="viewComponent" :key="viewComponent" />
  </div>
</template>

<script setup lang="ts">
const { drawerViewLeft, activeSetting, activeSubCategory } = useSiteConfiguration();

const getDrawerView = (view: string) => {
  if (view === 'PagesView') return resolveComponent('PagesView');
  if (view === 'LocalizationView') return resolveComponent('LocalizationView');
  if (view === 'TableOfContents') return resolveComponent('TableOfContents');
  if (view === 'blocksList') return resolveComponent('BlocksNavigation');
};

const viewComponent = computed(() => getViewComponent(activeSetting.value, activeSubCategory.value));
</script>

