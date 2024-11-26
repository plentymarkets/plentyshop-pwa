<template>
  <template v-for="(block, index) in testEn.blocks" :key="index">
    <component :is="getComponent(block.name)" v-bind="block.options" />
  </template>
</template>

<script lang="ts" setup>
import testEn from './testEn.json';

const getComponent = (name: string) => {
  console.log(`Resolving component: ${name}`);

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
