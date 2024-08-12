<template>
  <div class="flex justify-center lg:justify-start mb-4 lg:mb-0">
    <div class="lg:flex my-2">
      <div class="lg:w-1/2 flex flex-col lg:mr-8">
        <p class="text-center text-sm">{{ t('averageRating') }}</p>
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
        <p class="text-xs text-center">{{ t('basedOnratings', { count: totalReviews }) }}</p>
        <UiButton @click="openReviewModal()" data-testid="create-review" class="mt-2 mb-4 mx-auto" size="base">
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

  <UiModal
    v-if="isReviewModalOpen"
    v-model="isReviewModalOpen"
    aria-labelledby="review-modal"
    tag="section"
    role="dialog"
    class="h-full md:w-[500px] md:h-fit m-0 p-0"
    :data-testid="dataTestId"
  >
    <header>
      <h3 class="font-bold typography-headline-4">
        {{ t('review.createReviewFormTitle') }}
      </h3>
      <UiButton @click="closeReviewModal" square variant="tertiary" class="absolute right-2 top-2">
        <SfIconClose />
      </UiButton>
    </header>

    <template v-if="isAuthorized">
      <ReviewForm @on-close="closeReviewModal" class="h-fit" />
    </template>
    <template v-else>
      <LoginComponent v-if="isLogin" @change-view="isLogin = false" />
      <Register v-else @change-view="isLogin = true" />
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { SfRating, SfIconClose, SfProgressLinear, SfIconStarFilled } from '@storefront-ui/vue';
import type { ReviewStatisticsProps } from './types';
import { productGetters, reviewGetters } from '@plentymarkets/shop-api';

const props = defineProps<ReviewStatisticsProps>();

const productId = Number(productGetters.getItemId(props.product));

const { t } = useI18n();
const { isAuthorized } = useCustomer();
const { data: productReviewAverage } = useProductReviewAverage(productId);
const { isReviewModalOpen, openReviewModal, closeReviewModal } = useProductReviews(productId);

const isLogin = ref(true);
const dataTestId = computed(() => (isAuthorized.value ? 'review' : 'login') + '-modal');

const reviewAverageText = computed(() => reviewGetters.getAverageRating(productReviewAverage.value, 'tenth'));
const reviewAverageStars = computed(() => reviewGetters.getAverageRating(productReviewAverage.value, 'half'));
const totalReviews = computed(() => reviewGetters.getTotalReviews(productReviewAverage.value));
const ratingPercentages = computed(() =>
  reviewGetters.getReviewCountsOrPercentagesByRatingDesc(productReviewAverage.value, true),
);
const splitRatings = computed(() => reviewGetters.getReviewCountsOrPercentagesByRatingDesc(productReviewAverage.value));
</script>
