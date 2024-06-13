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
      <SfButton
        @click="isAuthorized ? openReviewModal() : openAuthentication()"
        data-testid="create-review"
        class="mt-2 mb-4"
        size="base"
      >
        {{ t('createCustomerReview') }}
      </SfButton>
      <div v-if="loading" class="w-full flex justify-center items-center">
        <SfLoaderCircular class="absolute" size="sm" />
      </div>
      <UiReview
        v-for="(reviewItem, key) in productReviews"
        :key="key"
        :review-item="reviewItem"
        @on-submit="saveReview"
        @review-updated="refreshReviews"
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
import { SfButton, SfIconClose, SfLoaderCircular, useDisclosure } from '@storefront-ui/vue';
import type { ProductAccordionPropsType } from '~/components/ReviewsAccordion/types';
import type { CreateReviewParams } from '@plentymarkets/shop-api';
const props = defineProps<ProductAccordionPropsType>();
const { getFacetsFromURL } = useCategoryFilter();
const emits = defineEmits(['on-list-change']);
const { product, totalReviews } = toRefs(props);
const isLogin = ref(true);
const { send } = useNotification();
const { t } = useI18n();
const { isOpen: isReviewOpen, open: openReviewModal, close: closeReviewModal } = useDisclosure();
const { isAuthorized } = useCustomer();
const { isOpen: isAuthenticationOpen, open: openAuthentication, close: closeAuthentication } = useDisclosure();
const viewport = useViewport();
const reviewsOpen = ref(false);
const route = useRoute();
const closeAuth = () => {
  closeAuthentication();
  isReviewOpen.value = true;
};

const {
  data: productReviewsData,
  fetchProductReviews,
  createProductReview,
  loading,
} = useProductReviews(Number(productGetters.getItemId(product.value)));

const productReviews = computed(() => {
  return reviewGetters.getReviewItems(productReviewsData.value);
});

const refreshReviews = () => {
  fetchProductReviews(Number(productGetters.getItemId(product.value)), productGetters.getVariationId(product.value));
};

const saveReview = async (form: CreateReviewParams) => {
  if (form.type === 'review') form.targetId = Number(productGetters.getVariationId(product.value));

  closeReviewModal();
  await createProductReview(form).then(() => refreshReviews());
  emits('on-list-change');
  send({ type: 'positive', message: t('review.notification.success') });
};

const deleteReview = () => {
  refreshReviews();
  emits('on-list-change');
};
const maxVisiblePages = computed(() => (viewport.isGreaterOrEquals('lg') ? 10 : 1));

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
watch(
  () => route.query,
  async () => {
    fetchProductReviews(Number(productGetters.getItemId(product.value)), productGetters.getVariationId(product.value));
  },
);
</script>
