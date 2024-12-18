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
        <div
          :class="[
            'relative max-w-screen-3xl mx-auto md:px-6 lg:px-10 mt-3 mb-10 group',
            {
              'outline outline-4 outline-[#538AEA]':
                isPreview && disableActions && isClicked && isTablet && clickedBlockIndex === index,
            },
            { 'hover:outline hover:outline-4 hover:outline-[#538AEA]': isPreview && disableActions && !isTablet },
          ]"
          @click="tabletEdit(index)"
          data-testid="block-wrapper"
        >
          <button
            v-if="disableActions && isPreview"
            @click="addNewBlock(index, 1)"
            class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0 hover:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
            :class="[{ 'opacity-100': isClicked && clickedBlockIndex === index }]"
            data-testid="top-add-block"
          >
            <SfIconAdd class="cursor-pointer"></SfIconAdd>
          </button>
          <UiBlockActions
            v-if="disableActions && blockHasData(block) && isPreview"
            :index="index"
            @edit="handleEdit"
            @delete="deleteBlock"
          />
          <component
            v-if="block.name !== 'NewsletterSubscribe' || showNewsletter"
            :is="getComponent(block.name)"
            v-bind="block.options"
          />
          <button
            v-if="disableActions && isPreview"
            @click="addNewBlock(index, 1)"
            class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-50 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100"
            :class="[{ 'opacity-100': isClicked && clickedBlockIndex === index }]"
            data-testid="bottom-add-block"
          >
            <SfIconAdd class="cursor-pointer"></SfIconAdd>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { SfIconAdd } from '@storefront-ui/vue';
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

const { data, fetchPageTemplate, dataIsEmpty } = useHomepage();
const { fetchCategoryTemplate } = useCategoryTemplate();
const { showNewsletter } = useNewsletter();
const { $i18n } = useNuxtApp();

const defaultAddBlock = (lang: string) => {
  return lang === 'en' ? homepageTemplateDataEn.blocks[1] : homepageTemplateDataDe.blocks[1];
};

const addNewBlock = (index: number, position: number) => {
  const insertIndex = position === -1 ? index : index + 1;
  const updatedBlocks = [...data.value.blocks];

  updatedBlocks.splice(insertIndex, 0, defaultAddBlock($i18n.locale.value));

  data.value.blocks = updatedBlocks;
};

const { isEditing, disableActions } = useEditor();

const getComponent = (name: string) => {
  if (name === 'NewsletterSubscribe') return resolveComponent('NewsletterSubscribe');
  if (name === 'UiHeroCarousel') return resolveComponent('UiHeroCarousel');
  if (name === 'UiMediaCard') return resolveComponent('UiMediaCard');
  if (name === 'ProductRecommendedProducts') return resolveComponent('ProductRecommendedProducts');
};
const runtimeConfig = useRuntimeConfig();

await fetchCategoryTemplate(runtimeConfig.public.homepageCategoryId);

fetchPageTemplate();
</script>
