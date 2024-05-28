<template>
  <div data-testid="reviews-accordion" id="customerReviewsAccordion">
    <UiAccordionItem
      v-model="reviewsOpen"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none"
    >
      <template #summary>
        <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl" id="customerReviewsClick">
          {{ t('customerReviews') }}
        </h2>
      </template>

      <div>
        <div class="flex my-2">
          <div class="w-1/2 flex flex-col">
            <p class="text-center text-sm">Average Rating</p>
            <div class="flex justify-center">
              <SfRating
                class="pb-2"
                size="lg"
                :max="5"
                :value="reviewGetters.getAverageRating(productReviewAverage)"
                :half-increment="true"
              />
              <h3 class="font-bold text-xl ml-2 flex">{{ reviewGetters.getAverageRating(productReviewAverage) }}</h3>
            </div>
            <p class="text-xs text-center text-">based on {{ totalReviews }}Review(s)</p>
            <SfButton
              @click="isAuthorized ? openReviewModal() : openAuthentication()"
              data-testid="create-review"
              class="mt-2 mb-4 w-1/2 mx-auto"
              size="base"
            >
              {{ t('createCustomerReview') }}
            </SfButton>
          </div>

          <div class="flex flex-col">
            <div v-for="(splitReview, key) in ratingPercentages" :key="key" class="flex items-center">
              <p class="w-4 text-center">{{ 6 - key }}</p>
              <SfRating class="mx-2 pb-1" size="base" :max="1" :value="1" />
              <SfProgressLinear
                class="self-center"
                size="sm"
                :value="splitReview"
                aria-label="5star-Rating-Progress-Element"
              />
              <p class="ml-2 w-8 text-center">( {{ splitReviews[key] }} )</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="w-full flex justify-center items-center">
        <SfLoaderCircular class="absolute" size="sm" />
      </div>
      <UiReview
        v-for="(reviewItem, key) in productReviews"
        :key="key"
        :review-item="reviewItem"
        @on-submit="saveReview"
        @review-updated="refreshReviews"
        @review-deleted="refreshReviews"
      />
      <p v-if="!totalReviews" class="font-bold leading-6 w-full py-2">{{ t('customerReviewsNone') }}</p>
    </UiAccordionItem>
    <UiDivider v-if="reviewsOpen && productReviews.length > 0" class="mb-2 mt-2" />
  </div>

  <UiModal
    v-if="isReviewOpen"
    v-model="isReviewOpen"
    aria-labelledby="review-modal"
    tag="section"
    role="dialog"
    class="h-full md:w-[500px] md:h-fit m-0 p-0"
  >
    <header>
      <h3 class="font-bold typography-headline-4">
        {{ t('review.createReviewFormTitle') }}
      </h3>
      <SfButton @click="closeReviewModal" square variant="tertiary" class="absolute right-2 top-2">
        <SfIconClose />
      </SfButton>
    </header>
    <ReviewForm @on-close="closeReviewModal" @on-submit="saveReview" class="h-fit" />
  </UiModal>

  <UiModal
    v-if="isAuthenticationOpen"
    v-model="isAuthenticationOpen"
    aria-labelledby="login-modal"
    tag="section"
    role="dialog"
    class="h-full md:w-[500px] md:h-fit m-0 p-0"
  >
    <header>
      <SfButton @click="closeAuthentication" square variant="tertiary" class="absolute right-2 top-2">
        <SfIconClose />
      </SfButton>
    </header>
    <LoginComponent v-if="isLogin" @change-view="isLogin = false" @logged-in="closeAuth" />
    <Register v-else @change-view="isLogin = true" @registered="closeAuth" />
  </UiModal>
</template>

<script lang="ts" setup>
import { SfButton, SfIconClose, SfLoaderCircular, SfProgressLinear, SfRating, useDisclosure } from '@storefront-ui/vue';
import { reviewGetters, productGetters } from '@plentymarkets/shop-sdk';
import type { ProductAccordionPropsType } from '~/components/ReviewsAccordion/types';
import type { CreateReviewParams } from '@plentymarkets/shop-api';
const props = defineProps<ProductAccordionPropsType>();
const { product, totalReviews } = toRefs(props);
const isLogin = ref(true);
const { send } = useNotification();
const { t } = useI18n();
const { isOpen: isReviewOpen, open: openReviewModal, close: closeReviewModal } = useDisclosure();
const { isAuthorized } = useCustomer();
const { isOpen: isAuthenticationOpen, open: openAuthentication, close: closeAuthentication } = useDisclosure();
const reviewsOpen = ref(false);

const closeAuth = () => {
  closeAuthentication();
  isReviewOpen.value = true;
};

const productId = productGetters.getItemId(product.value);

const {
  data: productReviewsData,
  fetchProductReviews,
  createProductReview,
  loading,
} = useProductReviews(Number(productId));
const { data: productReviewAverage, fetchProductReviewAverage } = useProductReviewAverage(productId);

const productReviews = computed(() => {
  return reviewGetters.getReviewItems(productReviewsData.value);
});

const refreshReviews = () => {
  fetchProductReviews(Number(productId), productGetters.getVariationId(product.value));
};

const saveReview = async (form: CreateReviewParams) => {
  if (form.type === 'review') form.targetId = Number(productId);

  closeReviewModal();
  await createProductReview(form).then(() => refreshReviews());
  send({ type: 'positive', message: t('review.notification.success') });
};

const splitReviews = computed((): number[] => {
  let splitReviewsTemporary = [0, 0, 0, 0, 0];

  for (const review of productReviews.value) {
    const rating = review.feedbackRating.rating.ratingValue;
    if (Number(rating) >= 1 && Number(rating) <= 5) {
      splitReviewsTemporary[5 - Number(rating)]++;
    }
  }

  return splitReviewsTemporary;
});

const ratingPercentages = computed(() => {
  const total = Number(totalReviews.value);
  return splitReviews.value.map((review) => (review > 0 ? (review / total) * 100 : 0));
});

await Promise.all([fetchProductReviewAverage(Number(productId))]);

watch(
  () => reviewsOpen.value,
  (value) => {
    if (value) {
      fetchProductReviews(
        Number(productGetters.getItemId(product.value)),
        productGetters.getVariationId(product.value),
      );
    }
  },
);
</script>
