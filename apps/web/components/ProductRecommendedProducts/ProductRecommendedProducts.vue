<template>
  <RecommendedProducts :products="recommendedProducts"></RecommendedProducts>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { ProductRecommendedProductsProps } from './types';

const props = defineProps<ProductRecommendedProductsProps>();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(
  productGetters.getId(props.product),
);
fetchProductRecommended(productGetters.getCategoryIds(props.product)[0]);
</script>
