<template>
  <div class="relative py-1 z-[200] @container/search">
    <form ref="referenceRef" role="search" class="px-px" @submit.prevent="handleSubmit">
      <SfInput
        id="search-bar"
        ref="inputReference"
        v-model="inputModel"
        data-testid="search-bar-input"
        :aria-label="t('common.actions.search')"
        :placeholder="t('common.actions.search')"
        @focus="open"
      >
        <template #prefix>
          <SfLoaderCircular v-if="loading || loadingSuggestions" />
          <SfIconSearch v-else />
        </template>
        <template #suffix>
          <button
            v-if="inputModel"
            type="button"
            :aria-label="t('common.actions.resetSearch')"
            class="flex rounded-md focus-visible:outline focus-visible:outline-offset"
            @click="handleReset"
          >
            <SfIconCancel />
          </button>
        </template>
      </SfInput>
    </form>

    <div
      v-if="inputModel.length > 1 && searchTerm === inputModel"
      class="w-full grid md:shadow @2xl:grid-cols-3 @3xl:grid-cols-4 bg-white absolute px-4 pt-4 rounded-b-xl border border-neutral-100 mt-[2px] gap-8 max-h-[calc(100vh-120px)] overflow-y-scroll"
    >
      <div class="w-full @2xl:col-span-1">
        <div v-if="results?.suggestions?.length" class="mb-8">
          <NuxtLink
            v-for="(suggestion, index) in results.suggestions"
            :key="index"
            :to="getSearchPath(suggestion.label)"
            class="flex items-center py-2 px-4 gap-2 text-neutral-500 cursor-pointer hover:bg-neutral-100 transition duration-200 ease-in-out"
          >
            <SfIconSearch size="sm" />
            <span class="text-black">
              <template v-if="getHighlightParts(suggestion.label).match">
                {{ getHighlightParts(suggestion.label).before }}<b>{{ getHighlightParts(suggestion.label).match }}</b
                >{{ getHighlightParts(suggestion.label).after }}
              </template>
              <template v-else>{{ suggestion.label }}</template>
            </span>

            <span>({{ suggestion.count }})</span>
          </NuxtLink>
        </div>

        <div class="uppercase tracking-widest text-sm font-bold text-neutral-700">Matching categories</div>
        <hr class="h-px mt-2 bg-neutral-200 border-0" />
        <div class="@2xl:mb-4">
          <div v-if="results?.categories?.length" class="mt-4 flex flex-wrap gap-1.5 @2xl:flex-col @2xl:items-start">
            <NuxtLink v-for="(category, index) in results.categories" :key="index" :to="category.url">
              <div
                class="bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200 text-neutral-800 text-sm px-3 py-1.5 rounded-md"
              >
                {{ category.label }}
              </div>
            </NuxtLink>
          </div>
          <div v-else class="text-base mt-4 text-neutral-900">No results found.</div>
        </div>
      </div>

      <div class="w-full @2xl:col-span-2 @3xl:col-span-3 @container/products @2xl:mb-4">
        <div class="flex items-center justify-between gap-2">
          <div class="uppercase tracking-widest text-sm font-bold text-neutral-700 shrink-0">Product Suggestions</div>
          <NuxtLink
            v-if="results"
            :to="getSearchPath(searchTerm)"
            class="hidden @2xl/search:flex text-neutral-900 text-sm font-medium underline underline-offset-4 min-w-0 shrink"
          >
            <span class="shrink-0">See all {{ results?.total }} results for "</span>
            <span class="truncate">{{ searchTerm }}</span>
            <span class="shrink-0">"</span>
          </NuxtLink>
        </div>

        <hr class="h-px mt-2 bg-neutral-200 border-0" />
        <div class="mt-4 gap-4 grid @sm/products:grid-cols-2 @md:grid-cols-3 items-stretch">
          <template v-if="results?.items?.length">
            <NuxtLink v-for="(item, index) in results.items" :key="index" :to="item.url">
              <div class="border border-neutral-200 rounded-md h-full">
                <div class="flex items-center justify-center">
                  <NuxtImg :src="item.image" :alt="item.imageAlt" class="object-contain rounded-md aspect-[3/2]" />
                </div>
                <hr class="h-px bg-neutral-200 border-0" />
                <div class="p-2">
                  <div class="text-sm font-medium text-neutral-900">{{ item.label }}</div>
                  <div class="text-sm">
                    <span class="text-gray-900 font-semibold">{{ item.price.formatted }}</span>
                    <span class="text-neutral-500 ml-2 text-xs line-through">399,99 €</span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </template>
          <div v-else class="text-base text-neutral-900">No results found.</div>
        </div>
      </div>
      <NuxtLink
        v-if="results"
        :to="getSearchPath(searchTerm)"
        class="sticky bottom-0 @2xl:hidden px-2 py-4 bg-white text-base underline underline-offset-4 text-neutral-900 flex w-full overflow-hidden"
      >
        <span class="shrink-0">See all {{ results.total }} results for "</span>
        <span class="truncate">{{ searchTerm }}</span>
        <span class="shrink-0">"</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconCancel, SfIconSearch, SfInput, useDisclosure, SfLoaderCircular } from '@storefront-ui/vue';
import { unrefElement } from '@vueuse/core';
import { debounce } from '~/utils/debounce';

const props = defineProps<{
  close?: () => boolean;
}>();

const arrOf = ref([0]);
for (let i = 0; i < 3; i++) {
  arrOf.value.push(i);
}

const localePath = useLocalePath();
const router = useRouter();
const { open } = useDisclosure();
const { updateSearchTerm } = useCategoryFilter();
const { loading } = useSearch();
const { results, searchSuggestions, searchTerm, loading: loadingSuggestions } = useSearchSuggestions();
const { emit } = usePlentyEvent();

const inputModel = ref('');
const inputReference = ref<HTMLSpanElement>();
const getHighlightParts = (text: string) => {
  if (!inputModel.value) return { before: text, match: '', after: '' };
  const escaped = inputModel.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'i');
  const parts = text.split(regex);
  // parts: [before, match, after]
  return {
    before: parts[0] ?? '',
    match: parts[1] ?? '',
    after: parts[2] ?? '',
  };
};
const handleInputFocus = () => {
  const inputElement = unrefElement(inputReference)?.querySelector('input');
  inputElement?.focus();
};
const handleReset = () => {
  inputModel.value = '';
  handleInputFocus();
};
const handleSubmit = () => {
  props.close?.();
  updateSearchTerm(inputModel.value);
  emit('frontend:searchProduct', inputModel.value);
  router.push({ path: localePath(paths.search), query: { term: inputModel.value } });
  handleReset();
};
const handleSearch = () => {
  if (inputModel.value.length > 1) {
    searchSuggestions(inputModel.value);
  }
};
const debounceInput = debounce(handleSearch, 500);

const getSearchPath = (suggestion: string) => {
  return `${localePath(paths.search)}?term=${encodeURIComponent(suggestion)}`;
};

watch(inputModel, () => {
  if (inputModel.value === '') {
    handleReset();
  }
  if (inputModel.value.length > 1) {
    debounceInput();
  }
});
</script>
