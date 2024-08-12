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

        <UiReviewStatistics :product="product" />

        <UiReview
          v-for="(reviewItem, key) in paginatedProductReviews"
          :key="key"
          :review-item="reviewItem"
          @on-submit="saveReview"
        />
        <p v-if="paginatedProductReviews.length === 0" class="font-bold leading-6 w-full py-2">
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
</template>

<script lang="ts" setup>
import { productGetters, reviewGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
import { type ProductAccordionPropsType } from '~/components/ReviewsAccordion/types';
import { CreateReviewParams } from '@plentymarkets/shop-api';
import { defaults } from '~/composables';

const { product } = defineProps<ProductAccordionPropsType>();

const { t } = useI18n();

const viewport = useViewport();
const reviewsOpen = ref(true);
const route = useRoute();

const productId = Number(productGetters.getItemId(product));
const productVariationId = productGetters.getVariationId(product);
const accordionReference = ref<HTMLElement | null>(null);

const {
  data: productReviews,
  loading: loadingReviews,
  fetchReviews,
} = useProductReviews(productId, productVariationId);

const paginatedProductReviews = computed(() => reviewGetters.getReviewItems(productReviews.value));
const pagination = computed(() => reviewGetters.getReviewPagination(productReviews.value));
const currentPage = computed(() => reviewGetters.getCurrentReviewsPage(productReviews.value));

const maxVisiblePages = computed(() => (viewport.isGreaterOrEquals('lg') ? 10 : 1));

const saveReview = async (form: CreateReviewParams) => {};

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
