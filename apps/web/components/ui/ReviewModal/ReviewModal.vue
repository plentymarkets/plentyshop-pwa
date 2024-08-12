<template>
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
import { SfIconClose } from '@storefront-ui/vue';
import { productGetters } from '@plentymarkets/shop-api';

const { currentProduct } = useProducts();

const productId = Number(productGetters.getItemId(currentProduct.value));

const { t } = useI18n();
const { isAuthorized } = useCustomer();
const { isReviewModalOpen, closeReviewModal } = useProductReviews(productId);

const isLogin = ref(true);
const dataTestId = computed(() => (isAuthorized.value ? 'review' : 'login') + '-modal');
</script>
