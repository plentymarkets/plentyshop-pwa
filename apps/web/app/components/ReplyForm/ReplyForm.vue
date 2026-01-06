<template>
  <form data-testid="review-answer-form" class="mt-8 lg:mr-16" @submit.prevent="onSubmit">
    <h3 class="font-bold typography-headline-4 mb-2">{{ t('review.createAnswerFormTitle') }}</h3>

    <UiFormLabel for="reply-author">{{ t('review.reviewAuthor') }}</UiFormLabel>
    <SfInput
      v-bind="authorNameAttributes"
      id="reply-author"
      v-model="authorName"
      :invalid="Boolean(errors['authorName'])"
      name="authorName"
      size="sm"
      class="font-normal text-sm"
    />
    <ErrorMessage as="div" name="authorName" class="text-negative-700 text-sm" />

    <UiFormLabel for="reply-msg" class="mt-4">{{ t('review.yourAnswer') }} *</UiFormLabel>
    <SfTextarea
      v-bind="messageAttributes"
      id="reply-msg"
      v-model="message"
      :invalid="Boolean(errors['message'])"
      name="message"
      size="lg"
      class="w-full"
    />
    <ErrorMessage as="div" name="message" class="text-negative-700 text-sm mt-1" />
    <div v-if="!answerIsAboveLimit" class="text-xs text-neutral-500 text-right">{{ answerCharsCount }}</div>

    <p class="text-sm text-neutral-500 mb-2">* {{ t('contact.form.asterixHint') }}</p>

    <div class="flex justify-end gap-x-4">
      <UiButton type="button" size="sm" variant="secondary" class="flex-1 md:flex-initial" @click="$emit('on-close')"
        >{{ t('review.cancel') }}
      </UiButton>
      <UiButton type="submit" size="sm" class="flex-1 md:flex-initial">
        {{ t('review.saveAnswer') }}
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { SfInput, SfTextarea } from '@storefront-ui/vue';
import { object, string } from 'yup';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { defaults } from '~/composables';
import { reviewGetters, productGetters } from '@plentymarkets/shop-api';
import type { ReplyFormProps } from '~/components/ReplyForm/types';

const emits = defineEmits(['on-close']);

const props = defineProps<ReplyFormProps>();

const { t } = useI18n();
const { currentProduct } = useProducts();
const { createProductReview } = useProductReviews(
  Number(productGetters.getItemId(currentProduct.value)),
  productGetters.getVariationId(currentProduct.value),
);

const answerCharacterLimit = defaults.REPLY_CHARACTER_LIMIT;
const validationSchema = toTypedSchema(
  object({
    authorName: string().optional().default(''),
    message: string()
      .required(t('review.validation.textareaRequired'))
      .max(answerCharacterLimit, t('review.validation.textareaMaxLength'))
      .default(''),
  }),
);

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: validationSchema,
});

const [message, messageAttributes] = defineField('message');
const [authorName, authorNameAttributes] = defineField('authorName');
const answerIsAboveLimit = computed(() => (message?.value?.length ?? 0) > answerCharacterLimit);
const answerCharsCount = computed(() => answerCharacterLimit - (message?.value?.length ?? 0));

const onSubmit = handleSubmit(() => {
  const params = {
    targetId: Number(reviewGetters.getReviewId(props.reviewItem)),
    authorName: authorName.value,
    message: message.value,
    type: 'reply',
    ratingValue: 0,
    title: '',
  };

  createProductReview(params);

  emits('on-close');
});
</script>
