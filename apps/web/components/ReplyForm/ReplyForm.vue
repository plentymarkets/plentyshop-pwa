<template>
  <form @submit.prevent="onSubmit" data-testid="review-answer-form" class="mt-8 lg:mr-16">
    <h3 class="font-bold typography-headline-4 mb-2">{{ t('review.createAnswerFormTitle') }}</h3>

    <UiFormLabel for="reply-author">{{ t('review.reviewAuthor') }}</UiFormLabel>
    <SfInput
      v-model="authorName"
      v-bind="authorNameAttributes"
      :invalid="Boolean(errors['authorName'])"
      name="authorName"
      id="reply-author"
      size="sm"
      class="font-normal text-sm"
    />
    <VeeErrorMessage as="div" name="authorName" class="text-negative-700 text-sm" />

    <UiFormLabel for="reply-msg" class="mt-4">{{ t('review.yourAnswer') }} *</UiFormLabel>
    <SfTextarea
      v-model="message"
      v-bind="messageAttributes"
      :invalid="Boolean(errors['message'])"
      id="reply-msg"
      name="message"
      size="lg"
      class="w-full"
    />
    <VeeErrorMessage as="div" name="message" class="text-negative-700 text-sm mt-1" />
    <div v-if="!answerIsAboveLimit" class="text-xs text-neutral-500 text-right">{{ answerCharsCount }}</div>

    <p class="text-sm text-neutral-500 mb-2">* {{ t('contact.form.asterixHint') }}</p>

    <div class="flex justify-end gap-x-4">
      <SfButton type="button" size="sm" variant="secondary" class="flex-1 md:flex-initial" @click="$emit('on-close')"
        >{{ t('review.cancel') }}
      </SfButton>
      <SfButton type="submit" size="sm" class="flex-1 md:flex-initial">
        {{ t('review.saveAnswer') }}
      </SfButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { SfButton, SfInput, SfTextarea } from '@storefront-ui/vue';
import { object, string } from 'yup';
import { useForm } from 'vee-validate';

const emits = defineEmits(['on-close', 'on-submit']);

const { t } = useI18n();
const answerCharacterLimit = 500;
const validationSchema = toTypedSchema(
  object({
    authorName: string().optional().default(''),
    message: string()
      .required(t('review.validation.textareaRequired'))
      .max(500, t('review.validation.textareaMaxLength'))
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

const onSubmit = handleSubmit(() =>
  emits('on-submit', {
    targetId: 0,
    authorName: authorName.value,
    message: message.value,
    type: 'reply',
  }),
);
</script>
