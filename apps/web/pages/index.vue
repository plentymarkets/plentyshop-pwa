<template>
  <div>
    <Editor v-if="isEditing" :block="currentBlock" />
    <div v-else class="content">
      <template v-for="(block, index) in testEn.blocks" :key="index">
        <div
          :class="[
            'relative max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10 group',
            { 'border-[3px] border-[#538AEA]': isClicked && isTablet && clickedBlockIndex === index },
            { 'hover:border-[3px] hover:border-[#538AEA]': !isTablet },
          ]"
          @click="tabletEdit(index)"
        >
          <UiBlockActions :block="block" @edit="editBlock" />
          <component :is="getComponent(block.name)" v-bind="block.options" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import testEn from './testEn.json';
import { Block } from '~/composables/useHomepage/types';

const { isEditing } = useEditor();
const viewport = useViewport();

const currentBlock = ref<Block | null>(null);
const isClicked = ref(false);
const clickedBlockIndex = ref<number | null>(null);

const isTablet = computed(() => viewport.isLessThan('lg') && viewport.isGreaterThan('sm'));

const tabletEdit = (index: number) => {
  if (isTablet.value) {
    isClicked.value = !isClicked.value;
    clickedBlockIndex.value = isClicked.value ? index : null;
  }
};
const editBlock = (block: Block) => {
  currentBlock.value = block;
  isEditing.value = true;
};
const getComponent = (name: string) => {
  if (name === 'UiSkeletonLoader') {
    return resolveComponent('UiSkeletonLoader');
  }

  if (name === 'UiHeroCarousel') {
    return resolveComponent('UiHeroCarousel');
  }

  if (name === 'UiMediaCard') {
    return resolveComponent('UiMediaCard');
  }

  if (name === 'ProductRecommendedProducts') {
    return resolveComponent('ProductRecommendedProducts');
  }
};
</script>
