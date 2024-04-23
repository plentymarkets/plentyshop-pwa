<template>
  <article class="w-full p-4 mb-4 border rounded-md" data-testid="review">
    <div class="w-full flex">
      <div class="w-2/3 text-xs truncate text-neutral-400 mb-2">
        <span class="mr-2 text-xs text-neutral-700">{{ reviewGetters.getReviewAuthor(reviewItem) }}</span>
        <span v-if="verifiedPurchase">
          <SfIconCheck size="xs" class="mr-1" />
          {{ t('review.verifiedPurchase') }}
        </span>
      </div>

      <div v-if="isEditable" class="w-1/3 items-start flex justify-end space-x-3">
        <SfTooltip
          v-if="reviewGetters.getReviewVisibility(reviewItem)"
          :label="
            reviewGetters.getReviewVisibility(reviewItem)
              ? t('review.toolTipVisibilityOn')
              : t('review.toolTipVisibilityOff')
          "
        >
          <SfIconVisibility v-if="reviewGetters.getReviewVisibility(reviewItem)" size="sm" class="fill-neutral-400" />
          <SfIconVisibilityOff v-else size="sm" class="fill-neutral-400" />
        </SfTooltip>
        <SfLink @click="openReviewEdit">
          <SfIconTune size="sm" class="fill-primary-900 cursor-pointer" />
        </SfLink>
        <SfLink @click="openDelete">
          <SfIconDelete size="sm" class="fill-primary-900 cursor-pointer" />
        </SfLink>
      </div>
    </div>

    <header>
      <p class="font-medium mb-2">{{ reviewGetters.getReviewTitle(reviewItem) }}</p>
      <span class="flex items-center pr-2 pb-2 text-xs text-neutral-500">
        <SfRating :value="reviewGetters.getReviewRating(reviewItem) ?? undefined" :max="5" size="xs" class="mr-2" />
        {{ $d(new Date(reviewGetters.getReviewDate(reviewItem))) }}
      </span>
    </header>

    <p class="pb-2 text-sm text-neutral-900">{{ reviewGetters.getReviewMessage(reviewItem) }}</p>

    <button
      v-if="reviewItem.replies.length > 0"
      type="button"
      class="inline-block mb-2 text-sm font-normal border-b-2 border-black cursor-pointer w-fit hover:text-primary-700 hover:border-primary-800"
      @click="isCollapsed = !isCollapsed"
    >
      {{ t(isCollapsed ? 'review.showAnswers' : 'review.hideAnswers') }}
    </button>

    <div class="ml-8">
      <div v-if="!isCollapsed">
        <div v-for="(replyItem, index) in replies" :key="index" class="mb-8 md:mr-16">
          <div class="flex items-center mb-2 text-xs">
            <p class="flex font-medium">{{ replyItem.authorName ? replyItem.authorName : t('review.anonymous') }}</p>
            <p class="pl-2 text-neutral-500">{{ $d(new Date(reviewGetters.getReplyDate(replyItem))) }}</p>
            <div v-if="isAnswerEditable(replyItem)" class="w-full items-start flex justify-end space-x-3">
              <SfIconVisibility v-if="isReviewVisible" size="xs" class="fill-neutral-400" />
              <SfIconVisibilityOff v-else size="xs" class="fill-neutral-400" />
              <SfIconTune size="xs" class="fill-primary-900" @click="openReplyEdit" />
              <SfIconDelete size="xs" class="fill-primary-900" @click="openDelete" />
            </div>
            <br />
          </div>
          <p class="text-sm">{{ replyItem.feedbackComment.comment.message }}</p>
        </div>
      </div>

      <div v-if="!isAnswerFormOpen && isAuthorized" class="actions flex justify-end">
        <SfButton variant="tertiary" size="sm" class="self-start" @click="isAnswerFormOpen = true">
          {{ t('review.answer') }}
        </SfButton>
      </div>

      <form
        v-if="isAnswerFormOpen"
        @submit.prevent="$emit('on-submit', form)"
        data-testid="review-answer-form"
        class="mt-8 lg:mr-16"
      >
        <h3 class="font-bold typography-headline-4 mb-2">{{ t('review.createAnswerFormTitle') }}</h3>

        <label for="answer-author" class="block mb-2 text-sm font-medium">
          {{ t('review.reviewAuthor') }}
        </label>
        <SfInput v-model="form.authorName" size="sm" id="answer-author" class="font-normal text-sm" />

        <label for="your-answer" class="block mt-4 mb-2 text-sm font-medium">{{ t('review.yourAnswer') }} *</label>
        <textarea
          v-model="form.message"
          id="your-answer"
          class="block w-full py-2 pl-4 pr-3 min-h-[138px] text-sm rounded-md ring-1 ring-neutral-300 placeholder:text-neutral-500"
        />
        <div :class="['block text-xs text-right', answerIsAboveLimit ? 'text-negative-700' : 'text-neutral-500']">
          {{ answerCharsCount }}
        </div>

        <p class="text-sm text-neutral-500 mb-2">* {{ t('contact.form.asterixHint') }}</p>

        <div class="flex justify-end gap-x-4">
          <SfButton
            type="button"
            size="sm"
            variant="secondary"
            class="flex-1 md:flex-initial"
            @click="isAnswerFormOpen = false"
            >{{ t('review.cancel') }}
          </SfButton>
          <SfButton @click="isAnswerFormOpen = false" size="sm" class="flex-1 md:flex-initial">
            {{ t('review.saveAnswer') }}
          </SfButton>
        </div>
      </form>
    </div>
  </article>

  <UiModal
    v-if="isDeleteOpen"
    v-model="isDeleteOpen"
    aria-labelledby="review-delete-modal"
    tag="section"
    role="dialog"
    class="max-h-full w-full overflow-auto md:w-[400px] md:h-fit"
  >
    <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="closeDelete">
      <SfIconClose />
    </SfButton>
    <h3 class="font-bold py-2 typography-headline-4">
      {{ t('review.deleteReview') }}
    </h3>

    <div class="mb-6">{{ t('review.areYouSure') }}</div>

    <div class="flex gap-x-4">
      <SfButton type="button" variant="secondary" class="flex-1" @click="closeDelete">
        {{ t('review.cancel') }}
      </SfButton>
      <SfButton type="button" class="flex-1" @click="deleteReview">
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
    <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="closeReviewEdit">
      <SfIconClose />
    </SfButton>
    <ReviewForm :review-item="reviewItem" @on-close="closeReviewEdit" @on-submit="editReview"></ReviewForm>
  </UiModal>

  <UiModal
    v-if="isReplyEditOpen"
    v-model="isReplyEditOpen"
    aria-labelledby="reply-edit-modal"
    tag="section"
    role="dialog"
    class="md:w-[500px] m-0 p-0"
  >
    <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="closeReplyEdit">
      <SfIconClose />
    </SfButton>
    <ReplyEditForm :reply-item="reviewItem" @on-close="closeReplyEdit" @on-submit="editReview"></ReplyEditForm>
  </UiModal>
</template>

<script setup lang="ts">
import { reviewGetters } from '@plentymarkets/shop-sdk';
import {
  SfRating,
  SfIconCheck,
  SfButton,
  SfInput,
  SfIconDelete,
  SfIconVisibility,
  SfIconVisibilityOff,
  SfIconClose,
  SfLink,
  SfTooltip,
  useDisclosure,
  SfIconTune,
} from '@storefront-ui/vue';
import type { ReviewProps } from './types';
import ReviewForm from '~/components/ReviewForm/ReviewForm.vue';
import type { ReviewItem, UpdateReviewParams } from '@plentymarkets/shop-api';

const props = defineProps<ReviewProps>();
const emits = defineEmits(['on-submit', 'review-updated', 'review-deleted']);

const { send } = useNotification();
const { t } = useI18n();
const { reviewItem } = toRefs(props);
const answerCharacterLimit = 500;
const isReviewVisible = ref(reviewItem.value.isVisible);
const isAnswerFormOpen = ref(false);
const isCollapsed = ref(true);
const form = ref({
  targetId: reviewItem.value.id,
  title: '',
  authorName: '',
  ratingValue: undefined,
  message: '',
  type: 'reply',
  honeypot: '',
  titleMissing: true,
  ratingMissing: true,
});

const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useDisclosure();
const { isOpen: isReviewEditOpen, open: openReviewEdit, close: closeReviewEdit } = useDisclosure();
const { isOpen: isReplyEditOpen, open: openReplyEdit, close: closeReplyEdit } = useDisclosure();
const { data: sessionData, isAuthorized } = useCustomer();
const { deleteProductReview, setProductReview } = useProductReviews(
  Number(reviewItem.value.targetRelation.feedbackRelationTargetId),
);

const answerIsAboveLimit = computed(() => form.value.message.length > answerCharacterLimit);
const answerCharsCount = computed(() => answerCharacterLimit - form.value.message.length);

const replies = reviewGetters.getReviewReplies(reviewItem.value);
const verifiedPurchase = reviewGetters.getVerifiedPurchase(reviewItem.value);

const isAnswerEditable = (replyItem: ReviewItem) =>
  replyItem.sourceRelation[0].feedbackRelationSourceId === sessionData.value.user?.id?.toString();

const isEditable = computed(
  () => reviewItem.value.sourceRelation[0].feedbackRelationSourceId === sessionData.value.user?.id?.toString(),
);

const deleteReview = async () => {
  closeDelete();
  if (reviewItem.value.id) await deleteProductReview(reviewItem.value.id).then(() => emits('review-deleted'));
};

const editReview = async (form: UpdateReviewParams) => {
  closeReviewEdit();
  await setProductReview(form).then(() => emits('review-updated'));
  send({
    type: 'positive',
    message: t('review.notification.success'),
  });
};
</script>
