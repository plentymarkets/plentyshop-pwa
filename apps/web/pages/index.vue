<template>
  <div>
    <Editor v-if="isEditing" :block="currentBlock" />
    <div v-else class="content">
      <template v-for="(block, index) in testEn.blocks" :key="index">
        <div class="relative max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10 group">
          <button
            @click="editBlock(block)"
            class="absolute right-0 top-0 mt-2 mr-2 p-2 bg-blue-500 text-white rounded hidden group-hover:block"
          >
            Edit
          </button>
          <component :is="getComponent(block.name)" v-bind="block.options" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import testEn from './testEn.json';
import { Block } from '~/composables/useHomepage/types';

const isEditing = ref(false);
const currentBlock = ref<Block | null>(null);

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
