<template>
  <div class="mt-8 flex items-center justify-center p-4">
    <div class="w-full text-center items-center">
      <h1 class="text-3xl md:text-4xl font-semibold mb-4">
        {{ t('error.pageNotFoundTitle') }}
      </h1>

      <p class="text-xl text-gray-600 leading-relaxed">
        {{ t('error.pageNotFoundSubtitle') }}
      </p>

      <div class="flex justify-center my-8">
        <UiSearch class="w-96" :initial-query="suggestedSearchTerm" :auto-submit="shouldAutoSubmit" />
      </div>

      <div class="flex justify-center gap-2 overflow-x-auto scrollbar-hide flex-wrap">
        <UiButton
          v-for="category in categoryTree"
          :key="category.id"
          :tag="NuxtLink"
          :to="localePath('/' + categoryTreeGetters.getSlug(category))"
          variant="secondary"
        >
          {{ categoryTreeGetters.getName(category) }}
        </UiButton>
      </div>

      <div class="rounded-lg mt-8 sm:p-6 text-left">
        <ProductSlider :items="products" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { categoryTreeGetters } from '@plentymarkets/shop-api';

const { data: categoryTree } = useCategoryTree();
const localePath = useLocalePath();
const route = useRoute();
const { availableLocales } = useNuxtApp().$i18n;
const requestUrl = useRequestURL();
const NuxtLink = resolveComponent('NuxtLink');

const toSearchTerm = (path: string) => {
  const decodedPath = decodeURIComponent(path || '/');
  const withoutQuery = decodedPath.split('?')[0] ?? '';
  const cleanedPath = withoutQuery.split('#')[0] ?? '';
  const segments = cleanedPath.split('/').filter(Boolean);

  const firstSegment = segments[0];
  const normalizedSegments = firstSegment && (availableLocales as string[]).includes(firstSegment) ? segments.slice(1) : segments;

  const slug = normalizedSegments.join(' ');
  const withoutTrailingNumericSuffix = slug.replace(/_[0-9_]+$/g, '');
  const normalized = withoutTrailingNumericSuffix
    .replace(/[-_]+/g, ' ')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized;
};

const unresolvedPath = computed(() => {
  if (import.meta.client && typeof window !== 'undefined') {
    return window.location.pathname;
  }

  return route.path || requestUrl.pathname || '/';
});

const suggestedSearchTerm = computed(() => toSearchTerm(unresolvedPath.value));
const shouldAutoSubmit = computed(() => suggestedSearchTerm.value.length >= 3);

const { data } = await useAsyncData('404-products', () =>
  useSdk().plentysystems.getFacet({
    type: 'all',
    itemsPerPage: 20,
  }),
);

const products = computed(() => data?.value?.data.products || []);
</script>
