<template>
  <div class="mt-8 flex items-center justify-center p-4">
    <div class="w-full text-center items-center">
      <h1 class="text-3xl md:text-4xl font-semibold mb-4">
        {{ t('error.pageNotFoundTitle') }}
      </h1>

      <p class="text-xl text-gray-600 leading-relaxed">
        {{ t('error.pageNotFoundSubtitle') }}
      </p>

      <div class="flex justify-center my-8">
        <UiSearch class="w-96" />
      </div>

      <div class="flex justify-center gap-2 overflow-x-auto scrollbar-hide flex-wrap">
        <UiButton
          v-for="category in categoryTree"
          :key="category.id"
          :tag="NuxtLink"
          :to="localePath('/' + categoryTreeGetters.getSlug(category))"
          variant="secondary"
        >
          {{ categoryTreeGetters.getName(category) }}
        </UiButton>
      </div>

      <div class="rounded-lg mt-8 sm:p-6 text-left">
        <ProductSlider :items="products" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { categoryTreeGetters } from '@plentymarkets/shop-api';

const { data: categoryTree } = useCategoryTree();
const localePath = useLocalePath();
const { t } = useI18n();
const NuxtLink = resolveComponent('NuxtLink');

const { data } = await useAsyncData('404-products', () => useSdk().plentysystems.getFacet({
  type: 'all',
  itemsPerPage: 20,
})); 

const products = computed(() => data?.value?.data.products || []);
</script>
