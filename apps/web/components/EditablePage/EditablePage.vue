<template>
  <div>
    <EmptyBlock v-if="dataIsEmpty" />
    <div v-if="data.length" class="content">
      <template v-for="(block, index) in data" :key="index">
        <PageBlock
          :index="index"
          :block="block"
          :disable-actions="disableActions"
          :is-clicked="isClicked"
          :clicked-block-index="clickedBlockIndex"
          :is-tablet="isTablet"
          :block-has-data="blockHasData"
          :change-block-position="changeBlockPosition"
          :root="true"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { isClicked, clickedBlockIndex, isTablet, blockHasData, changeBlockPosition } = useBlockManager();
const { settingsIsDirty, closeDrawer } = useSiteConfiguration();
const { data, getBlocks } = useCategoryTemplate();
const dataIsEmpty = computed(() => data.value.length === 0);
const { data: dataProducts } = useProducts();
const { isEditingEnabled, disableActions } = useEditor();

onMounted(() => {
  isEditingEnabled.value = false;
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  closeDrawer();
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
const hasUnsavedChanges = () => {
  return !isEditingEnabled.value && !settingsIsDirty.value;
};
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (hasUnsavedChanges()) return;
  event.preventDefault();
};
onBeforeRouteLeave((to, from, next) => {
  if (isEditingEnabled.value) {
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave?');
    if (confirmation) {
      closeDrawer();
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

await getBlocks(dataProducts.value.category.id, 'category');
</script>
