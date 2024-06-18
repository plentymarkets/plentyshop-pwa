<template>
  <div class="relative col-span-5 md:sticky md:top-10 h-fit" :class="{ 'pointer-events-none opacity-50': loading }">
    <SfLoaderCircular v-if="loading" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />
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

        <div class="flex justify-start mb-4 lg:mb-0">
          <div class="lg:flex my-2">
            <div class="lg:w-1/2 flex flex-col lg:mr-8">
              <p class="text-center text-sm">{{ t('averageRating') }}</p>
              <div class="flex justify-center">
                <SfRating
                  class="pb-2"
                  size="lg"
                  :max="5"
                  :value="Math.floor(reviewAverage * 2) / 2"
                  :half-increment="true"
                />
                <h3 class="font-bold text-xl ml-2">
                  {{ Math.round(reviewAverage * 10) / 10 }}
                </h3>
              </div>
              <p class="text-xs text-center text-">{{ t('basedOnratings', { count: totalReviews }) }}</p>
              <SfButton
                @click="isAuthorized ? openReviewModal() : openAuthentication()"
                data-testid="create-review"
                class="mt-2 mb-4 mx-auto"
                size="base"
              >
                {{ t('createCustomerReview') }}
              </SfButton>
            </div>

            <div class="flex flex-col">
              <div v-for="(proportionalRating, key) in ratingPercentages" :key="key" class="flex items-center">
                <p class="w-4 text-center">{{ 5 - key }}</p>
                <SfIconStarFilled class="lg:mx-2 pb-1 text-warning-500" size="base" />
                <SfProgressLinear
                  class="self-center"
                  size="sm"
                  :value="proportionalRating"
                  aria-label="proportional-rating-in-percent"
                />
                <p class="ml-2 w-8 text-center">( {{ splitReviewsCount[key] }} )</p>
              </div>
            </div>
          </div>
        </div>

        <UiReview
          v-for="(reviewItem, key) in productReviews"
          :key="key"
          :review-item="reviewItem"
          @on-submit="saveReview"
          @review-updated="fetchReviews"
          @review-deleted="deleteReview"
        />
        <p v-if="!totalReviews && productReviews.length === 0" class="font-bold leading-6 w-full py-2">
          {{ t('customerReviewsNone') }}
        </p>
        <UiPagination
          v-if="productReviews.length > 0"
          :current-page="getFacetsFromURL().feedbackPage ?? 1"
          :total-items="totalReviews"
          :page-size="getFacetsFromURL().feedbacksPerPage ?? 1"
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
import { reviewGetters, productGetters } from '@plentymarkets/shop-api';
import {
  SfButton,
  SfIconClose,
  SfIconStarFilled,
  SfLoaderCircular,
  SfProgressLinear,
  SfRating,
  useDisclosure,
} from '@storefront-ui/vue';
import type { ProductAccordionPropsType } from '~/components/ReviewsAccordion/types';
import type { CreateReviewParams } from '@plentymarkets/shop-api';
const props = defineProps<ProductAccordionPropsType>();
const { getFacetsFromURL } = useCategoryFilter();
const emits = defineEmits(['on-list-change']);
const { product, totalReviews, reviewAverage } = toRefs(props);
const isLogin = ref(true);
const { send } = useNotification();
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

const productId = productGetters.getItemId(product.value);
const productVariationId = productGetters.getVariationId(product.value);

const {
  data: productReviewsData,
  fetchProductReviews,
  createProductReview,
  loading,
} = useProductReviews(Number(productId));

const productReviews = computed(() => reviewGetters.getReviewItems(productReviewsData.value));

const saveReview = async (form: CreateReviewParams) => {
  if (form.type === 'review') form.targetId = Number(productVariationId);

  closeReviewModal();
  await createProductReview(form).then(() => fetchReviews());
  emits('on-list-change');
  send({ type: 'positive', message: t('review.notification.success') });
};

const splitReviewsCount = computed((): number[] => {
  let splitReviewsTemporary = [0, 0, 0, 0, 0];

  for (const review of productReviews.value) {
    const rating = Number(review.feedbackRating.rating.ratingValue);
    if (rating >= 1 && rating <= 5) splitReviewsTemporary[5 - rating]++;
  }

  return splitReviewsTemporary;
});

const ratingPercentages = computed(() =>
  splitReviewsCount.value.map((review) => (review > 0 ? (review / Number(totalReviews.value)) * 100 : 0)),
);

async function fetchReviews() {
  await Promise.all([
    fetchProductReviews(Number(productGetters.getItemId(product.value)), productGetters.getVariationId(product.value)),
  ]);
}

const deleteReview = () => {
  fetchReviews();
  emits('on-list-change');
};
const maxVisiblePages = computed(() => (viewport.isGreaterOrEquals('lg') ? 10 : 1));

watch(
  () => reviewsOpen.value,
  (value) => {
    if (value) fetchReviews();
  },
  { immediate: true },
);
watch(
  () => route.query,
  async () => {
    fetchReviews();
  },
  { immediate: true },
);
</script>
