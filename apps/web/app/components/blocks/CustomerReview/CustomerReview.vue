<template>
  <div ref="reviewArea" class="relative col-span-5 h-fit" :class="{ 'pointer-events-none opacity-50': loadingReviews }">
    <SfLoaderCircular v-if="loadingReviews" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />

    <div v-if="props.content.layout.collapsible" id="customerReviewsAccordion" data-testid="reviews-accordion">
      <UiAccordionItem
        v-model="reviewsOpen"
        summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none"
      >
        <template #summary>
          <h2 id="customerReviewsClick" class="font-bold text-lg leading-6 md:text-2xl">
            {{ props.content.text.title }}
          </h2>
        </template>

        <UiReviewStatistics :product="props.product" />

        <UiReview v-for="(reviewItem, key) in paginatedProductReviews" :key="key" :review-item="reviewItem" />
        <p
          v-if="paginatedProductReviews.length === 0"
          data-testid="no-review-text"
          class="font-bold leading-6 w-full py-2"
        >
          {{ t('customerReviewsNone') }}
        </p>
        <UiPagination
          v-if="paginatedProductReviews.length > 0"
          :key="pagination.totalCount"
          :current-page="currentPage"
          :total-items="pagination.totalCount"
          :page-size="config.defaultItemsPerPage"
          :max-visible-pages="maxVisiblePages"
          current-page-name="feedbackPage"
        />
      </UiAccordionItem>
    </div>

    <div v-else>
      <h2 id="customerReviewsClick" class="font-bold text-lg leading-6 md:text-2xl">
        {{ props.content.text.title }}
      </h2>

      <UiReviewStatistics :product="props.product" />

      <UiReview v-for="(reviewItem, key) in paginatedProductReviews" :key="key" :review-item="reviewItem" />
      <p
        v-if="paginatedProductReviews.length === 0"
        data-testid="no-review-text"
        class="font-bold leading-6 w-full py-2"
      >
        {{ t('customerReviewsNone') }}
      </p>
      <UiPagination
        v-if="paginatedProductReviews.length > 0"
        :key="pagination.totalCount"
        :current-page="currentPage"
        :total-items="pagination.totalCount"
        :page-size="config.defaultItemsPerPage"
        :max-visible-pages="maxVisiblePages"
        current-page-name="feedbackPage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { productGetters, reviewGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
import type { ProductAccordionPropsType } from '~/components/ReviewsAccordion/types';
import type { CustomerReviewProps } from './types';

const props = defineProps<CustomerReviewProps & ProductAccordionPropsType>();

const { t } = useI18n();

const viewport = useViewport();
const reviewsOpen = ref(!props.content.layout.initiallyCollapsed);
const route = useRoute();

const config = useRuntimeConfig().public;

const productId = Number(productGetters.getItemId(props.product));
const productVariationId = productGetters.getVariationId(props.product);

const {
  data: productReviews,
  loading: loadingReviews,
  fetchReviews,
  reviewArea,
} = useProductReviews(productId, productVariationId);

const paginatedProductReviews = computed(() => reviewGetters.getReviewItems(productReviews.value));
const pagination = computed(() => reviewGetters.getReviewPagination(productReviews.value));
const currentPage = computed(() => reviewGetters.getCurrentReviewsPage(productReviews.value));

const maxVisiblePages = computed(() => (viewport.isGreaterOrEquals('lg') ? 5 : 2));

watch(
  () => reviewsOpen.value,
  (value) => {
    if (value) fetchReviews();
  },
);

watch(
  () => route.query.feedbackPage,
  async () => {
    if (reviewArea.value) reviewArea.value.scrollIntoView({ behavior: 'smooth' });
  },
);

watch(
  () => route.query,
  () => fetchReviews(),
);

watch(
  () => props.content.layout.initiallyCollapsed,
  (newValue) => {
    reviewsOpen.value = !newValue;
  },
);
</script>
