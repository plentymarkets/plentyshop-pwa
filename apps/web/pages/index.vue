<template>
  <div>
    <EmptyBlock v-if="dataIsEmpty" @add-new-block="openBlockList" />
    <Editor
      v-if="isEditing && currentBlockUuid !== null"
      :uuid="currentBlockUuid"
      :block="currentBlock"
      @update="updateBlock"
    />
    <div v-else class="content">
      <template v-for="(block, index) in data" :key="index">
        <PageBlock
          :index="index"
          :block="block"
          :is-preview="isPreview"
          :disable-actions="disableActions"
          :is-clicked="isClicked"
          :clicked-block-index="clickedBlockIndex"
          :is-tablet="isTablet"
          :block-has-data="blockHasData"
          :tablet-edit="tabletEdit"
          :add-new-block="openBlockList"
          :change-block-position="changeBlockPosition"
          :class="[
            {
              'max-w-screen-3xl mx-auto md:px-6 lg:px-10 mt-3': block.name !== 'Banner' && block.name !== 'Carousel',
            },
          ]"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
const {
  currentBlock,
  currentBlockUuid,
  isClicked,
  clickedBlockIndex,
  isTablet,
  isPreview,
  blockHasData,
  tabletEdit,
  updateBlock,
  changeBlockPosition,
  togglePlaceholder,
} = useBlockManager();

const { settingsIsDirty, openDrawerWithView, updateNewBlockPosition } = useSiteConfiguration();

const { data, fetchPageTemplate, dataIsEmpty } = useHomepage();

const { isEditing, isEditingEnabled, disableActions } = useEditor();
const { getRobots, setRobotForStaticPage } = useRobots();

const openBlockList = (index: number, position: number) => {
  const insertIndex = (position === -1 ? index : index + 1) || 0;
  togglePlaceholder(index, position === -1 ? 'top' : 'bottom');
  updateNewBlockPosition(insertIndex);
  openDrawerWithView('blocksList');
};

await getRobots();
setRobotForStaticPage('Homepage');

onMounted(() => {
  isEditingEnabled.value = false;
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

const hasUnsavedChanges = () => {
  return !isEditingEnabled.value && !settingsIsDirty.value;
};

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (hasUnsavedChanges()) return;
  event.preventDefault();
};

fetchPageTemplate();
</script>
