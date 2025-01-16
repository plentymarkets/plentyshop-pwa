<template>
  <article class="w-full p-4 mb-4 border rounded-md" data-testid="review-item">
    <div class="w-full flex">
      <div class="w-2/3 text-xs truncate text-neutral-400 mb-2">
        <span class="mr-2 text-xs text-neutral-700" data-testid="review-item-authorName">{{ reviewAuthor }}</span>
        <span v-if="verifiedPurchase" class="text-green-800">
          <SfIconCheck size="xs" class="mr-1" />
          {{ t('review.verifiedPurchase') }}
        </span>
      </div>

      <div v-if="isEditable" class="w-1/3 flex justify-end items-center space-x-3">
        <SfTooltip :label="tooltipReviewLabel" class="flex">
          <SfIconVisibility v-if="isReviewVisibile" size="sm" class="fill-neutral-400" />
          <SfIconVisibilityOff v-else size="sm" class="fill-neutral-400" />
        </SfTooltip>
        <SfIconBase
          viewBox="0 0 32 32"
          size="xs"
          class="fill-primary-700 cursor-pointer"
          data-testid="edit-review-button"
          @click="openReviewModal(defaults.DEFAULT_REVIEW_MODAL_TYPES.updateReview, reviewItem)"
        >
          <path :d="penPath" />
        </SfIconBase>
        <SfIconDelete
          size="sm"
          class="fill-primary-700 cursor-pointer"
          data-testid="remove-review-button"
          @click="openReviewModal(defaults.DEFAULT_REVIEW_MODAL_TYPES.deleteReview, reviewItem)"
        />
      </div>
    </div>

    <header>
      <p class="font-medium mb-2" data-testid="review-item-title">{{ reviewGetters.getReviewTitle(reviewItem) }}</p>
      <div class="flex items-center pr-2 pb-2 text-xs text-neutral-500">
        <SfRating :value="reviewGetters.getReviewRating(reviewItem) ?? undefined" :max="5" size="xs" class="mr-2" />
        {{ $d(new Date(reviewGetters.getReviewDate(reviewItem))) }}
      </div>
    </header>

    <p class="text-sm text-neutral-900">{{ reviewGetters.getReviewMessage(reviewItem) }}</p>

    <button
      v-if="reviewItem.replies.length > 0"
      type="button"
      class="inline-block text-sm font-normal border-b-2 border-black cursor-pointer w-fit hover:text-primary-500 hover:border-primary-800"
      data-testid="show-replies"
      @click="isCollapsed = !isCollapsed"
    >
      {{ t(isCollapsed ? 'review.showAnswers' : 'review.hideAnswers') }}
    </button>

    <div class="ml-8">
      <template v-if="!isCollapsed">
        <div
          v-for="(reply, index) in replies"
          :key="index"
          :class="{ 'mt-5': index === 0, 'mb-5': index < replies.length - 1 }"
          class="md:mr-16"
          data-testid="reply-item"
        >
          <div class="flex items-center mb-2 text-xs">
            <div class="w-full">
              <span class="font-medium" data-testid="reply-item-authorName">
                {{ reply.authorName || t('review.anonymous') }}
              </span>
              <span class="pl-2 text-neutral-500">{{ $d(new Date(reviewGetters.getReplyDate(reply))) }}</span>
            </div>

            <div v-if="isAnswerEditable(reply)" class="w-full flex justify-end items-center space-x-3">
              <SfTooltip :label="tooltipReplyLabel(reply)" class="flex">
                <SfIconVisibility v-if="reviewGetters.getReviewVisibility(reply)" size="xs" class="fill-neutral-400" />
                <SfIconVisibilityOff v-else size="xs" class="fill-neutral-400" />
              </SfTooltip>
              <SfIconBase
                viewBox="0 0 38 38"
                size="xs"
                class="fill-primary-700 cursor-pointer"
                data-testid="edit-reply-button"
                @click="openReviewModal(defaults.DEFAULT_REVIEW_MODAL_TYPES.updateReply, reply)"
              >
                <path :d="penPath" />
              </SfIconBase>
              <SfIconDelete
                size="xs"
                class="fill-primary-700 cursor-pointer"
                data-testid="remove-reply-button"
                @click="openReviewModal(defaults.DEFAULT_REVIEW_MODAL_TYPES.deleteReply, reply)"
              />
            </div>
            <br />
          </div>
          <p class="text-sm">{{ reviewGetters.getReviewMessage(reply) }}</p>
        </div>
      </template>

      <div v-if="!isAnswerFormOpen && isAuthorized" class="actions flex justify-end">
        <UiButton
          variant="tertiary"
          size="sm"
          class="self-start"
          data-testid="add-reply-button"
          @click="isAnswerFormOpen = true"
        >
          {{ t('review.answer') }}
        </UiButton>
      </div>
      <ReplyForm v-if="isAnswerFormOpen" :review-item="reviewItem" @on-close="isAnswerFormOpen = false" />
    </div>
  </article>
</template>

<script setup lang="ts">
import {
  SfRating,
  SfIconCheck,
  SfIconDelete,
  SfIconVisibility,
  SfIconVisibilityOff,
  SfTooltip,
  SfIconBase,
} from '@storefront-ui/vue';
import type { ReviewProps } from './types';
import { type ReviewItem, reviewGetters, productGetters } from '@plentymarkets/shop-api';
import { defaults } from '~/composables';
import { penPath } from '~/assets/icons/paths/pen';

const props = defineProps<ReviewProps>();
const { t } = useI18n();
const { reviewItem } = toRefs(props);
const isAnswerFormOpen = ref(false);
const isCollapsed = ref(true);

const { data: sessionData, isAuthorized } = useCustomer();
const { currentProduct } = useProducts();
const { openReviewModal } = useProductReviews(Number(productGetters.getItemId(currentProduct.value)));

const reviewAuthor = computed(() => reviewGetters.getReviewAuthor(reviewItem.value) || t('review.anonymous'));
const replies = computed(() => reviewGetters.getReviewReplies(reviewItem.value));
const verifiedPurchase = reviewGetters.getVerifiedPurchase(reviewItem.value);
const isReviewVisibile = reviewGetters.getReviewVisibility(reviewItem.value);
const tooltipReviewLabel = isReviewVisibile ? t('review.tooltipVisibilityOn') : t('review.tooltipVisibilityOff');

const tooltipReplyLabel = (reply: ReviewItem) =>
  reviewGetters.getReviewVisibility(reply) ? t('review.tooltipVisibilityOn') : t('review.tooltipVisibilityOff');

const isAnswerEditable = (replyItem: ReviewItem) =>
  replyItem.sourceRelation[0].feedbackRelationSourceId === sessionData.value.user?.id?.toString();

const isEditable = computed(
  () => reviewItem.value.sourceRelation[0].feedbackRelationSourceId === sessionData.value.user?.id?.toString(),
);
</script>
