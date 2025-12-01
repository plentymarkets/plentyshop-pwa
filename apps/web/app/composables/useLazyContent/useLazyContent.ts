import { ref, computed } from "vue";

export function useLazyContent() {
  const { categoryTemplateData, fetchCategoryTemplate } = useCategoryTemplate();

  const loading = ref(false);
  const error = ref("");
  const hasLoaded = ref(false);

  const content = computed(() => categoryTemplateData.value?.data ?? "");

  async function loadContent(categoryId: number) {
    loading.value = true;
    error.value = "";

    try {
      await fetchCategoryTemplate(categoryId);
      hasLoaded.value = true;
    } catch {
      error.value = "Der Inhalt konnte nicht geladen werden.";
    } finally {
      loading.value = false;
    }
  }

  return {
    content,
    loading,
    error,
    hasLoaded,
    loadContent
  };
}
