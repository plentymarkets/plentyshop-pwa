<template>
  <div class="mt-8 flex items-center justify-center p-4">
    <div class="w-full text-center items-center">
      <h1 class="text-3xl md:text-4xl font-semibold mb-4">
        {{ t('error.pageNotFoundTitle') }}
      </h1>

      <p class="text-xl text-gray-600 mb-8 leading-relaxed">
        {{ t('error.pageNotFoundSubtitle') }}
      </p>

      <div class="flex justify-center mb-6">
        <UiSearch class="w-96"/>
      </div>
      <div class="flex justify-center gap-4 overflow-x-auto pb-4 mb-12 scrollbar-hide">
        <UiButton v-for="category in categoryTree" :key="category.id" :tag="NuxtLink" :to="localePath('/' + categoryTreeGetters.getSlug(category))" variant="secondary" class="mt-4">
          {{ categoryTreeGetters.getName(category)}}
        </UiButton>
      </div>

      <div class="bg-gray-50 rounded-lg p-6 text-left">
        <p class="mb-4 text-xl font-semibold">{{ t('mostPopular') }}</p>
        <ProductSlider :items="recommendedProductsDisplay"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@plentymarkets/shop-api';
import { categoryTreeGetters } from '@plentymarkets/shop-api';

const localePath = useLocalePath();
const { t } = useI18n();
const { data: categoryTree } = useCategoryTree();
const NuxtLink = resolveComponent('NuxtLink');

// TODO: Replace the hardcoded logic below with a dynamic fetch of recommended products
const recommendedProductsDisplay = ref<Product[]>([]);
const fetchAllRecommended = async () => {
  if (!categoryTree.value) return;

  const limitedCategories = (categoryTree.value as CategoryTreeItem[]).slice(0, 2);

  const promises = limitedCategories.map((category) => {
    const { fetchProductRecommended } = useProductRecommended(String(category.id));
    return fetchProductRecommended(String(category.id));
  });
  const results = await Promise.all(promises);
  recommendedProductsDisplay.value = results.flat();
};
await fetchAllRecommended();
</script>
