<template>
  <div data-testid="reviews-accordion" id="customerReviewsAccordion">
    <UiAccordionItem
      v-if="productReviews && reviewGetters.getItems(productReviews)?.length"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center"
    >
      <template #summary>
        <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl" id="customerReviewsClick">
          {{ $t('customerReviews') }}
        </h2>
      </template>
      <UiReview
        v-for="(reviewItem, key) in reviewGetters.getItems(productReviews)"
        :key="key"
        :review-item="reviewItem"
        class="mb-4"
      />
    </UiAccordionItem>
    <div v-else class="w-full py-2 pl-4 pr-3 flex justify-between items-center">
      <p class="font-bold leading-6">{{ $t('customerReviewsNone') }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reviewGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import type { ProductAccordionPropsType } from '~/components/ProductAccordion/types';

const props = defineProps<ProductAccordionPropsType>();

const { product } = toRefs(props);

const { data: productReviews, fetchProductReviews } = useProductReviews(
  product.value.variation.id,
  product.value.item.id,
);
fetchProductReviews(product.value.variation.id, product.value.item.id);
</script>
