<template>
  <div>
    <EmptyBlock v-if="dataIsEmpty" @add-new-block="addNewBlock(0, 1)"></EmptyBlock>
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
          :show-newsletter="showNewsletter"
          :block-has-data="blockHasData"
          :get-component="getComponent"
          :tablet-edit="tabletEdit"
          :add-new-block="addNewBlock"
          :handle-edit="handleEdit"
          :delete-block="deleteBlock"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import homepageTemplateDataEn from '../composables/useHomepage/homepageTemplateDataEn.json';
import homepageTemplateDataDe from '../composables/useHomepage/homepageTemplateDataDe.json';

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

const { data, initialBlocks, fetchPageTemplate, dataIsEmpty } = useHomepage();
const { showNewsletter } = useNewsletter();
const { $i18n } = useNuxtApp();
const { isEditing, isEditingEnabled, disableActions } = useEditor();

const defaultAddBlock = (lang: string) => {
  return lang === 'en' ? homepageTemplateDataEn.blocks[1] : homepageTemplateDataDe.blocks[1];
};

const addNewBlock = (index: number, position: number) => {
  const insertIndex = position === -1 ? index : index + 1;
  const updatedBlocks = [...data.value.blocks];

  updatedBlocks.splice(insertIndex, 0, defaultAddBlock($i18n.locale.value));

  data.value.blocks = updatedBlocks;

  isEditingEnabled.value = !deepEqual(initialBlocks.value, data.value.blocks);
};

const getComponent = (name: string) => {
  if (name === 'NewsletterSubscribe') return resolveComponent('NewsletterSubscribe');
  if (name === 'UiHeroCarousel') return resolveComponent('UiHeroCarousel');
  if (name === 'UiMediaCard') return resolveComponent('UiMediaCard');
  if (name === 'ProductRecommendedProducts') return resolveComponent('ProductRecommendedProducts');
};

onMounted(() => {
  isEditingEnabled.value = false;
});

fetchPageTemplate();
</script>
