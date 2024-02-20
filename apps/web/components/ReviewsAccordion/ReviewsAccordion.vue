<template>
  <div data-testid="reviews-accordion" id="customerReviewsAccordion">
    <UiAccordionItem
      v-if="totalReviews"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center"
      v-model="reviewsOpen"
    >
      <template #summary>
        <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl" id="customerReviewsClick">
          {{ $t('customerReviews') }}
        </h2>
      </template>
      <SfLoaderCircular v-if="loading && reviewGetters.getItems(productReviews).length === 0" size="sm" />
      <UiReview
        v-for="(reviewItem, key) in reviewGetters.getItems(productReviews)"
        :key="key"
        :review-item="reviewItem"
        class="mb-4"
      />
    </UiAccordionItem>
    <div v-else class="w-full mt-4 py-2 pl-4 pr-3 flex justify-between items-center">
      <p class="font-bold leading-6">{{ $t('customerReviewsNone') }}</p>
    </div>
    <UiDivider v-if="reviewsOpen && reviewGetters.getItems(productReviews).length > 0" class="mb-2 mt-2" />
  </div>
</template>

<script lang="ts" setup>
import { SfLoaderCircular } from '@storefront-ui/vue';
import { reviewGetters, productGetters } from '@plentymarkets/shop-sdk';
import type { ProductAccordionPropsType } from '~/components/ReviewsAccordion/types';

const props = defineProps<ProductAccordionPropsType>();

const { product, totalReviews } = toRefs(props);
const reviewsOpen = ref(false);
const {
  data: productReviews,
  fetchProductReviews,
  loading,
} = useProductReviews(Number(productGetters.getItemId(product.value)));
watch(
  () => reviewsOpen.value,
  (value) => {
    if (value && reviewGetters.getItems(productReviews.value).length === 0) {
      fetchProductReviews(Number(productGetters.getItemId(product.value)));
    }
  },
);
</script>
