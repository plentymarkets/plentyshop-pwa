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
    <header>
      <UiButton
        :aria-label="t('closeDialog')"
        square
        variant="tertiary"
        class="absolute right-2 top-2"
        @click="isReviewModalOpen = false"
      >
        <SfIconClose />
      </UiButton>
    </header>

    <div class="w-full">
      <template v-if="isAuthorized">
        <UiDeleteReview v-if="isDeleteModal" />
        <ReviewForm v-else :review-item="review" />
      </template>
      <template v-else>
        <LoginComponent v-if="isLogin" @change-view="isLogin = false" />
        <Register v-else @change-view="isLogin = true" />
      </template>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { SfIconClose } from '@storefront-ui/vue';
import { defaults } from '~/composables';

const { t } = useI18n();
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
