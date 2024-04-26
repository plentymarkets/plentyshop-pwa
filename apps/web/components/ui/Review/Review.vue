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
  </article>
</template>

<script setup lang="ts">
import { reviewGetters } from '@plentymarkets/shop-api';
import { SfRating, SfIconCheck } from '@storefront-ui/vue';
import type { ReviewProps } from '~/components/ui/Review/types';

const props = defineProps<ReviewProps>();

const { reviewItem } = toRefs(props);

const charLimit = 250;
const isCollapsed = ref(true);

const reviewMessage = reviewGetters.getReviewMessage(reviewItem.value);

const isButtonVisible = computed(() => (reviewMessage?.length || 0) > charLimit);

const truncatedContent = computed(() =>
  isButtonVisible.value && isCollapsed.value ? `${reviewMessage?.slice(0, Math.max(0, charLimit))}...` : reviewMessage,
);
</script>
