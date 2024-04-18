<template>
  <article class="w-full p-4 mb-4 border rounded-md" data-testid="review">
    <div class="w-full flex">
      <div class="w-2/3">
        <p class="text-xs truncate text-neutral-400 mb-2">
          <span class="mr-2 text-xs text-neutral-700">{{ reviewGetters.getReviewAuthor(reviewItem) }}</span>
          <span v-if="verifiedPurchase">
            <SfIconCheck size="xs" class="mr-1" />
            {{ $t('review.verifiedPurchase') }}
          </span>
        </p>
      </div>
      <div v-if="isEditable" class="w-1/3 items-start flex justify-end space-x-3">
        <SfTooltip v-if="reviewGetters.getReviewVisibility(reviewItem)" :label="$t('review.toolTipVisibilityOn')">
          <SfIconVisibility size="sm" class="fill-neutral-400" />
        </SfTooltip>
        <SfTooltip v-else :label="$t('review.toolTipVisibilityOff')" class="w-3">
          <SfIconVisibilityOff size="sm" class="fill-neutral-400" />
        </SfTooltip>
        <SfLink @click="openReviewEdit">
          <SfIconTune size="sm" class="fill-primary-900" />
        </SfLink>
        <SfLink @click="openDelete">
          <SfIconDelete size="sm" class="fill-primary-900" />
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
      {{ $t(isCollapsed ? 'review.showAnswers' : 'review.hideAnswers') }}
    </button>
    <div class="ml-8">
      <div v-if="!isCollapsed">
        <div v-for="(replyItem, index) in replies" :key="index" class="mb-8 md:mr-16">
          <div class="flex items-center mb-2 text-xs">
            <p v-if="replyItem.authorName" class="flex font-medium">{{ replyItem.authorName }}</p>
            <p v-else class="flex font-medium">{{ $t('review.anonymous') }}</p>
            <p class="pl-2 text-neutral-500">{{ $d(new Date(reviewGetters.getReplyDate(replyItem))) }}</p>
            <div v-if="isAnswerEditable(replyItem)" class="w-full items-start flex justify-end space-x-3">
              <span v-if="isReviewVisible">
                <SfIconVisibility size="xs" class="fill-neutral-400" />
              </span>
              <span v-else>
                <SfIconVisibilityOff size="xs" class="fill-neutral-400" />
              </span>
              <span><SfIconTune size="xs" class="fill-primary-900" @click="openReplyEdit" /></span>
              <span><SfIconDelete size="xs" class="fill-primary-900" @click="openDelete" /></span>
            </div>
            <br />
          </div>
          <p class="text-sm">{{ replyItem.feedbackComment.comment.message }}</p>
        </div>
      </div>
      <div v-if="!isAnswerFormOpen && isAuthorized" class="actions flex justify-end">
        <SfButton variant="tertiary" size="sm" class="self-start" @click="isAnswerFormOpen = true">
          {{ $t('review.answer') }}
        </SfButton>
      </div>
      <template v-if="isAnswerFormOpen">
        <form data-testid="review-answer-form" class="mt-8 md:mr-16" @submit.prevent="$emit('on-submit', form)">
          <label class="block mb-2 text-sm font-medium text-neutral-500 w-1/2">
            <span>{{ $t('review.reviewAuthor') }}</span>
            <SfInput v-model="form.authorName" size="sm" class="font-normal text-sm"></SfInput>
          </label>
          <label class="my-4 block">
            <textarea
              v-model="form.message"
              class="block w-full py-2 pl-4 pr-3 min-h-[138px] text-sm rounded-md ring-1 ring-neutral-300 placeholder:text-neutral-500"
            />
            <span
              :class="[
                'block text-xs mt-0.5 text-right',
                answerIsAboveLimit ? 'text-negative-700 font-medium' : 'text-neutral-500',
              ]"
            >
              {{ answerCharsCount }}
            </span>
          </label>
          <div class="flex justify-end gap-x-4">
            <SfButton
              type="button"
              size="sm"
              variant="secondary"
              class="flex-1 md:flex-initial"
              @click="isAnswerFormOpen = false"
              >{{ $t('review.cancel') }}
            </SfButton>
            <SfButton @click.="isAnswerFormOpen = false" type="submit" size="sm" class="flex-1 md:flex-initial">{{
              $t('review.saveAnswer')
            }}</SfButton>
          </div>
        </form>
      </template>
    </div>
  </article>
  <UiModal
    v-model="isDeleteOpen"
    aria-labelledby="review-delete-modal"
    tag="section"
    role="dialog"
    class="max-h-full w-full overflow-auto md:w-[400px] md:h-fit"
  >
    <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="closeDelete">
      <SfIconClose />
    </SfButton>
    <div class="my-4">
      <span>{{ $t('review.areYouSure') }}</span>
    </div>

    <div class="flex justify-end gap-x-4">
      <SfButton type="button" variant="secondary" class="flex-1 md:flex-initial" @click="closeDelete">{{
        $t('review.cancel')
      }}</SfButton>
      <SfButton type="button" class="flex-1 md:flex-initial" @click="delReview">
        {{ $t('review.deleteReview') }}</SfButton
      >
    </div>
  </UiModal>
  <UiModal
    v-model="isReviewEditOpen"
    aria-labelledby="review-edit-modal"
    tag="section"
    role="dialog"
    class="h-fit md:w-[500px] m-0 p-0"
  >
    <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="closeReviewEdit">
      <SfIconClose />
    </SfButton>
    <ReviewEditForm :review-item="reviewItem" @on-close="closeReviewEdit" @on-submit="editReview"></ReviewEditForm>
  </UiModal>
  <UiModal
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
  SfIconTune,
  SfIconVisibility,
  SfIconVisibilityOff,
  SfIconClose,
  SfLink,
  SfTooltip,
  useDisclosure,
} from '@storefront-ui/vue';
import type { ReviewProps } from '~/components/ui/Review/types';
import { computed, ref } from 'vue';
import ReviewEditForm from '~/components/ReviewEditForm/ReviewEditForm.vue';
// import ReplyEditForm from '~/components/ReplyEditForm/ReplyEditForm.vue';
// import type { ReplyItem } from '@plentymarkets/shop-api';
import type { ReviewItem } from '@plentymarkets/shop-api';
defineEmits(['on-submit']);
const props = defineProps<ReviewProps>();
const { reviewItem } = toRefs(props);
// const replyItem = ref({} as ReplyItem);

const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useDisclosure();
const { isOpen: isReviewEditOpen, open: openReviewEdit, close: closeReviewEdit } = useDisclosure();
const { isOpen: isReplyEditOpen, open: openReplyEdit, close: closeReplyEdit } = useDisclosure();

const answerModelValue = ref('');
const answerCharacterLimit = ref(5000);
const answerIsAboveLimit = computed(() => answerModelValue.value.length > answerCharacterLimit.value);
const answerCharsCount = computed(() => answerCharacterLimit.value - answerModelValue.value.length);

const replies = reviewGetters.getReviewReplies(reviewItem.value);

const { isAuthorized } = useCustomer();
const verifiedPurchase = reviewGetters.getVerifiedPurchase(reviewItem.value);
const isReviewVisible = ref(reviewItem.value.isVisible);
const isAnswerFormOpen = ref(false);
const isCollapsed = ref(true);
const itemId = reviewItem.value.targetRelation.feedbackRelationTargetId;

const { deleteProductReview, setProductReview } = useProductReviews(Number(itemId));
const { data } = useCustomer();

const form = ref({
  title: '',
  authorName: '',
  ratingValue: undefined,
  message: '',
  type: 'reply',
  targetId: reviewItem.value.id,
  honeypot: '',
  titleMissing: true,
  ratingMissing: true,
});

const isAnswerEditable = (replyItem: ReviewItem) => {
  return replyItem.sourceRelation.feedbackRelationSourceId === data.value.user?.id?.toString();
};

const isEditable = computed(() => {
  return reviewItem.value.sourceRelation.feedbackRelationSourceId === data.value.user?.id?.toString();
});

const delReview = () => {
  if (reviewItem.value.id) {
    deleteProductReview(reviewItem.value.id);
  }
  closeDelete();
};

const editReview = async (form: any) => {
  const params = {
    feedbackId: form.targetId,
    message: form.message,
    title: form.title || undefined,
    ratingValue: form.ratingValue || undefined,
  };

  await setProductReview(params);

  closeReviewEdit();
  closeReplyEdit();
  isAnswerFormOpen.value = false;
};
</script>
