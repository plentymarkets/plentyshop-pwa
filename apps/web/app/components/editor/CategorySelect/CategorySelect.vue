<template>
  <Multiselect
    ref="multiselectRef"
    :model-value="selectedCategory"
    :options="categories"
    :placeholder="getEditorTranslation('placeholder')"
    :deselect-label="getEditorTranslation('deselect-label')"
    :data-testid="dataTestId"
    :loading="isLoading"
    :searchable="true"
    :internal-search="false"
    :preserve-search="true"
    :custom-label="categoryCustomLabel"
    label="name"
    track-by="id"
    select-label=""
    class="w-full cursor-pointer"
    @update:model-value="onCategorySelected"
    @search-change="handleSearch"
    @open="handleDropdownOpen"
    @close="handleDropdownClose"
  >
    <template #afterList>
      <div v-if="hasMorePages" ref="loadMoreTrigger" class="p-2 text-center text-sm text-gray-500">
        {{ isLoading ? getEditorTranslation('loading') : getEditorTranslation('scroll-for-more') }}
      </div>
      <div v-else-if="categories.length > 0" class="p-2 text-center text-xs text-gray-400">
        {{ getEditorTranslation('all-loaded') }}
      </div>
    </template>
  </Multiselect>
</template>

<script setup lang="ts">
import type { CategorySelectProps, CategoryOption } from './types';
import type { CategoryEntry } from '@plentymarkets/shop-api';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

const props = defineProps<CategorySelectProps>();

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
}>();

const multiselectRef = ref<InstanceType<typeof Multiselect> | null>(null);
const loadMoreTrigger = ref<HTMLElement | null>(null);
const categories = ref<CategoryOption[]>([]);
const isLoading = ref(false);
const currentPage = ref(1);
const hasMorePages = ref(true);
const currentSearchQuery = ref('');
let observer: IntersectionObserver | null = null;

const { data, getCategories } = useCategoriesSearch();
const { send } = useNotification();

const mapSearchResultsToOptions = (entries: CategoryEntry[]): CategoryOption[] => {
  return entries
    .filter((category) => category.right !== 'customer')
    .map((category) => ({
      id: category.id.toString(),
      name: category.details[0]?.name ?? '',
    }));
};

const loadCategories = async (query: string, page: number, append: boolean = false) => {
  isLoading.value = true;

  try {
    await getCategories({
      ...props.baseSearchParams,
      page,
      itemsPerPage: 50,
      ...(query ? { name: `like:${query}` } : {}),
      ...(props.modelValue && page === 1 ? { pinnedId: props.modelValue } : {}),
    });

    const newOptions = mapSearchResultsToOptions(data.value.entries);

    if (append) {
      const existingIds = new Set(categories.value.map((c) => c.id));
      const uniqueNewOptions = newOptions.filter((c) => !existingIds.has(c.id));
      categories.value = [...categories.value, ...uniqueNewOptions];
    } else {
      categories.value = newOptions;
    }

    hasMorePages.value = !data.value.isLastPage;

    return true;
  } catch {
    if (!append) categories.value = [];
    send({ type: 'negative', message: getEditorTranslation('error-loading') });
    return false;
  } finally {
    isLoading.value = false;
  }
};

const loadNextPage = async () => {
  if (!hasMorePages.value || isLoading.value) return;

  const nextPage = currentPage.value + 1;
  const success = await loadCategories(currentSearchQuery.value, nextPage, true);

  if (success) currentPage.value = nextPage;
};

const setupIntersectionObserver = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  nextTick(() => {
    if (!loadMoreTrigger.value) return;

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMorePages.value && !isLoading.value) loadNextPage();
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '50px',
      },
    );

    observer.observe(loadMoreTrigger.value);
  });
};

const handleDropdownOpen = () => {
  setupIntersectionObserver();
};

const handleDropdownClose = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
};

const handleSearch = debounce(async (query: string) => {
  const q = query?.trim();
  currentSearchQuery.value = q;
  currentPage.value = 1;
  hasMorePages.value = true;

  await loadCategories(q, 1, false);

  if (multiselectRef.value) setupIntersectionObserver();
}, 500);

const categoryCustomLabel = (option: CategoryOption) => `[${option.id}] ${option.name}`;

const selectedCategory = computed(() => {
  if (!props.modelValue) return null;
  return categories.value.find((category) => category.id === props.modelValue) ?? null;
});

const onCategorySelected = (category: CategoryOption | null) => {
  emit('update:modelValue', category?.id ?? null);
};

onMounted(() => handleSearch(''));

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<i18n lang="json">
{
  "en": {
    "placeholder": "Search categories...",
    "deselect-label": "Selected",
    "error-loading": "Failed to load categories",
    "loading": "Loading more...",
    "scroll-for-more": "Scroll for more",
    "all-loaded": "All categories loaded"
  },
  "de": {
    "placeholder": "Search categories...",
    "deselect-label": "Selected",
    "error-loading": "Failed to load categories",
    "loading": "Loading more...",
    "scroll-for-more": "Scroll for more",
    "all-loaded": "All categories loaded"
  }
}
</i18n>
