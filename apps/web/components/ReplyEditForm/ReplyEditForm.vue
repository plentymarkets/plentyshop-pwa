<template>
  <div class="max-w-[450px] md:max-w-[768px]">
    <h3 class="font-bold py-2 typography-headline-4">
      {{ t('review.editReplyFormTitle') }}
    </h3>

    <form class="col-span-2" data-testid="edit-reply-form" @submit.prevent="onSubmit">
      <div class="col-span-2">
        <UiFormLabel for="reply-author">{{ t('review.reviewAuthor') }}</UiFormLabel>
        <SfInput
          v-model="authorName"
          v-bind="authorNameAttributes"
          :invalid="Boolean(errors['authorName'])"
          name="authorName"
          id="reply-author"
        />
        <VeeErrorMessage as="div" name="authorName" class="text-negative-700 text-sm" />

        <UiFormLabel for="reply-message" class="mt-4">{{ t('review.yourAnswer') }} *</UiFormLabel>
        <SfTextarea
          v-model="message"
          v-bind="messageAttributes"
          :invalid="Boolean(errors['message'])"
          id="reply-message"
          name="message"
          size="lg"
          class="w-full"
        />
        <VeeErrorMessage as="div" name="message" class="text-negative-700 text-sm mt-1" />
        <div v-if="!reviewIsAboveLimit" class="text-xs text-neutral-500 text-right">{{ reviewCharsCount }}</div>

        <p class="text-sm text-neutral-500 mt-4 mb-2">* {{ t('contact.form.asterixHint') }}</p>

        <div class="flex justify-end gap-x-4">
          <SfButton type="button" variant="secondary" class="flex-1 md:flex-initial" @click="$emit('on-close')">
            {{ t('review.cancel') }}
          </SfButton>
          <SfButton type="submit" class="flex-1 md:flex-initial">
            {{ t('review.saveAnswer') }}
          </SfButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { reviewGetters } from '@plentymarkets/shop-api';
import { SfButton, SfInput, SfTextarea } from '@storefront-ui/vue';
import { object, string } from 'yup';
import { useForm } from 'vee-validate';
import type { ReplyEditFormProps } from './types';
import type { ReviewItem } from '@plentymarkets/shop-api';
const emits = defineEmits(['on-close', 'on-submit']);
const props = defineProps<ReplyEditFormProps>();
const { replyItem } = toRefs(props);
const { t } = useI18n();

const validationSchema = toTypedSchema(
  object({
    authorName: string()
      .optional()
      .default(replyItem.value ? reviewGetters.getReplyAuthor(replyItem.value as unknown as ReviewItem) : ''),
    message: string()
      .required(t('review.validation.textareaRequired'))
      .max(500, t('review.validation.textareaMaxLength'))
      .default(replyItem.value ? reviewGetters.getReplyMessage(replyItem.value as unknown as ReviewItem) : ''),
  }),
);

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: validationSchema,
});

const [message, messageAttributes] = defineField('message');
const [authorName, authorNameAttributes] = defineField('authorName');
const reviewCharacterLimit = 500;
const reviewIsAboveLimit = computed(() => (message?.value?.length ?? 0) > reviewCharacterLimit);
const reviewCharsCount = computed(() => reviewCharacterLimit - (message?.value?.length ?? 0));

const sendReply = async () => {
  const form = {
    type: 'reply',
    feedbackId: replyItem.value.id,
    message: message.value,
    authorName: authorName.value,
  };

  emits('on-submit', form);
};

const onSubmit = handleSubmit(() => sendReply());
</script>
