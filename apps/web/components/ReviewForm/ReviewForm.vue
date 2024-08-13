<template>
  <div data-testid="review-form">
    <header>
      <h3 class="font-bold typography-headline-4">
        <template v-if="isCreateReviewModal">
          {{ t('review.createReviewFormTitle') }}
        </template>
        <template v-if="isReplyUpdateModal">
          {{ t('review.editReplyFormTitle') }}
        </template>
      </h3>
      <UiButton @click="closeReviewModal" square variant="tertiary" class="absolute right-2 top-2">
        <SfIconClose />
      </UiButton>
    </header>
    <div class="max-w-[450px] md:max-w-[768px]">
      <form class="col-span-2">
        <template v-if="isCreateReviewModal || isUpdateReviewModal">
          <div class="flex items-center justify-between">
            <p :id="ratingLabelId" class="typography-label-sm font-medium text-neutral-900">
              {{ t('review.yourRating') }} *
            </p>
            <SfRatingButton
              v-model="ratingValue"
              v-bind="ratingValueAttributes"
              :aria-labelledby="ratingLabelId"
              :invalid="Boolean(errors['ratingValue'])"
              name="ratingValue"
              class="p-1 gap-x-2"
            />
          </div>
          <VeeErrorMessage as="div" name="ratingValue" class="text-negative-700 text-sm -mt-3 mb-2" />
        </template>

        <template v-if="isCreateReviewModal || isUpdateReviewModal">
          <UiFormLabel for="review-title">{{ t('review.title') }} *</UiFormLabel>
          <SfInput
            v-model="title"
            v-bind="titleAttributes"
            :invalid="Boolean(errors['title'])"
            name="title"
            id="review-title"
          />
          <VeeErrorMessage as="div" name="title" class="text-negative-700 text-sm mt-1" />
        </template>

        <UiFormLabel for="review-author">{{ t('review.reviewAuthor') }}</UiFormLabel>
        <SfInput
          v-model="authorName"
          v-bind="authorNameAttributes"
          :invalid="Boolean(errors['authorName'])"
          name="authorName"
          id="review-author"
        />
        <VeeErrorMessage as="div" name="authorName" class="text-negative-700 text-sm" />

        <UiFormLabel for="review-message" class="mt-4">
          <template v-if="isReplyUpdateModal">
            {{ t('review.yourAnswer') }}
            {{ $t('asterisk') }}
          </template>
          <template v-else-if="isCreateReviewModal || isUpdateReviewModal">
            {{ t('review.reviewText') }}
          </template>
        </UiFormLabel>
        <SfTextarea
          id="review-message"
          v-model="message"
          v-bind="messageAttributes"
          :invalid="Boolean(errors['message'])"
          size="lg"
          name="message"
          class="w-full"
        />
        <VeeErrorMessage as="div" name="message" class="text-negative-700 text-sm mt-1" />
        <div v-if="!reviewIsAboveLimit" class="text-xs text-neutral-500 text-right">{{ reviewCharsCount }}</div>

        <p class="text-sm text-neutral-500 mt-4 mb-2">* {{ t('contact.form.asterixHint') }}</p>

        <div class="flex justify-end gap-x-4">
          <UiButton @click="closeReviewModal" type="button" variant="secondary" class="flex-1 md:flex-initial">
            {{ t('review.cancel') }}
          </UiButton>
          <UiButton @click="sendReview()" type="submit" class="flex-1 md:flex-initial">
            {{ t('review.submitReview') }}
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SfRatingButton, SfTextarea, SfInput, SfIconClose, useId } from '@storefront-ui/vue';
import { object, string, number } from 'yup';
import { useForm } from 'vee-validate';
import type { ReviewFormProps } from './types';
import { productGetters, reviewGetters } from '@plentymarkets/shop-api';
import type { ReviewItem } from '@plentymarkets/shop-api';
import { defaults } from '~/composables';

const props = withDefaults(defineProps<ReviewFormProps>(), { reviewItem: null });
const { reviewItem } = toRefs(props);
const { t } = useI18n();
const { currentProduct } = useProducts();
const { createProductReview, setProductReview, closeReviewModal, modalType } = useProductReviews(
  Number(productGetters.getItemId(currentProduct.value)),
  productGetters.getVariationId(currentProduct.value),
);

const reviewCharacterLimit = defaults.REPLY_CHARACTER_LIMIT;

const validationSchema = toTypedSchema(
  object({
    ratingValue: number()
      .required(t('review.validation.ratingRequired'))
      .default(reviewGetters.getReviewRating(reviewItem.value ?? ({} as ReviewItem))),
    title: string()
      .required(t('review.validation.titleRequired'))
      .default(reviewGetters.getReviewTitle(reviewItem.value ?? ({} as ReviewItem))),
    message: string()
      .optional()
      .max(reviewCharacterLimit, t('review.validation.textareaMaxLength'))
      .default(reviewItem.value ? reviewGetters.getReviewMessage(reviewItem.value as unknown as ReviewItem) : ''),
    authorName: string()
      .optional()
      .default(reviewItem.value ? reviewGetters.getReviewAuthor(reviewItem.value as unknown as ReviewItem) : ''),
  }),
);

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: validationSchema,
});

const [ratingValue, ratingValueAttributes] = defineField('ratingValue');
const [title, titleAttributes] = defineField('title');
const [message, messageAttributes] = defineField('message');
const [authorName, authorNameAttributes] = defineField('authorName');
const ratingLabelId = ref('');

const isCreateReviewModal = computed(() => defaults.DEFAULT_REVIEW_MODAL_TYPES.createReview === modalType.value);
const isUpdateReviewModal = computed(() => defaults.DEFAULT_REVIEW_MODAL_TYPES.updateReview === modalType.value);
const isReplyUpdateModal = computed(() => defaults.DEFAULT_REVIEW_MODAL_TYPES.updateReply === modalType.value);
const reviewIsAboveLimit = computed(() => (message?.value?.length ?? 0) > reviewCharacterLimit);
const reviewCharsCount = computed(() => reviewCharacterLimit - (message?.value?.length ?? 0));

onMounted(() => (ratingLabelId.value = useId()));

const sendReview = () => {
  const params = {
    type: 'review',
    targetId: productGetters.getVariationId(currentProduct.value),
    ratingValue: ratingValue?.value ?? 0,
    title: title.value || '',
    message: message.value,
    authorName: authorName.value,
    feedbackId: Number(reviewGetters.getReviewId(reviewItem.value ?? ({} as ReviewItem))),
  };

  if (reviewItem.value) {
    setProductReview(params);
  } else {
    createProductReview(params);
  }
};
</script>
