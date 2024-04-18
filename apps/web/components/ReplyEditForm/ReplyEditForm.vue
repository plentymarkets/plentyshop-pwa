<template>
  <div class="max-w-[450px] md:max-w-[768px] h-[300px]">
    <h3 class="font-bold py-2 pl-4 pr-3 typography-headline-4">{{ $t('review.editReplyFormTitle') }}</h3>
    <form
      class="grid grid-cols-[100px_1fr] py-2 px-4 gap-4 md:grid-cols-[176px_1fr] grid-rows-[100px_1fr] md:grid-rows-[28px_1fr] items-center md:items-start"
      data-testid="edit-reply-form"
      @submit.prevent="$emit('on-submit', form)"
    >
      <div class="col-span-2">
        <label class="my-4 block">
          <label class="block mb-6">
            <span class="block mb-0.5 typography-label-sm font-medium text-neutral-900">
              {{ $t('review.reviewAuthor') }}
            </span>
            <SfInput disabled wrapper-class="!bg-disabled-100 !ring-disabled-300 !ring-1" v-model="form.authorName" />
          </label>
          <span class="block typography-label-sm font-medium mb-0.5 text-neutral-900">
            {{ $t('review.reviewText') }}
          </span>
          <textarea
            v-model="form.message"
            class="block w-full py-2 pl-4 pr-3 min-h-[138px] rounded-md ring-1 ring-neutral-300 placeholder:text-neutral-500"
          />
          <span
            :class="[
              'block text-xs mt-0.5 text-right',
              reviewIsAboveLimit ? 'text-negative-700 font-medium' : 'text-neutral-500',
            ]"
          >
            {{ reviewCharsCount }}
          </span>
        </label>
        <div class="flex justify-end gap-x-4">
          <SfButton type="button" variant="secondary" class="flex-1 md:flex-initial" @click="$emit('on-close')">
            {{ $t('review.cancel') }}
          </SfButton>
          <SfButton type="submit" class="flex-1 md:flex-initial">
            {{ $t('review.submitReview') }}
          </SfButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { reviewGetters } from '@plentymarkets/shop-sdk';
import { SfButton, SfInput } from '@storefront-ui/vue';
import type { ReplyEditFormProps } from '~/components/ReplyEditForm/types';
defineEmits(['on-close', 'on-submit']);
const props = defineProps<ReplyEditFormProps>();
const replyItem = props.replyItem;

const form = ref({
  title: undefined,
  authorName: reviewGetters.getReplyAuthor(replyItem),
  ratingValue: undefined,
  message: reviewGetters.getReplyMessage(replyItem),
  type: 'reply',
  targetId: reviewGetters.getReplyTargetId(replyItem),
  honeypot: '',
  titleMissing: true,
  ratingMissing: true,
});

// const ratingLabelId = useId();
// const ratingModelValue = ref();
// const usernameModelValue = ref('');
const reviewModelValue = ref('');
const reviewCharacterLimit = ref(500);
const reviewIsAboveLimit = computed(() => reviewModelValue.value.length > reviewCharacterLimit.value);
const reviewCharsCount = computed(() => reviewCharacterLimit.value - reviewModelValue.value.length);
</script>
