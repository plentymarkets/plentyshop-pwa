<template>
  <article class="w-full p-4 mb-4 border rounded-md" data-testid="review">
    <div class="w-full flex">
      <div class="w-2/3 text-xs truncate text-neutral-400 mb-2">
        <span class="mr-2 text-xs text-neutral-700">{{ reviewAuthor }}</span>
        <SfIconCheck v-if="verifiedPurchase" size="xs" class="mr-1" />
        {{ t('review.verifiedPurchase') }}
      </div>

      <div v-if="isEditable" class="w-1/3 flex justify-end items-center space-x-3">
        <SfTooltip :label="tooltipReviewLabel" class="flex">
          <SfIconVisibility v-if="isReviewVisibile" size="sm" class="fill-neutral-400" />
          <SfIconVisibilityOff v-else size="sm" class="fill-neutral-400" />
        </SfTooltip>
        <SfIconBase @click="openReviewEdit" viewBox="0 0 32 32" size="xs" class="fill-primary-900 cursor-pointer">
          <path
            d="M31.25 7.003c0-0 0-0.001 0-0.001 0-0.346-0.14-0.659-0.365-0.886l-5-5c-0.227-0.226-0.539-0.366-0.885-0.366s-0.658 0.14-0.885 0.366v0l-20.999 20.999c-0.146 0.146-0.256 0.329-0.316 0.532l-0.002 0.009-2 7c-0.030 0.102-0.048 0.22-0.048 0.342 0 0.691 0.559 1.251 1.25 1.252h0c0.126-0 0.248-0.019 0.363-0.053l-0.009 0.002 6.788-2c0.206-0.063 0.383-0.17 0.527-0.311l-0 0 21.211-21c0.229-0.226 0.37-0.539 0.371-0.886v-0zM8.133 26.891l-4.307 1.268 1.287-4.504 14.891-14.891 3.219 3.187zM25 10.191l-3.228-3.196 3.228-3.228 3.229 3.228z"
          />
        </SfIconBase>
        <SfIconDelete @click="openDeleteReview" size="sm" class="fill-primary-900 cursor-pointer" />
      </div>
    </div>

    <header>
      <p class="font-medium mb-2">{{ reviewGetters.getReviewTitle(reviewItem) }}</p>
      <div class="flex items-center pr-2 pb-2 text-xs text-neutral-500">
        <SfRating :value="reviewGetters.getReviewRating(reviewItem) ?? undefined" :max="5" size="xs" class="mr-2" />
        {{ $d(new Date(reviewGetters.getReviewDate(reviewItem))) }}
      </div>
    </header>

    <p class="text-sm text-neutral-900">{{ reviewGetters.getReviewMessage(reviewItem) }}</p>

    <button
      v-if="reviewItem.replies.length > 0"
      type="button"
      class="inline-block text-sm font-normal border-b-2 border-black cursor-pointer w-fit hover:text-primary-700 hover:border-primary-800"
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
        >
          <div class="flex items-center mb-2 text-xs">
            <div class="w-full">
              <span class="font-medium">
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
                @click="openReplyEditor(reply)"
                viewBox="0 0 38 38"
                size="xs"
                class="fill-primary-900 cursor-pointer"
              >
                <path
                  d="M31.25 7.003c0-0 0-0.001 0-0.001 0-0.346-0.14-0.659-0.365-0.886l-5-5c-0.227-0.226-0.539-0.366-0.885-0.366s-0.658 0.14-0.885 0.366v0l-20.999 20.999c-0.146 0.146-0.256 0.329-0.316 0.532l-0.002 0.009-2 7c-0.030 0.102-0.048 0.22-0.048 0.342 0 0.691 0.559 1.251 1.25 1.252h0c0.126-0 0.248-0.019 0.363-0.053l-0.009 0.002 6.788-2c0.206-0.063 0.383-0.17 0.527-0.311l-0 0 21.211-21c0.229-0.226 0.37-0.539 0.371-0.886v-0zM8.133 26.891l-4.307 1.268 1.287-4.504 14.891-14.891 3.219 3.187zM25 10.191l-3.228-3.196 3.228-3.228 3.229 3.228z"
                />
              </SfIconBase>
              <SfIconDelete @click="openReplyDeletion(reply)" size="xs" class="fill-primary-900 cursor-pointer" />
            </div>
            <br />
          </div>
          <p class="text-sm">{{ reply.feedbackComment.comment.message }}</p>
        </div>
      </template>

      <div v-if="!isAnswerFormOpen && isAuthorized" class="actions flex justify-end">
        <SfButton @click="isAnswerFormOpen = true" variant="tertiary" size="sm" class="self-start">
          {{ t('review.answer') }}
        </SfButton>
      </div>
      <ReplyForm v-if="isAnswerFormOpen" @on-close="isAnswerFormOpen = false" @on-submit="sendReply" />
    </div>
  </article>

  <UiModal
    v-if="isDeleteReviewOpen"
    v-model="isDeleteReviewOpen"
    aria-labelledby="review-delete-modal"
    tag="section"
    role="dialog"
    class="max-h-full w-full overflow-auto md:w-[400px] md:h-fit"
  >
    <SfButton @click="closeDeleteReview" square variant="tertiary" class="absolute right-2 top-2">
      <SfIconClose />
    </SfButton>
    <h3 class="font-bold py-2 typography-headline-4">{{ t('review.deleteReview') }}</h3>
    <div class="mb-6">{{ t('review.areYouSure') }}</div>

    <div class="flex gap-x-4">
      <SfButton @click="closeDeleteReview" type="button" variant="secondary" class="flex-1">
        {{ t('review.cancel') }}
      </SfButton>
      <SfButton @click="deleteReview" type="button" class="flex-1">
        {{ t('review.deleteReviewConfirmation') }}
      </SfButton>
    </div>
  </UiModal>

  <UiModal
    v-if="isReplyDeleteOpen"
    v-model="isReplyDeleteOpen"
    aria-labelledby="review-delete-modal"
    tag="section"
    role="dialog"
    class="max-h-full w-full overflow-auto md:w-[400px] md:h-fit"
  >
    <SfButton @click="closeReplyDelete" square variant="tertiary" class="absolute right-2 top-2">
      <SfIconClose />
    </SfButton>
    <h3 class="font-bold py-2 typography-headline-4">{{ t('review.deleteAnswer') }}</h3>
    <div class="mb-6">{{ t('review.answerAreYouSure') }}</div>

    <div class="flex gap-x-4">
      <SfButton @click="closeReplyDelete" type="button" variant="secondary" class="flex-1">
        {{ t('review.cancel') }}
      </SfButton>
      <SfButton @click="deleteReply" type="button" class="flex-1">
        {{ t('review.deleteReviewConfirmation') }}
      </SfButton>
    </div>
  </UiModal>

  <UiModal
    v-if="isReviewEditOpen"
    v-model="isReviewEditOpen"
    aria-labelledby="review-edit-modal"
    tag="section"
    role="dialog"
    class="h-fit md:w-[500px] m-0 p-0"
  >
    <SfButton @click="closeReviewEdit" square variant="tertiary" class="absolute right-2 top-2">
      <SfIconClose />
    </SfButton>
    <ReviewForm :review-item="reviewItem" @on-close="closeReviewEdit" @on-submit="editReview" />
  </UiModal>

  <UiModal
    v-if="isReplyEditOpen"
    v-model="isReplyEditOpen"
    aria-labelledby="reply-edit-modal"
    tag="section"
    role="dialog"
    class="h-fit md:w-[500px] m-0 p-0"
  >
    <SfButton @click="closeReplyEdit" square variant="tertiary" class="absolute right-2 top-2">
      <SfIconClose />
    </SfButton>
    <ReplyEditForm :reply-item="replyItem" @on-close="closeReplyEdit" @on-submit="editReply" />
  </UiModal>
</template>

<script setup lang="ts">
import {
  SfRating,
  SfIconCheck,
  SfButton,
  SfIconDelete,
  SfIconVisibility,
  SfIconVisibilityOff,
  SfIconClose,
  SfTooltip,
  useDisclosure,
  SfIconBase,
} from '@storefront-ui/vue';
import type { ReviewProps } from './types';
import ReviewForm from '~/components/ReviewForm/ReviewForm.vue';
import ReplyForm from '~/components/ReplyForm/ReplyForm.vue';
import {
  type CreateReviewParams,
  type ReviewItem,
  type UpdateReviewParams,
  reviewGetters,
} from '@plentymarkets/shop-api';

const props = defineProps<ReviewProps>();
const emits = defineEmits(['on-submit', 'review-updated', 'review-deleted']);
const { send } = useNotification();
const { t } = useI18n();
const { reviewItem } = toRefs(props);
const isAnswerFormOpen = ref(false);
const isCollapsed = ref(true);
const replyItem = ref({} as ReviewItem);

const reviewAuthor = reviewGetters.getReviewAuthor(reviewItem.value) || t('review.anonymous');
const { isOpen: isDeleteReviewOpen, open: openDeleteReview, close: closeDeleteReview } = useDisclosure();
const { isOpen: isReviewEditOpen, open: openReviewEdit, close: closeReviewEdit } = useDisclosure();
const { isOpen: isReplyEditOpen, open: openReplyEdit, close: closeReplyEdit } = useDisclosure();
const { isOpen: isReplyDeleteOpen, open: openReplyDelete, close: closeReplyDelete } = useDisclosure();
const { data: sessionData, isAuthorized } = useCustomer();
const { deleteProductReview, setProductReview } = useProductReviews(
  Number(reviewItem.value.targetRelation.feedbackRelationTargetId),
);
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

const deleteReview = async () => {
  closeDeleteReview();
  if (reviewItem.value.id) await deleteProductReview(reviewItem.value.id).then(() => emits('review-deleted'));
};

const editReview = async (form: UpdateReviewParams) => {
  closeReviewEdit();
  await setProductReview(form).then(() => emits('review-updated'));
  send({ type: 'positive', message: t('review.notification.success') });
};

const sendReply = async (form: CreateReviewParams) => {
  isAnswerFormOpen.value = false;
  form.targetId = Number(reviewItem.value.id);
  emits('on-submit', form);
};

const openReplyEditor = (item: ReviewItem) => {
  openReplyEdit();
  replyItem.value = item;
};

const editReply = async (form: UpdateReviewParams) => {
  closeReplyEdit();
  await setProductReview(form).then(() => emits('review-updated'));
  send({ type: 'positive', message: t('review.notification.answerSuccess') });
};

const openReplyDeletion = (item: ReviewItem) => {
  openReplyDelete();
  replyItem.value = item;
};

const deleteReply = async () => {
  closeReplyDelete();
  if (replyItem.value.id) await deleteProductReview(replyItem.value.id).then(() => emits('review-deleted'));
};
</script>
