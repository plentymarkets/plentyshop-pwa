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
      <UiButton square variant="tertiary" class="absolute right-2 top-2" @click="closeReviewModal">
        <SfIconClose />
      </UiButton>
    </header>
    <div class="max-w-[450px] md:max-w-[768px]">
      <form class="col-span-2" @submit.prevent="onSubmit">
        <div v-if="isCreateReviewModal || isUpdateReviewModal" data-testid="rating-section">
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
          <ErrorMessage as="div" name="ratingValue" class="text-negative-700 text-sm -mt-3 mb-2" />
        </div>

        <template v-if="isCreateReviewModal || isUpdateReviewModal">
          <UiFormLabel class="mt-2" for="review-title">{{ t('review.title') }} *</UiFormLabel>
          <SfInput
            v-bind="titleAttributes"
            id="review-title"
            v-model="title"
            :invalid="Boolean(errors['title'])"
            name="title"
          />
          <ErrorMessage as="div" name="title" class="text-negative-700 text-sm mt-1" />
        </template>

        <UiFormLabel class="mt-4" for="review-author">{{ t('review.reviewAuthor') }}</UiFormLabel>
        <SfInput
          v-bind="authorNameAttributes"
          id="review-author"
          v-model="authorName"
          :invalid="Boolean(errors['authorName'])"
          name="authorName"
          data-testid="input-authorName"
        />
        <ErrorMessage as="div" name="authorName" class="text-negative-700 text-sm" />

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
          class="w-full max-h-80 min-h-16"
        />
        <ErrorMessage as="div" name="message" class="text-negative-700 text-sm mt-1" />
        <div v-if="!reviewIsAboveLimit" class="text-xs text-neutral-500 text-right">{{ reviewCharsCount }}</div>

        <p class="text-sm text-neutral-500 mt-4 mb-2">* {{ t('contact.form.asterixHint') }}</p>

        <div class="flex justify-end gap-x-4 mt-6">
          <UiButton type="button" variant="secondary" class="flex-1 md:flex-initial" @click="closeReviewModal">
            {{ t('review.cancel') }}
          </UiButton>
          <UiButton type="submit" class="flex-1 md:flex-initial">
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
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import type { ReviewFormProps } from './types';
import { productGetters, reviewGetters } from '@plentymarkets/shop-api';
import type { ReviewItem } from '@plentymarkets/shop-api';
import { defaults } from '~/composables';

const { reviewItem = null } = defineProps<ReviewFormProps>();
const { t } = useI18n();
const { currentProduct } = useProducts();
const { createProductReview, setProductReview, closeReviewModal, modalType } = useProductReviews(
  Number(productGetters.getItemId(currentProduct.value)),
  productGetters.getVariationId(currentProduct.value),
);

const reviewCharacterLimit = defaults.REPLY_CHARACTER_LIMIT;
const isCreateReviewModal = computed(() => defaults.DEFAULT_REVIEW_MODAL_TYPES.createReview === modalType.value);
const isUpdateReviewModal = computed(() => defaults.DEFAULT_REVIEW_MODAL_TYPES.updateReview === modalType.value);
const isReplyUpdateModal = computed(() => defaults.DEFAULT_REVIEW_MODAL_TYPES.updateReply === modalType.value);

const validationSchema = toTypedSchema(
  object({
    ratingValue: number()
      .required(t('review.validation.ratingRequired'))
      .min(1, t('review.validation.ratingRequired'))
      .default(reviewGetters.getReviewRating(reviewItem ?? ({} as ReviewItem))),
    title: string()
      .required(t('review.validation.titleRequired'))
      .default(reviewGetters.getReviewTitle(reviewItem ?? ({} as ReviewItem))),
    message: string()
      .optional()
      .max(reviewCharacterLimit, t('review.validation.textareaMaxLength'))
      .default(reviewGetters.getReviewMessage(reviewItem ?? ({} as ReviewItem))),
    authorName: string()
      .optional()
      .default(reviewGetters.getReviewAuthor(reviewItem ?? ({} as ReviewItem))),
  }),
);

const validationSchemaReply = toTypedSchema(
  object({
    ratingValue: number().optional(),
    title: string().optional(),
    message: string()
      .required()
      .max(reviewCharacterLimit, t('review.validation.textareaMaxLength'))
      .default(reviewGetters.getReviewMessage(reviewItem ?? ({} as ReviewItem))),
    authorName: string()
      .optional()
      .default(reviewGetters.getReviewAuthor(reviewItem ?? ({} as ReviewItem))),
  }),
);

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: isReplyUpdateModal.value ? validationSchemaReply : validationSchema,
});

const [ratingValue, ratingValueAttributes] = defineField('ratingValue');
const [title, titleAttributes] = defineField('title');
const [message, messageAttributes] = defineField('message');
const [authorName, authorNameAttributes] = defineField('authorName');
const ratingLabelId = ref('');

const reviewIsAboveLimit = computed(() => (message?.value?.length ?? 0) > reviewCharacterLimit);
const reviewCharsCount = computed(() => reviewCharacterLimit - (message?.value?.length ?? 0));

onMounted(() => (ratingLabelId.value = useId()));

const sendReview = async () => {
  const params = {
    type: 'review',
    targetId: productGetters.getVariationId(currentProduct.value),
    ratingValue: ratingValue?.value ?? 0,
    title: title.value || '',
    message: message.value,
    authorName: authorName.value,
    feedbackId: Number(reviewGetters.getReviewId(reviewItem ?? ({} as ReviewItem))),
  };

  if (reviewItem) {
    setProductReview(params);
  } else {
    createProductReview(params);
  }
};

const onSubmit = handleSubmit(() => sendReview());
</script>
