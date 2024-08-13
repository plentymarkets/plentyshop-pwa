<template>
  <div class="">
    <template v-if="isDeleteReviewModal">
      <h3 class="font-bold py-2 typography-headline-4">{{ t('review.deleteReview') }}</h3>
      <div class="mb-6">{{ t('review.areYouSure') }}</div>
    </template>

    <template v-if="isDeleteReplyModal">
      <h3 class="font-bold py-2 typography-headline-4">{{ t('review.deleteAnswer') }}</h3>
      <div class="mb-6">{{ t('review.answerAreYouSure') }}</div>
    </template>

    <div class="flex gap-x-4">
      <UiButton @click="closeReviewModal" type="button" variant="secondary" class="flex-1">
        {{ t('review.cancel') }}
      </UiButton>
      <UiButton @click="deleteProductReview" type="button" class="flex-1">
        {{ t('review.deleteReviewConfirmation') }}
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { defaults } from '~/composables';

const { t } = useI18n();
const { currentProduct } = useProducts();

const productId = Number(productGetters.getItemId(currentProduct.value));

const { closeReviewModal, deleteProductReview, modalType } = useProductReviews(productId);

const isDeleteReviewModal = computed(() => defaults.DEFAULT_REVIEW_MODAL_TYPES.deleteReview === modalType.value);
const isDeleteReplyModal = computed(() => defaults.DEFAULT_REVIEW_MODAL_TYPES.deleteReply === modalType.value);
</script>
