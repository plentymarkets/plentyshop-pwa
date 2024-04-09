<template>
  <div class="max-w-[450px] md:max-w-[768px] h-[500px]">
    <h3 class="font-bold py-2 pl-4 pr-3 typography-headline-4">{{ $t('review.editReviewFormTitle') }}</h3>
    <form
      class="grid grid-cols-[100px_1fr] py-2 px-4 gap-4 md:grid-cols-[176px_1fr] grid-rows-[100px_1fr] md:grid-rows-[28px_1fr] items-center md:items-start"
      data-testid="edit-review-form"
      @submit.prevent="$emit('on-submit', form)"
    >
      <div class="col-span-2">
        <div class="flex items-center justify-between">
          <p :id="ratingLabelId" class="typography-label-sm font-medium text-neutral-900">
            {{ $t('review.yourRating') }}
          </p>
          <SfRatingButton v-model="form.ratingValue" :aria-labelledby="ratingLabelId" class="p-1 gap-x-2" />
        </div>
        <label class="block mb-6">
          <span class="block mb-0.5 typography-label-sm font-medium">{{ $t('review.title') }}</span>
          <SfInput disabled wrapper-class="!bg-disabled-100 !ring-disabled-300 !ring-1" v-model="form.title"/>
        </label>
        <label class="my-4 block">
          <span class="block typography-label-sm font-medium mb-0.5 text-neutral-900">{{
            $t('review.reviewText')
          }}</span>
          <textarea
            v-model="form.message"
            class="block w-full py-2 pl-4 pr-3 min-h-[138px] rounded-md ring-1 ring-neutral-300 placeholder:text-neutral-500"
          >
              {{ reviewGetters.getReviewMessage(reviewItem) }}
            </textarea
          >
          <span
            :class="[
              'block text-xs mt-0.5 text-right',
              reviewIsAboveLimit ? 'text-negative-700 font-medium' : 'text-neutral-500',
            ]"
          >
            {{ reviewCharsCount }}
          </span>
        </label>
        <label class="block mb-6">
          <span class="block mb-0.5 typography-label-sm font-medium text-neutral-900">{{
            $t('review.reviewAuthor')
          }}</span>
          <SfInput disabled wrapper-class="!bg-disabled-100 !ring-disabled-300 !ring-1" v-model="form.authorName" class="text-neutral-700 bg-gray-400" />
        </label>
        <div class="flex justify-end gap-x-4">
          <SfButton type="button" variant="secondary" class="flex-1 md:flex-initial" @click="$emit('on-close')">{{
            $t('review.cancel')
          }}</SfButton>
          <SfButton type="submit" class="flex-1 md:flex-initial">{{ $t('review.submitReview') }}</SfButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { reviewGetters } from '@plentymarkets/shop-sdk';
import { SfButton, SfRatingButton, SfInput, useId } from '@storefront-ui/vue';
import type { ReviewEditFormProps } from '~/components/ReviewEditForm/types';
defineEmits(['on-close', 'on-submit']);
const props = defineProps<ReviewEditFormProps>();
const reviewItem = props.reviewItem;

const form = ref({
  title: reviewGetters.getReviewTitle(reviewItem),
  authorName: reviewGetters.getReviewAuthor(reviewItem),
  ratingValue: reviewGetters.getReviewRating(reviewItem),
  message: reviewGetters.getReviewMessage(reviewItem),
  type: 'review',
  targetId: reviewGetters.getReviewId(reviewItem),
  honeypot: '',
  titleMissing: false,
  ratingMissing: false,
});

const ratingLabelId = useId();
const ratingModelValue = ref();
const usernameModelValue = ref('');
const reviewModelValue = ref('');
const reviewCharacterLimit = ref(500);
const reviewIsAboveLimit = computed(() => reviewModelValue.value.length > reviewCharacterLimit.value);
const reviewCharsCount = computed(() => reviewCharacterLimit.value - reviewModelValue.value.length);
</script>
