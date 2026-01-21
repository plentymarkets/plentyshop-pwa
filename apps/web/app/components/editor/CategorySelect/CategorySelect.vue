<template>
  <Multiselect
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
    @open="handleOpen"
  />
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

const categories = ref<CategoryOption[]>([]);
const isLoading = ref(false);
const currentPage = ref(1);
const hasMorePages = ref(true);
const currentSearchQuery = ref('');

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
      ...(props.modelValue ? { pinnedId: props.modelValue } : {}),
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
  } catch {
    categories.value = [];
    send({
      type: 'negative',
      message: getEditorTranslation('error-loading'),
    });
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = debounce(async (query: string) => {
  const q = query?.trim();
  currentSearchQuery.value = q;
  currentPage.value = 1;
  hasMorePages.value = true;

  await loadCategories(q, 1, false);
}, 500);

const handleOpen = async () => {
  if (hasMorePages.value && categories.value.length > 0) {
    currentPage.value++;
    await loadCategories(currentSearchQuery.value, currentPage.value, true);
  }
};

const categoryCustomLabel = (option: CategoryOption) => `[${option.id}] ${option.name}`;

const selectedCategory = computed(() => {
  if (!props.modelValue) return null;
  return categories.value.find((category) => category.id === props.modelValue) ?? null;
});

const onCategorySelected = (category: CategoryOption | null) => {
  emit('update:modelValue', category?.id ?? null);
};

onMounted(() => handleSearch(''));
</script>

<i18n lang="json">
{
  "en": {
    "placeholder": "Search categories...",
    "deselect-label": "Selected",
    "error-loading": "Failed to load categories"
  },
  "de": {
    "placeholder": "Search categories...",
    "deselect-label": "Selected",
    "error-loading": "Kategorien konnten nicht geladen werden"
  }
}
</i18n>
