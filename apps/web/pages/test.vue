<template>
  <template v-for="(block, index) in testEn.blocks" :key="index">
    <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
      <component :is="getComponent(block.name)" v-bind="block.options" />
    </div>
  </template>
</template>

<script lang="ts" setup>
import testEn from './testEn.json';

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
