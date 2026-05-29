<template>
  <div v-if="block" class="p-4">
    <h2 class="font-bold mb-4 text-lg">Kundenrezensionen</h2>

    <div class="mb-6">
      <UiFormLabel>Section title</UiFormLabel>
      <SfInput v-model="block.content.title" type="text" placeholder="Kundenrezensionen" />
    </div>

    <hr class="my-4 border-gray-200" />

    <div v-for="(review, index) in block.content.reviews" :key="review.id" class="mb-4">
      <UiAccordionItem summary-class="p-4 font-bold border-b hover:bg-gray-50">
        <template #summary>
          <div class="flex justify-between w-full items-center gap-2">
            <span>Review {{ index + 1 }} — {{ review.name || 'Untitled' }}</span>
            <SfButton
              variant="tertiary"
              size="sm"
              class="text-red-500 shrink-0"
              @click.stop="removeReview(index)"
            >
              Delete
            </SfButton>
          </div>
        </template>

        <div class="p-4 flex flex-col gap-4 bg-gray-50">
          <div>
            <UiFormLabel>Name</UiFormLabel>
            <SfInput v-model="review.name" type="text" placeholder="Customer name" />
          </div>

          <div>
            <UiFormLabel>Initials (optional)</UiFormLabel>
            <SfInput v-model="review.initials" type="text" maxlength="2" placeholder="Auto from name" />
          </div>

          <div>
            <UiFormLabel>Date label (optional)</UiFormLabel>
            <SfInput v-model="review.when" type="text" placeholder="e.g. vor 2 Jahren — leave empty for auto" />
          </div>

          <div>
            <UiFormLabel>Rating (1–5)</UiFormLabel>
            <select
              v-model.number="review.rating"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option v-for="n in 5" :key="n" :value="n">{{ n }} stars</option>
            </select>
          </div>

          <div>
            <UiFormLabel>Review text</UiFormLabel>
            <SfTextarea v-model="review.text" class="w-full min-h-[120px]" placeholder="Review content..." />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <UiFormLabel>Avatar background</UiFormLabel>
              <SfInput v-model="review.avatar.bg" type="color" />
            </div>
            <div>
              <UiFormLabel>Avatar text color</UiFormLabel>
              <SfInput v-model="review.avatar.text" type="color" />
            </div>
          </div>
        </div>
      </UiAccordionItem>
    </div>

    <SfButton class="w-full" variant="secondary" @click="addReview">+ Add review</SfButton>
  </div>

  <div v-else class="p-4 text-red-600 bg-red-50">
    <p class="font-bold">Error: Loading block...</p>
    <p class="text-xs">If this persists, delete the block and add it again.</p>
  </div>
</template>

<script setup lang="ts">
import { SfButton, SfInput, SfTextarea } from '@storefront-ui/vue';
import type { HomeReviewItem, HomeReviewsContent } from './types';
import { getDefaultHomeReviewsContent } from './defaults';

const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();

const ensureContent = (content: HomeReviewsContent) => {
  if (!content.title) {
    content.title = 'Kundenrezensionen';
  }
  if (!Array.isArray(content.reviews) || content.reviews.length === 0) {
    content.reviews = getDefaultHomeReviewsContent().reviews ?? [];
  }
  content.reviews.forEach((review) => {
    if (!review.id) {
      review.id = `review-${Math.random().toString(36).slice(2, 9)}`;
    }
    if (!review.rating) {
      review.rating = 5;
    }
    if (!review.avatar) {
      review.avatar = { bg: '#64748B', text: '#FFFFFF' };
    }
  });
};

const block = computed(() => {
  if (!data.value || !blockUuid.value) return null;

  const foundBlock = findOrDeleteBlockByUuid(data.value, blockUuid.value);
  if (!foundBlock) return null;

  const b = foundBlock as { content?: HomeReviewsContent };
  if (!b.content) {
    b.content = getDefaultHomeReviewsContent();
  } else {
    ensureContent(b.content);
  }

  return b;
});

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `review-${Math.random().toString(36).slice(2, 9)}`;

const addReview = () => {
  if (!block.value?.content.reviews) return;

  const item: HomeReviewItem = {
    id: generateId(),
    name: 'New customer',
    initials: 'N',
    when: '',
    rating: 5,
    text: '',
    avatar: { bg: '#64748B', text: '#FFFFFF' },
  };
  block.value.content.reviews.push(item);
};

const removeReview = (index: number) => {
  block.value?.content.reviews?.splice(index, 1);
};
</script>
