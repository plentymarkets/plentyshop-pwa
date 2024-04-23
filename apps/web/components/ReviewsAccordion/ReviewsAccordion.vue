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
      <div class="text-lg font-medium ml-8">
        {{ isLogin ? t('auth.login.heading') : t('auth.signup.heading') }}
      </div>
      <SfButton @click="closeAuthentication" square variant="tertiary" class="absolute right-2 top-2">
        <SfIconClose />
      </SfButton>
    </header>
    <LoginComponent v-if="isLogin" @change-view="isLogin = false" @logged-in="closeAuthentication" />
    <Register v-else @change-view="isLogin = true" @registered="closeAuthentication" />
  </UiModal>
</template>

<script lang="ts" setup>
import { SfButton, SfIconClose, SfLoaderCircular, useDisclosure } from '@storefront-ui/vue';
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
  const targetId = Number(productGetters.getVariationId(product.value));
  form.targetId = targetId;

  closeReviewModal();
  await createProductReview(form).then(() => refreshReviews());
  send({
    type: 'positive',
    message: t('review.notification.success'),
  });
};

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
