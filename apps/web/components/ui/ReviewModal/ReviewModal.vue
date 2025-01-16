<template>
  <UiModal
    v-if="isReviewModalOpen"
    v-model="isReviewModalOpen"
    aria-labelledby="review-modal"
    tag="section"
    role="dialog"
    class="h-full md:w-[500px] md:h-fit m-0 p-0 overflow-y-auto"
    :data-testid="dataTestId"
  >
    <template v-if="isAuthorized">
      <UiDeleteReview v-if="isDeleteModal" />
      <ReviewForm v-else :review-item="review" />
    </template>
    <template v-else>
      <LoginComponent v-if="isLogin" skip-reload @change-view="isLogin = false" />
      <Register v-else @change-view="isLogin = true" />
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { defaults } from '~/composables';

const { currentProduct } = useProducts();

const productId = Number(productGetters.getItemId(currentProduct.value));

const { isAuthorized } = useCustomer();
const { isReviewModalOpen, review, modalType } = useProductReviews(productId);

const isDeleteModal = computed(() =>
  [defaults.DEFAULT_REVIEW_MODAL_TYPES.deleteReview, defaults.DEFAULT_REVIEW_MODAL_TYPES.deleteReply].includes(
    modalType.value,
  ),
);

const isLogin = ref(true);
const dataTestId = computed(() => (isAuthorized.value ? 'review' : 'login') + '-modal');
</script>
