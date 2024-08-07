<template>
  <div
    ref="accordionReference"
    class="relative col-span-5 md:sticky md:top-10 h-fit"
    :class="{ 'pointer-events-none opacity-50': loadingReviews }"
  >
    <SfLoaderCircular v-if="loadingReviews" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />

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
              <p class="text-xs text-center text-">{{ t('basedOnratings', { count: totalReviews }) }}</p>
              <UiButton
                @click="isAuthorized ? openReviewModal() : openAuthentication()"
                data-testid="create-review"
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

        <UiReview
          v-for="(reviewItem, key) in paginatedProductReviews"
          :key="key"
          :review-item="reviewItem"
          @on-submit="saveReview"
          @review-updated="fetchReviews"
          @review-deleted="deleteReview"
        />
        <p v-if="!totalReviews && paginatedProductReviews.length === 0" class="font-bold leading-6 w-full py-2">
          {{ t('customerReviewsNone') }}
        </p>
        <UiPagination
          v-if="paginatedProductReviews.length > 0"
          :key="pagination.totalCount"
          :current-page="currentPage"
          :total-items="pagination.totalCount"
          :page-size="defaults.DEFAULT_FEEDBACK_ITEMS_PER_PAGE"
          :max-visible-pages="maxVisiblePages"
          current-page-name="feedbackPage"
        />
      </UiAccordionItem>
    </div>
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
      <UiButton @click="closeReviewModal" square variant="tertiary" class="absolute right-2 top-2">
        <SfIconClose />
      </UiButton>
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
      <UiButton @click="closeAuthentication" square variant="tertiary" class="absolute right-2 top-2">
        <SfIconClose />
      </UiButton>
    </header>
    <LoginComponent v-if="isLogin" @change-view="isLogin = false" @logged-in="closeAuth" />
    <Register v-else @change-view="isLogin = true" @registered="closeAuth" />
  </UiModal>
</template>

<script lang="ts" setup>
import { productGetters, reviewGetters } from '@plentymarkets/shop-api';
import {
  SfIconClose,
  SfIconStarFilled,
  SfLoaderCircular,
  SfProgressLinear,
  SfRating,
  useDisclosure,
} from '@storefront-ui/vue';
import { type ProductAccordionPropsType } from '~/components/ReviewsAccordion/types';
import { CreateReviewParams } from '@plentymarkets/shop-api';
import { defaults } from '~/composables';

const { product, totalReviews, reviewAverageText, reviewAverageStars } = defineProps<ProductAccordionPropsType>();

const emits = defineEmits(['on-list-change']);
const isLogin = ref(true);
const { t } = useI18n();
const { isOpen: isReviewOpen, open: openReviewModal, close: closeReviewModal } = useDisclosure();
const { isAuthorized } = useCustomer();
const { isOpen: isAuthenticationOpen, open: openAuthentication, close: closeAuthentication } = useDisclosure();
const viewport = useViewport();
const reviewsOpen = ref(true);
const route = useRoute();
const closeAuth = () => {
  closeAuthentication();
  isReviewOpen.value = true;
};

const productId = productGetters.getItemId(product);
const productVariationId = productGetters.getVariationId(product);
const accordionReference = ref<HTMLElement | null>(null);

const {
  data: productReviewsData,
  fetchProductReviews,
  createProductReview,
  loading: loadingReviews,
} = useProductReviews(Number(productId));

const { data: productReviewsAverage, fetchProductReviewAverage } = useProductReviewAverage(productId);
const paginatedProductReviews = computed(() => reviewGetters.getReviewItems(productReviewsData.value));
const pagination = computed(() => reviewGetters.getReviewPagination(productReviewsData.value));
const currentPage = computed(() => reviewGetters.getCurrentReviewsPage(productReviewsData.value));

const ratingPercentages = computed(() =>
  reviewGetters.getReviewCountsOrPercentagesByRatingDesc(productReviewsAverage.value, true),
);
const splitRatings = computed(() =>
  reviewGetters.getReviewCountsOrPercentagesByRatingDesc(productReviewsAverage.value),
);

const maxVisiblePages = computed(() => (viewport.isGreaterOrEquals('lg') ? 10 : 1));

const saveReview = async (form: CreateReviewParams) => {
  if (form.type === 'review') form.targetId = Number(productVariationId);

  closeReviewModal();
  await createProductReview(form).then(() => fetchReviews());
  emits('on-list-change');
};

async function fetchReviews() {
  await Promise.all([
    fetchProductReviews(Number(productId), productVariationId),
    fetchProductReviewAverage(Number(productId)),
  ]);
}

const deleteReview = () => fetchReviews();

watch(
  () => reviewsOpen.value,
  (value) => {
    if (value) fetchReviews();
  },
);

watch(
  () => route.query.feedbackPage,
  async () => {
    if (accordionReference.value) accordionReference.value.scrollIntoView({ behavior: 'smooth' });
  },
);

watch(
  () => route.query,
  () => fetchReviews(),
);
</script>
