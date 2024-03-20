<template>
  <article class="w-full p-4 border rounded-md" data-testid="review">
    <p class="pb-2 font-medium">{{ reviewGetters.getReviewAuthor(reviewItem) }}</p>
    <header class="flex flex-col pb-2 md:flex-row md:justify-between">
      <span class="flex items-center pr-2 text-xs text-neutral-500">
        <SfRating :value="reviewGetters.getReviewRating(reviewItem) ?? undefined" :max="5" size="xs" class="mr-2" />
        {{ $d(new Date(reviewGetters.getReviewDate(reviewItem))) }}
      </span>
      <p class="flex items-center text-xs truncate text-primary-700">
        <span class="mr-2 text-xs text-neutral-500">{{ reviewGetters.getReviewAuthor(reviewItem) }}</span>
        <SfIconCheck size="xs" class="mr-1" /> {{ $t('review.verifiedPurchase') }}
      </p>
    </header>
    <p class="pb-2 text-sm text-neutral-900">{{ truncatedContent }}</p>
    <button
      v-if="isButtonVisible"
      type="button"
      class="inline-block mb-2 text-sm font-normal border-b-2 border-black cursor-pointer w-fit hover:text-primary-700 hover:border-primary-800"
      @click="isCollapsed = !isCollapsed"
    >
      {{ $t(isCollapsed ? 'readMore' : 'readLess') }}
    </button>
    <div v-if="!isAnswerFormOpen" class="actions flex justify-end">
      <SfButton variant="tertiary" size="sm" class="self-start" @click="isAnswerFormOpen = true">
        {{ $t('review.answer') }}
      </SfButton>
    </div>
    <template v-if="isAnswerFormOpen">
      <div class="mx-24">
        <form
          data-testid="review-answer-form"
          class="mt-8"
        >
          <label class="block mb-2 text-sm font-medium text-neutral-500 w-1/2">
            <span>{{ $t('review.reviewAuthor') }}</span>
            <SfInput size="sm" class="font-normal text-sm"></SfInput>
          </label>
          <label class="my-4 block">
            <textarea
                v-model="reviewModelValue"
                class="block w-full py-2 pl-4 pr-3 min-h-[138px] text-sm rounded-md ring-1 ring-neutral-300 placeholder:text-neutral-500"
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
            <SfButton type="button" size="sm" variant="secondary" class="flex-1 md:flex-initial" @click="isAnswerFormOpen = false">{{ $t('review.cancel') }}</SfButton>
            <SfButton type="submit" size="sm" class="flex-1 md:flex-initial" @click="$emit('on-submit')">{{ $t('review.saveAnswer') }}</SfButton>
          </div>
        </form>
      </div>
    </template>
  </article>
</template>

<script setup lang="ts">
import { reviewGetters } from '@plentymarkets/shop-sdk';
import {SfRating, SfIconCheck, SfButton, SfRatingButton, SfInput} from '@storefront-ui/vue';
import type { ReviewProps } from '~/components/ui/Review/types';

const props = defineProps<ReviewProps>();

const { reviewItem } = toRefs(props);
const isAnswerFormOpen = ref(false);
const charLimit = 250;
const isCollapsed = ref(true);


const reviewMessage = reviewGetters.getReviewMessage(reviewItem.value);

const isButtonVisible = computed(() => (reviewMessage?.length || 0) > charLimit);

const truncatedContent = computed(() =>
  isButtonVisible.value && isCollapsed.value ? `${reviewMessage?.slice(0, Math.max(0, charLimit))}...` : reviewMessage,
);
</script>
