<template>
  <div>
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
        >
          <button
            v-if="experimentalAddBlock && disableActions && isPreview"
            :class="[
              'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0',
              { 'opacity-100': isClicked && clickedBlockIndex === index },
              'group-hover:opacity-100 group-focus:opacity-100',
            ]"
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
            v-if="experimentalAddBlock && disableActions && isPreview"
            :class="[
              'absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-50 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0',
              { 'opacity-100': isClicked && clickedBlockIndex === index },
              'group-hover:opacity-100 group-focus:opacity-100',
            ]"
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
import { useBlockManager } from '~/composables/useBlockManager/useBlockManager';
import { useHomepage } from '~/composables/useHomepage/useHomepage';
import { useEditor } from '~/composables/useEditor/useEditor';
import { useNewsletter } from '~/composables/useNewsletter';

const {
  currentBlock,
  currentBlockIndex,
  isClicked,
  clickedBlockIndex,
  isTablet,
  isPreview,
  experimentalAddBlock,
  blockHasData,
  tabletEdit,
  handleEdit,
  deleteBlock,
  updateBlock,
} = useBlockManager();

const { data, fetchPageTemplate } = useHomepage();
const { fetchCategoryTemplate } = useCategoryTemplate();
const { showNewsletter } = useNewsletter();

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
