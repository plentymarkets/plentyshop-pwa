<template>
  <div class="max-w-[450px] md:max-w-[768px]">
    <form class="col-span-2" data-testid="create-review-form" @submit.prevent="onSubmit">
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

      <UiFormLabel for="review-title">{{ t('review.title') }} *</UiFormLabel>
      <SfInput
        v-model="title"
        v-bind="titleAttributes"
        :invalid="Boolean(errors['title'])"
        name="title"
        id="review-title"
      />
      <VeeErrorMessage as="div" name="title" class="text-negative-700 text-sm mt-1" />

      <UiFormLabel for="review-message" class="mt-4">{{ t('review.reviewText') }}</UiFormLabel>
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

      <UiFormLabel for="review-author">{{ t('review.reviewAuthor') }}</UiFormLabel>
      <SfInput
        v-model="authorName"
        v-bind="authorNameAttributes"
        :invalid="Boolean(errors['authorName'])"
        name="authorName"
        id="review-author"
      />
      <VeeErrorMessage as="div" name="authorName" class="text-negative-700 text-sm" />

      <p class="text-sm text-neutral-500 mt-4 mb-2">* {{ t('contact.form.asterixHint') }}</p>

      <div class="flex justify-end gap-x-4">
        <SfButton @click="$emit('on-close')" type="button" variant="secondary" class="flex-1 md:flex-initial">
          {{ t('review.cancel') }}
        </SfButton>
        <SfButton type="submit" class="flex-1 md:flex-initial">
          {{ t('review.submitReview') }}
        </SfButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { SfButton, SfRatingButton, SfTextarea, SfInput, useId } from '@storefront-ui/vue';
import { object, string, number } from 'yup';
import { useForm } from 'vee-validate';
import type { ReviewFormProps } from './types';
import { reviewGetters } from '@plentymarkets/shop-api';
import type { ReviewItem } from '@plentymarkets/shop-api';

const props = withDefaults(defineProps<ReviewFormProps>(), { reviewItem: null });
const { reviewItem } = toRefs(props);
const { t } = useI18n();

const emits = defineEmits(['on-close', 'on-submit']);

const validationSchema = toTypedSchema(
  object({
    ratingValue: number()
      .required(t('review.validation.ratingRequired'))
      .default(reviewItem.value ? reviewGetters.getReviewRating(reviewItem.value as unknown as ReviewItem) : null),
    title: string()
      .required(t('review.validation.titleRequired'))
      .default(reviewItem.value ? reviewGetters.getReviewTitle(reviewItem.value as unknown as ReviewItem) : ''),
    message: string()
      .optional()
      .max(500, t('review.validation.textareaMaxLength'))
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
const reviewCharacterLimit = 500;
const reviewIsAboveLimit = computed(() => (message?.value?.length ?? 0) > reviewCharacterLimit);
const reviewCharsCount = computed(() => reviewCharacterLimit - (message?.value?.length ?? 0));

onMounted(() => (ratingLabelId.value = useId()));

const sendReview = async () => {
  const form = {
    type: 'review',
    targetId: 0,
    feedbackId: reviewItem.value ? reviewGetters.getReviewId(reviewItem.value as unknown as ReviewItem) : 0,
    ratingValue: ratingValue.value,
    title: title.value,
    message: message.value,
    authorName: authorName.value,
  };

  emits('on-submit', form);
};

const onSubmit = handleSubmit(() => sendReview());
</script>
