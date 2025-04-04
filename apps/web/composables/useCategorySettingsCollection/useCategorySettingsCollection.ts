import type { Category } from '@plentymarkets/shop-api';

interface useCategorySettingsCollectionState {
  data: Category[];
  initialData: Category[];
}

export const useCategorySettingsCollection = () => {
  const state = useState<useCategorySettingsCollectionState>('categorySettingsCollection', () => ({
    data: [],
    initialData: [],
  }));

  const addCategorySettings = async (category: Category) => {
    const exists = state.value.data.some((item) => item.id === category.id);
    if (exists) return;

    state.value.data.push(category);
    state.value.initialData.push(JSON.parse(JSON.stringify(category)));
  };

  const hasChanges = computed(() => {
    return JSON.stringify(state.value.data) !== JSON.stringify(state.value.initialData);
  });

  return {
    ...toRefs(state.value),
    addCategorySettings,
    hasChanges,
  };
};
