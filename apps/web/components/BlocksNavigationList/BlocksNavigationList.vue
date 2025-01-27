<template>
  <div class="bg-[#F1F3F5] overflow-y-auto max-h-[100vh] pt-5 sticky top-0 px-2">
    <div class="overflow-y-auto">
      <div v-for="(category, categoryIndex) in blocksLists" :key="categoryIndex">
        <div :class="['mb-3 relative', 'md:text-center', 'lg:left-[15%] lg:text-left']">
          {{ category.title }}
        </div>
        <div v-for="(variation, variationIndex) in category.variations" :key="variationIndex" class="relative mb-10">
          <NuxtImg :src="variation.image" class="block mx-auto" :alt="variation.title" width="253" height="120" />
          <button
            :class="[
              'transform -translate-y-1/2 bg-[#72CBEE] text-[#062633] w-10 h-10 rounded-full shadow-md cursor-pointer',
              'md:block md:mx-auto',
              'lg:right-[15%] lg:absolute',
            ]"
            @click="addNewBlock(variationIndex, -1)"
          >
            <SfIconAdd class="cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { blocksLists } from './blocksLists';
import { SfIconAdd } from '@storefront-ui/vue';
import homepageTemplateDataEn from '../../composables/useHomepage/homepageTemplateDataEn.json';
import homepageTemplateDataDe from '../../composables/useHomepage/homepageTemplateDataDe.json';
const { data, initialBlocks } = useHomepage();
const { $i18n } = useNuxtApp();
const { displayBlockList } = useEditor();
const { isEditingEnabled } = useEditor();

const defaultAddBlock = (lang: string) => {
  return lang === 'en' ? homepageTemplateDataEn.blocks[1] : homepageTemplateDataDe.blocks[1];
};

const addNewBlock = (index: number, position: number) => {
  displayBlockList.value = true;
  const insertIndex = position === -1 ? index : index + 1;
  const updatedBlocks = [...data.value.blocks];

  updatedBlocks.splice(insertIndex, 0, defaultAddBlock($i18n.locale.value));

  data.value.blocks = updatedBlocks;

  isEditingEnabled.value = !deepEqual(initialBlocks.value, data.value.blocks);
};
</script>
