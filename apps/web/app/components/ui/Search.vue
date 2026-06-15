<template>
  <div ref="rootRef" :class="['py-1 z-popover @container/search', props.close ? 'relative' : '']">
    <form ref="referenceRef" role="search" class="px-px" @submit.prevent="handleSubmit">
      <SfInput
        id="search-bar"
        ref="inputReference"
        v-model="inputModel"
        data-testid="search-bar-input"
        :aria-label="t('common.actions.search')"
        :placeholder="t('common.actions.search')"
        @focus="handleOpen"
      >
        <template #prefix>
          <SfLoaderCircular v-if="loading || loadingSuggestions" class="shrink-0" aria-hidden="true" />
          <SfIconSearch v-else class="shrink-0" aria-hidden="true" />
        </template>
        <template #suffix>
          <button
            v-if="inputModel"
            type="button"
            :aria-label="t('common.actions.resetSearch')"
            class="flex rounded-md focus-visible:outline focus-visible:outline-offset"
            @click="handleReset"
          >
            <SfIconCancel aria-hidden="true" />
          </button>
        </template>
      </SfInput>
    </form>

    <Teleport to="body" :disabled="!!props.close">
      <section
        v-if="isDropdownVisible"
        ref="dropdownRef"
        :class="dropdownClass"
        :style="dropdownStyle"
        aria-live="polite"
        aria-relevant="all"
        :aria-label="t('searchBar.searchSuggestions')"
      >
        <div class="flex-1 overflow-y-auto">
          <div class="max-w-screen-2xl mx-auto px-5 @md/dropdown:px-8 py-5 @md/dropdown:py-7">
            <div class="grid grid-cols-1 @lg/dropdown:grid-cols-search-dropdown gap-7 @lg/dropdown:gap-9">
              <div class="@lg/dropdown:pr-9 @lg/dropdown:border-r @lg/dropdown:border-neutral-200">
                <div v-if="results?.suggestions?.length" class="mb-6">
                  <h3 class="text-2xs font-medium tracking-widest uppercase text-neutral-500 mb-2.5">
                    {{ t('searchBar.searchSuggestions') }}
                  </h3>
                  <ul class="flex flex-col gap-0.5">
                    <li v-for="(item, index) in results.suggestions" :key="index">
                      <UiSearchSuggestionItem :item="item" />
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 class="text-2xs font-medium tracking-widest uppercase text-neutral-500 mb-2.5">
                    {{ t('searchBar.matchingCategories') }}
                  </h3>
                  <ul v-if="results?.categories?.length" class="flex flex-wrap gap-1.5">
                    <li v-for="(category, index) in results.categories" :key="index">
                      <NuxtLink
                        :to="category.url"
                        class="inline-flex items-center h-8 px-3 text-xs text-neutral-900 bg-neutral-100 rounded-full border border-transparent hover:border-neutral-900 hover:bg-white transition-colors duration-150"
                      >
                        {{ category.label }}
                      </NuxtLink>
                    </li>
                  </ul>
                  <div v-else class="text-sm text-neutral-500">{{ t('searchBar.noResultsFound') }}</div>
                </div>
              </div>

              <div class="min-w-0 @container/products">
                <h3 class="text-2xs font-medium tracking-widest uppercase text-neutral-500 mb-2.5">
                  {{ t('searchBar.productSuggestions') }}
                </h3>
                <ul
                  v-if="results?.items?.length"
                  class="grid grid-cols-1 @xs/products:grid-cols-2 @md/products:grid-cols-4 gap-x-5 gap-y-6 items-start"
                >
                  <li v-for="(item, index) in results.items" :key="index">
                    <UiSearchSuggestionProduct :item="item" />
                  </li>
                </ul>
                <div v-else class="text-sm text-neutral-500">{{ t('searchBar.noResultsFound') }}</div>
              </div>
            </div>
          </div>
        </div>

        <NuxtLink
          v-if="results?.total"
          :to="getSearchPath(searchTerm)"
          class="border-t border-neutral-200 hover:bg-neutral-50 transition-colors duration-150"
        >
          <div
            class="max-w-screen-2xl mx-auto px-5 @md/dropdown:px-8 h-12 flex items-center gap-2 text-sm font-medium text-neutral-900 overflow-hidden"
          >
            <span class="flex items-center gap-1 min-w-0">
              <template v-for="(part, i) in searchLinkParts" :key="i">
                <span v-if="part === '{{SEARCH_TERM}}'" class="truncate font-semibold">{{ searchTerm }}</span>
                <span v-else-if="part === '{{HITS_COUNT}}'" class="shrink-0 text-neutral-500 font-normal">{{
                  results?.total
                }}</span>
                <span v-else class="shrink-0 whitespace-pre">{{ part }}</span>
              </template>
            </span>
            <SfIconChevronRight class="ml-auto shrink-0 text-neutral-500" size="sm" aria-hidden="true" />
          </div>
        </NuxtLink>
      </section>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { SfIconCancel, SfIconChevronRight, SfIconSearch, SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import { onClickOutside, unrefElement } from '@vueuse/core';
import { debounce } from '~/utils/debounce';

const props = defineProps<{
  close?: () => boolean;
}>();

const localePath = useLocalePath();
const router = useRouter();
const route = useRoute();
const { updateSearchTerm } = useCategoryFilter();
const { loading } = useSearch();
const rootRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const dropdownBounds = ref({ top: 0, left: 0, width: 0 });
const previewContainer = inject('previewContainer', ref<HTMLElement | null>(null));

const dropdownClass = computed(() => {
  const base =
    'z-popover bg-white border-y border-neutral-200 shadow-xl flex flex-col max-h-dropdown @container/dropdown';
  return props.close ? `absolute inset-x-0 top-full ${base}` : `fixed ${base}`;
});

const dropdownStyle = computed(() => {
  if (props.close) {
    return undefined;
  }
  return {
    top: `${dropdownBounds.value.top}px`,
    left: `${dropdownBounds.value.left}px`,
    width: `${dropdownBounds.value.width}px`,
  };
});

const updateDropdownBounds = () => {
  let el = rootRef.value;
  while (el && el.tagName !== 'HEADER') {
    el = el.parentElement;
  }
  const headerBottom = el ? el.getBoundingClientRect().bottom : 0;

  const container = previewContainer.value;
  const left = container ? container.getBoundingClientRect().left : 0;
  const width = container ? container.getBoundingClientRect().width : window.innerWidth;

  dropdownBounds.value = { top: headerBottom, left, width };
};

const {
  results,
  searchSuggestions,
  searchTerm,
  loading: loadingSuggestions,
  resetSuggestions,
} = useSearchSuggestions();
const { emit } = usePlentyEvent();
const { t } = useI18n();

const searchLinkParts = computed(() => {
  const translated = t('searchBar.showAllResults', {
    searchTerm: '{{SEARCH_TERM}}',
    hitsCount: '{{HITS_COUNT}}',
  });
  return translated.split(/({{SEARCH_TERM}}|{{HITS_COUNT}})/);
});

const inputModel = ref('');
const inputReference = ref<HTMLSpanElement>();

const isDropdownVisible = computed(() => {
  const value = inputModel.value.trim().slice(0, 80);

  return isOpen.value && value.length > 1 && searchTerm.value === value;
});
const handleInputFocus = () => {
  const inputElement = unrefElement(inputReference)?.querySelector('input');
  inputElement?.focus();
};
const handleReset = () => {
  inputModel.value = '';
  handleInputFocus();
};
const handleSubmit = () => {
  handleClose();
  props.close?.();
  updateSearchTerm(inputModel.value);
  emit('frontend:searchProduct', inputModel.value);
  router.push({ path: localePath(paths.search), query: { term: inputModel.value } });
  handleReset();
};
const handleSearch = () => {
  if (inputModel.value.length > 1) {
    handleOpen();
    searchSuggestions(inputModel.value);
  }
};
const debounceInput = debounce(handleSearch, 250);

const handleOpen = () => {
  isOpen.value = true;
};

const handleClose = () => {
  isOpen.value = false;
};

onClickOutside(
  rootRef,
  () => {
    handleClose();
  },
  { ignore: [dropdownRef] },
);

watch(isDropdownVisible, (visible) => {
  if (props.close) {
    return;
  }
  if (visible) {
    nextTick(updateDropdownBounds);
    window.addEventListener('scroll', updateDropdownBounds, true);
    window.addEventListener('resize', updateDropdownBounds);
  } else {
    window.removeEventListener('scroll', updateDropdownBounds, true);
    window.removeEventListener('resize', updateDropdownBounds);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateDropdownBounds, true);
  window.removeEventListener('resize', updateDropdownBounds);
});

watch(inputModel, () => {
  if (inputModel.value === '') {
    resetSuggestions();
    handleClose();
    return;
  }
  if (inputModel.value.length > 1) {
    debounceInput();
  }
});

watch(
  () => route.fullPath,
  () => {
    inputModel.value = '';
    resetSuggestions();
    handleClose();
  },
);

onUnmounted(() => debounceInput.cancel());
</script>
