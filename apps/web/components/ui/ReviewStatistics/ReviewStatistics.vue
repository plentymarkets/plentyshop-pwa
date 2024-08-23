<template>
  <div class="flex justify-center lg:justify-start mb-4 lg:mb-0" data-testid="average-section">
    <div class="lg:flex my-2">
      <div class="lg:w-1/2 flex flex-col lg:mr-8">
        <p class="text-center text-sm" data-testid="average-info">{{ t('averageRating') }}</p>
        <div class="flex justify-center">
          <SfRating
            class="pb-2"
            size="lg"
            :max="5"
            :value="reviewAverageStars || reviewAverageText"
            :half-increment="true"
          />
          <h3 class="font-bold text-xl ml-2">
            {{ reviewAverageText }}
          </h3>
        </div>
        <p class="text-xs text-center" data-testid="review-count">{{ t('basedOnratings', { count: totalReviews }) }}</p>
        <UiButton
          @click="openReviewModal(defaults.DEFAULT_REVIEW_MODAL_TYPES.createReview)"
          data-testid="add-review-button"
          class="mt-2 mb-4 mx-auto"
          size="base"
        >
          {{ t('createCustomerReview') }}
        </UiButton>
      </div>

      <div class="flex flex-col">
        <div v-for="(proportionalRating, key) in ratingPercentages" :key="key" class="flex items-center">
          <p class="w-4 text-center">{{ 5 - key }}</p>
          <SfIconStarFilled class="mx-2 pb-1 text-warning-500" size="base" />
          <SfProgressLinear
            class="self-center"
            size="sm"
            :value="proportionalRating"
            aria-label="proportional-rating-in-percent"
          />
          <p class="lg:w-20 ml-2">( {{ splitRatings[key] }} )</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfRating, SfProgressLinear, SfIconStarFilled } from '@storefront-ui/vue';
import type { ReviewStatisticsProps } from './types';
import { productGetters, reviewGetters } from '@plentymarkets/shop-api';
import { defaults } from '~/composables';

const props = defineProps<ReviewStatisticsProps>();

const productId = Number(productGetters.getItemId(props.product));

const { t } = useI18n();
const { data: productReviewAverage } = useProductReviewAverage(productId);
const { openReviewModal } = useProductReviews(productId);

const reviewAverageText = computed(() => reviewGetters.getAverageRating(productReviewAverage.value, 'tenth'));
const reviewAverageStars = computed(() => reviewGetters.getAverageRating(productReviewAverage.value, 'half'));
const totalReviews = computed(() => reviewGetters.getTotalReviews(productReviewAverage.value));
const ratingPercentages = computed(() =>
  reviewGetters.getReviewCountsOrPercentagesByRatingDesc(productReviewAverage.value, true),
);
const splitRatings = computed(() => reviewGetters.getReviewCountsOrPercentagesByRatingDesc(productReviewAverage.value));
</script>
