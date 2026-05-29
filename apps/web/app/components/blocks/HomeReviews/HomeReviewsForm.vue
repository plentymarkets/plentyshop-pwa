<template>
  <div v-if="content" class="p-4">
    <h2 class="font-bold mb-4 text-lg">Kundenrezensionen</h2>

    <div class="mb-6">
      <UiFormLabel>Section title</UiFormLabel>
      <SfInput v-model="content.title" type="text" placeholder="Kundenrezensionen" />
    </div>

    <hr class="my-4 border-gray-200" />

    <div v-for="(review, index) in content.reviews" :key="review.id" class="mb-4">
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

type FormReviewItem = HomeReviewItem & {
  avatar: { bg: string; text: string };
  rating: 1 | 2 | 3 | 4 | 5;
};

type HomeReviewsFormContent = {
  title: string;
  reviews: FormReviewItem[];
};

const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();

const normalizeReview = (review: HomeReviewItem): FormReviewItem => ({
  id: review.id || `review-${Math.random().toString(36).slice(2, 9)}`,
  name: review.name ?? '',
  initials: review.initials ?? '',
  when: review.when ?? '',
  rating: (review.rating ?? 5) as 1 | 2 | 3 | 4 | 5,
  text: review.text ?? '',
  avatar: review.avatar ?? { bg: '#64748B', text: '#FFFFFF' },
});

const ensureContent = (raw: HomeReviewsContent): HomeReviewsFormContent => {
  const defaults = getDefaultHomeReviewsContent();
  const source =
    Array.isArray(raw.reviews) && raw.reviews.length > 0 ? raw.reviews : (defaults.reviews ?? []);

  return {
    title: raw.title || defaults.title || 'Kundenrezensionen',
    reviews: source.map(normalizeReview),
  };
};

const content = computed<HomeReviewsFormContent | null>(() => {
  if (!data.value || !blockUuid.value) return null;

  const foundBlock = findOrDeleteBlockByUuid(data.value, blockUuid.value);
  if (!foundBlock) return null;

  const block = foundBlock as { content?: HomeReviewsContent };
  const next = ensureContent(block.content ?? {});
  block.content = next;

  return next;
});

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `review-${Math.random().toString(36).slice(2, 9)}`;

const addReview = () => {
  if (!content.value) return;

  content.value.reviews.push({
    id: generateId(),
    name: 'New customer',
    initials: 'N',
    when: '',
    rating: 5,
    text: '',
    avatar: { bg: '#64748B', text: '#FFFFFF' },
  });
};

const removeReview = (index: number) => {
  content.value?.reviews.splice(index, 1);
};
</script>
