<template>
  <Transition name="drawer-left" appear>
    <div class="flex-shrink-0 w-1/4 min-w-[250px] max-w-[300px] bg-neutral-50 border-0 border-gray-300 z-[15] relative">
      <component :is="getDrawerView(siteConfigurationDrawerView)" v-if="siteConfigurationDrawerView" />

      <Transition v-else-if="viewComponent" :name="transitionName" mode="out-in" appear>
        <component :is="viewComponent" :key="viewComponent" />
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { siteConfigurationDrawerView, activeSetting, activeSubCategory } = useSiteConfiguration();

const getDrawerView = (view: string) => {
  if (view === 'PagesView') return resolveComponent('PagesView');
  if (view === 'LocalizationView') return resolveComponent('LocalizationView');
  if (view === 'TableOfContents') return resolveComponent('TableOfContents');
  if (view === 'blocksList') return resolveComponent('EditorBlocksNavigation');
};

const viewComponent = computed(() => getViewComponent(activeSetting.value, activeSubCategory.value));
const transitionName = ref('cover-in');

watch(activeSubCategory, (next, prev) => {
  if (next === prev) return;
  const entering = !prev && next;
  const exiting = prev && !next;

  if (entering) transitionName.value = 'cover-in';
  if (exiting) transitionName.value = 'cover-out';
});

watch(activeSetting, () => {
  transitionName.value = 'cover-in';
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
