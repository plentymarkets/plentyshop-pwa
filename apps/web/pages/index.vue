<template>
  <div>
    <EmptyBlock v-if="dataIsEmpty" @add-new-block="addNewBlock(0, 1)" />
    <Editor
      v-if="isEditing && currentBlockIndex !== null"
      :index="currentBlockIndex"
      :block="currentBlock"
      @update="updateBlock"
    />
    <div v-else class="content">
      <template v-for="(block, index) in data.blocks" :key="index">
        <PageBlock
          :index="index"
          :block="block"
          :is-preview="isPreview"
          :disable-actions="disableActions"
          :is-clicked="isClicked"
          :clicked-block-index="clickedBlockIndex"
          :is-tablet="isTablet"
          :block-has-data="blockHasData"
          :get-component="getComponent"
          :tablet-edit="tabletEdit"
          :add-new-block="addNewBlock"
          :change-block-position="changeBlockPosition"
          :is-last-block="isLastBlock"
          :handle-edit="handleEdit"
          :delete-block="deleteBlock"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
const {
  currentBlock,
  currentBlockIndex,
  isClicked,
  clickedBlockIndex,
  isTablet,
  isPreview,
  blockHasData,
  tabletEdit,
  handleEdit,
  deleteBlock,
  updateBlock,
} = useBlockManager();

const runtimeConfig = useRuntimeConfig();
const isHero = ref(runtimeConfig.public.isHero);
const showBlockList = ref(runtimeConfig.public.showBlocksNavigation);

const { data, initialBlocks, fetchPageTemplate, dataIsEmpty } = useHomepage();
const { isEditing, isEditingEnabled, disableActions } = useEditor();
const { settingsIsDirty, openDrawerWithView } = useSiteConfiguration();
const { togglePlaceholder } = useBlockManager()
const addNewBlock = (index: number, position: number) => {
  if (showBlockList.value) {
    openDrawerWithView('blocks');
  }
  togglePlaceholder(index, position === -1 ? 'top' : 'bottom');
  isEditingEnabled.value = !deepEqual(initialBlocks.value, data.value.blocks);
};

const changeBlockPosition = (index: number, position: number) => {
  const updatedBlocks = [...data.value.blocks];
  const newIndex = index + position;

  if (newIndex < 0 || newIndex >= updatedBlocks.length) return;

  const blockToChange = updatedBlocks.splice(index, 1)[0];
  updatedBlocks.splice(newIndex, 0, blockToChange);

  data.value.blocks = updatedBlocks;

  isEditingEnabled.value = !deepEqual(initialBlocks.value, data.value.blocks);
};

const isLastBlock = (index: number) => index === data.value.blocks.length - 1;

const getComponent = (name: string) => {
  if (name === 'NewsletterSubscribe') return resolveComponent('NewsletterSubscribe');
  if (name === 'UiTextCard') return resolveComponent('UiTextCard');
  if (name === 'UiImageText') return resolveComponent('UiImageText');
  if (name === 'ProductRecommendedProducts') return resolveComponent('ProductRecommendedProducts');
  if (name === 'UiCarousel') {
    return isHero.value ? resolveComponent('UiHeroCarousel') : resolveComponent('UiBlazeCarousel');
  }
};

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
